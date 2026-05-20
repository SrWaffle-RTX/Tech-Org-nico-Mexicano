import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthContext } from '../../contexts/AuthContext';
import { Colors } from '../../constants/colors';
import StatCard from '../../components/vendor/StatCard';
import SalesChart from '../../components/vendor/SalesChart';
import { mockVentasSemana, mockVentasPorProducto } from '../../data/mockOrders';

export default function DashboardScreen() {
  const { user } = useAuthContext();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.bg}
      contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 4 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Buenos días, {user?.nombre ?? 'Admin'} 👋</Text>
          <Text style={styles.subtitle}>Resumen de mayo 2026</Text>
        </View>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.kpiGrid}>
        <StatCard title="Ventas del mes" value="$16,250" subtitle="+12% vs anterior" icon="💰" color={Colors.verdePrincipal} />
        <StatCard title="Pedidos" value="60" subtitle="19 esta semana" icon="📦" color={Colors.verdeSecundario} />
      </View>
      <View style={styles.kpiGrid}>
        <StatCard title="Satisfacción" value="4.8/5" subtitle="92% reseñas positivas" icon="⭐" color={Colors.amarilloCalido} />
        <StatCard title="Top producto" value="Chiapas" subtitle="42 unidades" icon="🏆" color={Colors.tonoTierra} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ventas semanales</Text>
      </View>
      <View style={styles.chartCard}>
        <SalesChart data={mockVentasSemana} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top productos del mes</Text>
      </View>
      {mockVentasPorProducto.slice(0, 3).map((prod, idx) => (
        <View key={prod.cafeId} style={styles.prodRow}>
          <Text style={styles.prodRank}>#{idx + 1}</Text>
          <View style={styles.prodInfo}>
            <Text style={styles.prodNombre}>{prod.nombre}</Text>
            <Text style={styles.prodDetalle}>{prod.unidades} unidades</Text>
          </View>
          <Text style={styles.prodIngreso}>${prod.ingreso.toLocaleString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.neutroClaro },
  scroll: { paddingHorizontal: 16, paddingBottom: 32 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingLeft: 40 },
  greeting: { fontSize: 22, fontWeight: '800', color: Colors.verdeOscuro },
  subtitle: { fontSize: 13, color: Colors.textoSecundario, marginTop: 2 },
  logo: { width: 70, height: 70 },
  kpiGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  sectionHeader: { marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.verdeOscuro },
  chartCard: { backgroundColor: Colors.blanco, borderRadius: 14, padding: 16, marginBottom: 4, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  prodRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.blanco, borderRadius: 12, padding: 14, marginBottom: 8, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
  prodRank: { fontSize: 18, fontWeight: '800', color: Colors.verdePrincipal, width: 32 },
  prodInfo: { flex: 1 },
  prodNombre: { fontSize: 14, fontWeight: '700', color: Colors.textoPrincipal },
  prodDetalle: { fontSize: 12, color: Colors.textoSecundario, marginTop: 2 },
  prodIngreso: { fontSize: 15, fontWeight: '700', color: Colors.verdePrincipal },
});
