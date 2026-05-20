import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartContext } from '../../contexts/CartContext';
import { SidebarNav } from '../../components/client/SidebarNav';
import { Colors } from '../../constants/colors';

const TAB_ROUTES = ['catalogo', 'carrito', 'pedidos', 'cuenta'] as const;

function useActiveTabIndex(): number {
  const pathname = usePathname();
  const idx = TAB_ROUTES.findIndex(route => pathname.includes(route));
  return idx >= 0 ? idx : 0;
}

export default function ClientLayout() {
  const { count } = useCartContext();
  const router = useRouter();
  const pathname = usePathname();
  const activeIndex = useActiveTabIndex();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const isRootTab = TAB_ROUTES.some(route => pathname.includes(route));

  const handleNavigate = (index: number) => {
    router.navigate(`/${TAB_ROUTES[index]}` as any);
  };

  return (
    <View style={styles.root}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="catalogo" />
        <Tabs.Screen name="carrito" />
        <Tabs.Screen name="pedidos" />
        <Tabs.Screen name="cuenta" />
        <Tabs.Screen name="checkout" options={{ href: null }} />
        <Tabs.Screen name="recorrido" options={{ href: null }} />
      </Tabs>

      {/* Botón hamburguesa flotante en la esquina del header */}
      {!menuOpen && isRootTab && (
        <TouchableOpacity
          style={[styles.hamburgerBtn, { top: insets.top + 8 }]}
          onPress={() => setMenuOpen(true)}
          activeOpacity={0.7}
        >
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
        </TouchableOpacity>
      )}

      <SidebarNav
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeIndex={activeIndex}
        onNavigate={handleNavigate}
        cartCount={count}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hamburgerBtn: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    gap: 5,
  },
  line: {
    width: 22,
    height: 2.5,
    backgroundColor: Colors.blanco,
    borderRadius: 2,
  },
});
