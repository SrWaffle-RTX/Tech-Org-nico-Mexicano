import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { mockOrders } from '../../../data/mockOrders';
import { useOrdersContext } from '../../../contexts/OrdersContext';
import { Colors } from '../../../constants/colors';
import Header from '../../../components/shared/Header';
import Badge from '../../../components/ui/Badge';
import type { OrderStatus } from '../../../types/order';

const statusBadge: Record<OrderStatus, 'primary' | 'success' | 'warning' | 'info' | 'neutral'> = {
  pendiente: 'warning',
  confirmado: 'info',
  enviado: 'primary',
  entregado: 'success',
  cancelado: 'neutral',
};

const statusSteps: OrderStatus[] = ['pendiente', 'confirmado', 'enviado', 'entregado'];

export default function PedidoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrderById } = useOrdersContext();
  const order = getOrderById(id ?? '') ?? mockOrders.find(o => o.id === id);

  if (!order) return (
    <View style={styles.container}>
      <Header title="Pedido" showBack />
      <Text style={styles.notFound}>Pedido no encontrado.</Text>
    </View>
  );

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <View style={styles.container}>
      <Header title={`Pedido #${order.id.slice(-4)}`} showBack />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.statusCard}>
          <Badge label={order.status} variant={statusBadge[order.status]} />
          <Text style={styles.statusDate}>
            {new Date(order.fechaCreacion).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
        </View>

        <View style={styles.stepper}>
          {statusSteps.map((step, idx) => (
            <View key={step} style={styles.stepRow}>
              <View style={[styles.stepCircle, idx <= currentStep && styles.stepCircleActive]}>
                <Text style={styles.stepNum}>{idx + 1}</Text>
              </View>
              <Text style={[styles.stepLabel, idx <= currentStep && styles.stepLabelActive]}>
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>Productos</Text>
        {order.items.map(item => (
          <View key={item.cafe.id} style={styles.itemRow}>
            <Text style={styles.itemNombre}>{item.cafe.nombre}</Text>
            <Text style={styles.itemQty}>{item.cantidad} × ${item.cafe.precio}</Text>
            <Text style={styles.itemSub}>${item.cafe.precio * item.cantidad}</Text>
          </View>
        ))}

        <Text style={styles.section}>Entrega</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Dirección</Text>
          <Text style={styles.infoValue}>{order.direccionEntrega}</Text>
          <Text style={styles.infoLabel}>Método de pago</Text>
          <Text style={styles.infoValue}>{order.metodoPago}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalVal}>${order.total}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutroClaro },
  scroll: { padding: 20, paddingBottom: 40 },
  notFound: { textAlign: 'center', marginTop: 40, color: Colors.textoSecundario },
  statusCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.blanco, borderRadius: 12, padding: 16, marginBottom: 20 },
  statusDate: { fontSize: 13, color: Colors.textoSecundario },
  stepper: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.blanco, borderRadius: 12, padding: 16, marginBottom: 20 },
  stepRow: { alignItems: 'center', flex: 1 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  stepCircleActive: { backgroundColor: Colors.verdePrincipal },
  stepNum: { fontSize: 13, fontWeight: '700', color: Colors.blanco },
  stepLabel: { fontSize: 10, color: Colors.textoSecundario, textAlign: 'center' },
  stepLabelActive: { color: Colors.verdePrincipal, fontWeight: '600' },
  section: { fontSize: 16, fontWeight: '700', color: Colors.verdeOscuro, marginBottom: 10 },
  itemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.blanco, borderRadius: 10, padding: 12, marginBottom: 8 },
  itemNombre: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.textoPrincipal },
  itemQty: { fontSize: 13, color: Colors.textoSecundario, marginRight: 8 },
  itemSub: { fontSize: 14, fontWeight: '700', color: Colors.verdePrincipal },
  infoCard: { backgroundColor: Colors.blanco, borderRadius: 12, padding: 16, marginBottom: 16 },
  infoLabel: { fontSize: 12, color: Colors.textoSecundario, marginBottom: 2, marginTop: 8 },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.textoPrincipal },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.verdePrincipal, borderRadius: 12, padding: 16 },
  totalLabel: { fontSize: 16, fontWeight: '600', color: Colors.blanco },
  totalVal: { fontSize: 22, fontWeight: '800', color: Colors.blanco },
});
