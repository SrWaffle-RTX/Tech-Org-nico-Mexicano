import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { mockOrders } from '../../../data/mockOrders';
import { Colors } from '../../../constants/colors';
import Header from '../../../components/shared/Header';
import Badge from '../../../components/ui/Badge';
import type { Order, OrderStatus } from '../../../types/order';

const estados: (OrderStatus | 'todos')[] = ['todos', 'pendiente', 'confirmado', 'enviado', 'entregado'];
const statusBadge: Record<OrderStatus, 'primary' | 'success' | 'warning' | 'info' | 'neutral'> = {
  pendiente: 'warning',
  confirmado: 'info',
  enviado: 'primary',
  entregado: 'success',
  cancelado: 'neutral',
};

export default function HistorialVentasScreen() {
  const [filtroEstado, setFiltroEstado] = useState<OrderStatus | 'todos'>('todos');

  const filtrados = filtroEstado === 'todos'
    ? mockOrders
    : mockOrders.filter(o => o.status === filtroEstado);

  function renderOrder({ item }: { item: Order }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>#{item.id.slice(-4)} — {item.clienteNombre}</Text>
          <Badge label={item.status} variant={statusBadge[item.status]} />
        </View>
        <Text style={styles.fecha}>{new Date(item.fechaCreacion).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}</Text>
        {item.items.map(i => (
          <Text key={i.cafe.id} style={styles.itemLine}>• {i.cafe.nombre} × {i.cantidad}</Text>
        ))}
        <View style={styles.cardFooter}>
          <Text style={styles.pago}>{item.metodoPago}</Text>
          <Text style={styles.total}>${item.total}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Historial de ventas" showBack />
      <View style={styles.filtros}>
        {estados.map(e => (
          <TouchableOpacity
            key={e}
            style={[styles.chip, filtroEstado === e && styles.chipActivo]}
            onPress={() => setFiltroEstado(e)}
          >
            <Text style={[styles.chipText, filtroEstado === e && styles.chipTextActivo]}>{e}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtrados}
        keyExtractor={i => i.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutroClaro },
  filtros: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 8 },
  chip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1.5, borderColor: Colors.verdePrincipal, backgroundColor: Colors.blanco },
  chipActivo: { backgroundColor: Colors.verdePrincipal },
  chipText: { fontSize: 12, color: Colors.verdePrincipal, fontWeight: '600' },
  chipTextActivo: { color: Colors.blanco },
  list: { padding: 16, paddingBottom: 32 },
  card: { backgroundColor: Colors.blanco, borderRadius: 12, padding: 14, marginBottom: 12, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  orderId: { fontSize: 14, fontWeight: '700', color: Colors.textoPrincipal, flex: 1, marginRight: 8 },
  fecha: { fontSize: 12, color: Colors.textoSecundario, marginBottom: 8 },
  itemLine: { fontSize: 13, color: Colors.textoPrincipal, marginBottom: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  pago: { fontSize: 13, color: Colors.textoSecundario },
  total: { fontSize: 16, fontWeight: '700', color: Colors.verdePrincipal },
});
