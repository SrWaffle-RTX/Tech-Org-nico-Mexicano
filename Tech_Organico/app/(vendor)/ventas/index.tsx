import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { mockVentasSemana } from '../../../data/mockOrders';
import { useOrdersContext } from '../../../contexts/OrdersContext';
import { Colors } from '../../../constants/colors';
import Header from '../../../components/shared/Header';
import SalesChart from '../../../components/vendor/SalesChart';
import Badge from '../../../components/ui/Badge';
import type { Order, OrderStatus } from '../../../types/order';

const statusBadge: Record<OrderStatus, 'primary' | 'success' | 'warning' | 'info' | 'neutral'> = {
  pendiente: 'warning',
  confirmado: 'info',
  enviado: 'primary',
  entregado: 'success',
  cancelado: 'neutral',
};

const statusOptions: OrderStatus[] = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];

const statusLabel: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export default function VentasScreen() {
  const router = useRouter();
  const { orders, updateOrderStatus } = useOrdersContext();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  async function handleChangeStatus(newStatus: OrderStatus) {
    if (!selectedOrder) return;
    try {
      await updateOrderStatus(selectedOrder.id, newStatus);
      setSelectedOrder(null);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el estado.');
    }
  }

  return (
    <View style={styles.container}>
      <Header
        title="CRM de ventas"
        rightAction={{ icon: '📋', onPress: () => router.push('/(vendor)/ventas/historial') }}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SalesChart data={mockVentasSemana} />

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Pedidos activos</Text>
          <Text style={styles.totalVal}>{orders.length}</Text>
          <Text style={styles.totalSub}>Toca un pedido para cambiar su estado</Text>
        </View>

        <Text style={styles.sectionTitle}>Pedidos recientes</Text>

        {orders.length === 0 ? (
          <Text style={styles.empty}>No hay pedidos aún.</Text>
        ) : (
          orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => setSelectedOrder(order)}
              activeOpacity={0.8}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>#{order.id.slice(-6)} — {order.clienteNombre}</Text>
                <Badge label={order.status} variant={statusBadge[order.status]} />
              </View>
              <Text style={styles.orderFecha}>
                {new Date(order.fechaCreacion).toLocaleDateString('es-MX')}
              </Text>
              <View style={styles.orderFooter}>
                <Text style={styles.orderItems}>{order.items.length} producto(s)</Text>
                <Text style={styles.orderTotal}>${order.total}</Text>
              </View>
              <Text style={styles.tapHint}>Toca para actualizar estado →</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal para cambiar estado */}
      <Modal
        visible={!!selectedOrder}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <Pressable style={styles.overlay} onPress={() => setSelectedOrder(null)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>
              Pedido #{selectedOrder?.id.slice(-6)}
            </Text>
            <Text style={styles.sheetSub}>
              Cliente: {selectedOrder?.clienteNombre}
            </Text>
            <Text style={styles.sheetSub2}>Selecciona el nuevo estado:</Text>
            {statusOptions.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.statusBtn,
                  selectedOrder?.status === s && styles.statusBtnActive,
                ]}
                onPress={() => handleChangeStatus(s)}
              >
                <Text
                  style={[
                    styles.statusBtnText,
                    selectedOrder?.status === s && styles.statusBtnTextActive,
                  ]}
                >
                  {statusLabel[s]}
                  {selectedOrder?.status === s ? ' ✓' : ''}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setSelectedOrder(null)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutroClaro },
  scroll: { padding: 16, paddingBottom: 32 },
  totalCard: {
    backgroundColor: Colors.verdePrincipal,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginVertical: 16,
  },
  totalLabel: { fontSize: 13, color: Colors.neutroClaro, opacity: 0.8 },
  totalVal: { fontSize: 36, fontWeight: '800', color: Colors.blanco, marginTop: 4 },
  totalSub: { fontSize: 12, color: Colors.neutroClaro, marginTop: 4, opacity: 0.8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.verdeOscuro, marginBottom: 12 },
  empty: { color: Colors.textoSecundario, textAlign: 'center', marginTop: 20 },
  orderCard: {
    backgroundColor: Colors.blanco,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderId: { fontSize: 14, fontWeight: '700', color: Colors.textoPrincipal, flex: 1, marginRight: 8 },
  orderFecha: { fontSize: 12, color: Colors.textoSecundario, marginBottom: 8 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  orderItems: { fontSize: 13, color: Colors.textoSecundario },
  orderTotal: { fontSize: 15, fontWeight: '700', color: Colors.verdePrincipal },
  tapHint: { fontSize: 11, color: Colors.verdePrincipal, textAlign: 'right' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.blanco,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  sheetTitle: { fontSize: 17, fontWeight: '800', color: Colors.verdeOscuro, marginBottom: 4 },
  sheetSub: { fontSize: 13, color: Colors.textoSecundario, marginBottom: 2 },
  sheetSub2: { fontSize: 14, fontWeight: '600', color: Colors.textoPrincipal, marginTop: 16, marginBottom: 12 },
  statusBtn: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    padding: 14,
    marginBottom: 8,
    backgroundColor: Colors.blanco,
  },
  statusBtnActive: { borderColor: Colors.verdePrincipal, backgroundColor: Colors.verdePrincipal + '15' },
  statusBtnText: { fontSize: 14, color: Colors.textoSecundario, fontWeight: '600' },
  statusBtnTextActive: { color: Colors.verdePrincipal },
  cancelBtn: { marginTop: 8, alignItems: 'center', padding: 12 },
  cancelText: { fontSize: 14, color: Colors.textoSecundario, fontWeight: '600' },
});
