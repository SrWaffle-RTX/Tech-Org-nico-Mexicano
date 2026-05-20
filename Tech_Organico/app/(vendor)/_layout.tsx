import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthContext } from '../../contexts/AuthContext';
import { VendorDrawerNav } from '../../components/vendor/VendorDrawerNav';
import { Colors } from '../../constants/colors';

const TAB_ROUTES = ['dashboard', 'ventas', 'clientes', 'catalogo', 'reportes'] as const;

function useActiveTabIndex(): number {
  const pathname = usePathname();
  const idx = TAB_ROUTES.findIndex(route => pathname.includes(route));
  return idx >= 0 ? idx : 0;
}

export default function VendorLayout() {
  const { role, isLoading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const activeIndex = useActiveTabIndex();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const isRootTab = TAB_ROUTES.some(route => pathname.includes(route));
  const isDetailScreen =
    /\/(clientes|catalogo)\/.+/.test(pathname) && !pathname.endsWith('/agenda');

  useEffect(() => {
    if (!isLoading && role !== 'vendor') {
      router.replace('/(client)/catalogo');
    }
  }, [isLoading, role, router]);

  if (isLoading || role !== 'vendor') return null;

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
        <Tabs.Screen name="dashboard" />
        <Tabs.Screen name="ventas" />
        <Tabs.Screen name="clientes" />
        <Tabs.Screen name="catalogo" />
        <Tabs.Screen name="reportes" />
      </Tabs>

      {/* Botón hamburguesa flotante en esquina superior izquierda */}
      {!menuOpen && isRootTab && !isDetailScreen && (
        <TouchableOpacity
          style={[styles.hamburgerBtn, { top: pathname.includes('dashboard') ? insets.top + 19 : insets.top + 4 }]}
          onPress={() => setMenuOpen(true)}
          activeOpacity={0.7}
        >
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
        </TouchableOpacity>
      )}

      <VendorDrawerNav
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeIndex={activeIndex}
        onNavigate={handleNavigate}
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
    backgroundColor: Colors.verdePrincipal,
    borderRadius: 2,
  },
});
