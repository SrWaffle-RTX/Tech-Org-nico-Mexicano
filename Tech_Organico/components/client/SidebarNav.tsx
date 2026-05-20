import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

const DRAWER_WIDTH = Math.round(Dimensions.get('window').width * 0.55);
const ANIM_DURATION = 220;

type NavItem = {
  key: string;
  emoji: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { key: 'catalogo', emoji: '☕', label: 'Catálogo' },
  { key: 'carrito', emoji: '🛒', label: 'Carrito' },
  { key: 'pedidos', emoji: '📦', label: 'Pedidos' },
  { key: 'cuenta', emoji: '👤', label: 'Cuenta' },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  activeIndex: number;
  onNavigate: (index: number) => void;
  cartCount: number;
};

export function SidebarNav({ isOpen, onClose, activeIndex, onNavigate, cartCount }: Props) {
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: isOpen ? 0 : -DRAWER_WIDTH,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: isOpen ? 0.45 : 0,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen]);

  const handleNavigate = (index: number) => {
    onNavigate(index);
    onClose();
  };

  return (
    <>
      {/* Backdrop oscuro al abrir */}
      <Animated.View
        pointerEvents={isOpen ? 'auto' : 'none'}
        style={[styles.backdrop, { opacity: backdropOpacity }]}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Panel del drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 8,
            transform: [{ translateX }],
          },
        ]}
      >
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {NAV_ITEMS.map((item, index) => {
          const focused = activeIndex === index;
          const showBadge = item.key === 'carrito' && cartCount > 0;

          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.navItem, focused && styles.navItemFocused]}
              onPress={() => handleNavigate(index)}
              activeOpacity={0.75}
            >
              <View style={styles.emojiWrap}>
                <Text style={[styles.emoji, focused && styles.emojiFocused]}>
                  {item.emoji}
                </Text>
                {showBadge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
                  </View>
                )}
              </View>
              <Text
                numberOfLines={1}
                style={[styles.label, focused && styles.labelFocused]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 100,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.blanco,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    zIndex: 101,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  logo: {
    width: '70%',
    height: 70,
    alignSelf: 'center',
    marginBottom: 16,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingLeft: 20,
    paddingRight: 12,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 10,
    minHeight: 52,
  },
  navItemFocused: {
    backgroundColor: Colors.neutroClaro,
  },
  emojiWrap: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
    opacity: 0.5,
  },
  emojiFocused: {
    opacity: 1,
  },
  label: {
    marginLeft: 14,
    fontSize: 15,
    color: Colors.textoSecundario,
    flexShrink: 1,
  },
  labelFocused: {
    color: Colors.verdePrincipal,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -7,
    backgroundColor: Colors.amarilloCalido,
    borderRadius: 10,
    minWidth: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.verdeOscuro,
    fontSize: 9,
    fontWeight: '700',
  },
});
