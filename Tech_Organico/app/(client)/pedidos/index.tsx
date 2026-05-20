import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useOrdersContext } from '../../../contexts/OrdersContext';
import { Colors } from '../../../constants/colors';
import Header from '../../../components/shared/Header';
import Badge from '../../../components/ui/Badge';
import type { Order, OrderStatus } from '../../../types/order';

const statusBadge: Record<OrderStatus, 'primary' | 'success' | 'warning' | 'info' | 'neutral'> = {
  pendiente: 'warning',
  confirmado: 'info',
  enviado: 'primary',
  entregado: 'success',
  cancelado: 'neutral',
};

export default function PedidosScreen() {
  const router = useRouter();
  const { orders } = useOrdersContext();
  const allOrders = [...orders];

  function renderPedido({ item }: { item: Order }) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/(client)/pedidos/${item.id}`)}
        activeOpacity={0.85}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.pedidoId}>Pedido #{item.id.slice(-4)}</Text>
          <Badge label={item.status} variant={statusBadge[item.status]} />
        </View>
        <Text style={styles.fecha}>{new Date(item.fechaCreacion).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
        <Text style={styles.items}>{item.items.length} producto(s)</Text>
        <Text style={styles.total}>Total: <Text style={styles.totalVal}>${item.total}</Text></Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Mis pedidos" />
      <FlatList
        data={allOrders}
        keyExtractor={i => i.id}
        renderItem={renderPedido}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyTitle}>Sin pedidos aún</Text>
            <Text style={styles.emptySub}>Tus pedidos aparecerán aquí después de tu primera compra.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutroClaro },
  list: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: Colors.blanco,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  pedidoId: { fontSize: 15, fontWeight: '700', color: Colors.textoPrincipal },
  fecha: { fontSize: 12, color: Colors.textoSecundario, marginBottom: 4 },
  items: { fontSize: 13, color: Colors.textoSecundario, marginBottom: 6 },
  total: { fontSize: 14, color: Colors.textoPrincipal },
  totalVal: { fontWeight: '700', color: Colors.verdePrincipal },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.textoPrincipal, marginBottom: 8 },
  emptySub: { fontSize: 14, color: Colors.textoSecundario, textAlign: 'center' },
});
