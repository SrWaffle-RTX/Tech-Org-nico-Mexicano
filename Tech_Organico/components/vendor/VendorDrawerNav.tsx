import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../../contexts/AuthContext';
import { Colors } from '../../constants/colors';

const DRAWER_WIDTH = Math.round(Dimensions.get('window').width * 0.55);
const ANIM_DURATION = 220;

type NavItem = {
  key: string;
  emoji: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', emoji: '📊', label: 'Dashboard' },
  { key: 'ventas',    emoji: '💰', label: 'Ventas' },
  { key: 'clientes',  emoji: '👥', label: 'Clientes' },
  { key: 'catalogo',  emoji: '☕', label: 'Catálogo' },
  { key: 'reportes',  emoji: '📈', label: 'Reportes' },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  activeIndex: number;
  onNavigate: (index: number) => void;
};

export function VendorDrawerNav({ isOpen, onClose, activeIndex, onNavigate }: Props) {
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const { logout } = useAuthContext();
  const router = useRouter();

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

  const handleLogout = () => {
    Alert.alert(
      '¿Salir de la sesión?',
      'Volverás a la pantalla de clientes.',
      [
        { text: 'Quedarse', style: 'cancel' },
        {
          text: 'Continuar',
          style: 'destructive',
          onPress: async () => {
            onClose();
            await logout();
            router.replace('/(client)/catalogo');
          },
        },
      ]
    );
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
        {NAV_ITEMS.map((item, index) => {
          const focused = activeIndex === index;

          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.navItem, focused && styles.navItemFocused]}
              onPress={() => handleNavigate(index)}
              activeOpacity={0.75}
            >
              <Text style={[styles.emoji, focused && styles.emojiFocused]}>
                {item.emoji}
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.label, focused && styles.labelFocused]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Separador y botón cerrar sesión */}
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.logoutItem}
          onPress={handleLogout}
          activeOpacity={0.75}
        >
          <Text style={styles.logoutEmoji}>🚪</Text>
          <Text style={styles.logoutLabel}>Cerrar sesión</Text>
        </TouchableOpacity>
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
  emoji: {
    fontSize: 22,
    opacity: 0.5,
    width: 28,
    textAlign: 'center',
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
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  logoutItem: {
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
  logoutEmoji: {
    fontSize: 22,
    width: 28,
    textAlign: 'center',
  },
  logoutLabel: {
    marginLeft: 14,
    fontSize: 15,
    color: '#C0392B',
    fontWeight: '600',
  },
});
