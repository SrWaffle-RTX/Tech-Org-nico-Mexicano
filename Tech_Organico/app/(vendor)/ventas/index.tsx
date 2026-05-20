import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { mockOrders, mockVentasSemana } from '../../../data/mockOrders';
import { Colors } from '../../../constants/colors';
import Header from '../../../components/shared/Header';
import SalesChart from '../../../components/vendor/SalesChart';
import Badge from '../../../components/ui/Badge';
import type { OrderStatus } from '../../../types/order';

const statusBadge: Record<OrderStatus, 'primary' | 'success' | 'warning' | 'info' | 'neutral'> = {
  pendiente: 'warning',
  confirmado: 'info',
  enviado: 'primary',
  entregado: 'success',
  cancelado: 'neutral',
};

export default function VentasScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="CRM de ventas" rightAction={{ icon: '📋', onPress: () => router.push('/(vendor)/ventas/historial') }} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SalesChart data={mockVentasSemana} />

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Mes actual</Text>
          <Text style={styles.totalVal}>$16,250</Text>
          <Text style={styles.totalSub}>60 pedidos · promedio $271/pedido</Text>
        </View>

        <Text style={styles.sectionTitle}>Pedidos recientes</Text>
        {mockOrders.map(order => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>#{order.id.slice(-4)} — {order.clienteNombre}</Text>
              <Badge label={order.status} variant={statusBadge[order.status]} />
            </View>
            <Text style={styles.orderFecha}>{new Date(order.fechaCreacion).toLocaleDateString('es-MX')}</Text>
            <View style={styles.orderFooter}>
              <Text style={styles.orderItems}>{order.items.length} producto(s)</Text>
              <Text style={styles.orderTotal}>${order.total}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutroClaro },
  scroll: { padding: 16, paddingBottom: 32 },
  totalCard: { backgroundColor: Colors.verdePrincipal, borderRadius: 14, padding: 20, alignItems: 'center', marginVertical: 16 },
  totalLabel: { fontSize: 13, color: Colors.neutroClaro, opacity: 0.8 },
  totalVal: { fontSize: 36, fontWeight: '800', color: Colors.blanco, marginTop: 4 },
  totalSub: { fontSize: 12, color: Colors.neutroClaro, marginTop: 4, opacity: 0.8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.verdeOscuro, marginBottom: 12 },
  orderCard: { backgroundColor: Colors.blanco, borderRadius: 12, padding: 14, marginBottom: 10, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  orderId: { fontSize: 14, fontWeight: '700', color: Colors.textoPrincipal, flex: 1, marginRight: 8 },
  orderFecha: { fontSize: 12, color: Colors.textoSecundario, marginBottom: 8 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  orderItems: { fontSize: 13, color: Colors.textoSecundario },
  orderTotal: { fontSize: 15, fontWeight: '700', color: Colors.verdePrincipal },
});
