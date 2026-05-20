import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCartContext } from '../../contexts/CartContext';
import { Colors } from '../../constants/colors';
import Header from '../../components/shared/Header';
import Button from '../../components/ui/Button';
import type { CartItem } from '../../types/order';

export default function CarritoScreen() {
  const { items, total, removeItem, updateCantidad, count } = useCartContext();
  const router = useRouter();

  function renderItem({ item }: { item: CartItem }) {
    return (
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.nombre}>{item.cafe.nombre}</Text>
          <Text style={styles.origen}>{item.cafe.origen}</Text>
          <Text style={styles.precio}>${item.cafe.precio} /250g</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.ctrl} onPress={() => updateCantidad(item.cafe.id, item.cantidad - 1)}>
            <Text style={styles.ctrlText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.cant}>{item.cantidad}</Text>
          <TouchableOpacity style={styles.ctrl} onPress={() => updateCantidad(item.cafe.id, item.cantidad + 1)}>
            <Text style={styles.ctrlText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeItem(item.cafe.id)} style={styles.remove}>
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtotal}>${item.cafe.precio * item.cantidad}</Text>
      </View>
    );
  }

  if (count === 0) {
    return (
      <View style={styles.container}>
        <Header title="Carrito" />
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtitle}>Explora el catálogo y agrega tus cafés favoritos.</Text>
          <Button label="Ver catálogo" onPress={() => router.push('/(client)/catalogo')} style={styles.emptyBtn} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={`Carrito (${count})`} />
      <FlatList
        data={items}
        keyExtractor={i => i.cafe.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total}</Text>
        </View>
        <Button label="Ir al checkout →" onPress={() => router.push('/(client)/checkout')} style={styles.checkoutBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutroClaro },
  list: { padding: 16, paddingBottom: 8 },
  row: {
    backgroundColor: Colors.blanco,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  info: { flex: 1 },
  nombre: { fontSize: 14, fontWeight: '700', color: Colors.textoPrincipal },
  origen: { fontSize: 12, color: Colors.textoSecundario, marginTop: 2 },
  precio: { fontSize: 12, color: Colors.verdePrincipal, marginTop: 4, fontWeight: '600' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ctrl: { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.neutroClaro, alignItems: 'center', justifyContent: 'center' },
  ctrlText: { fontSize: 18, color: Colors.verdePrincipal, fontWeight: '700', lineHeight: 20 },
  cant: { fontSize: 16, fontWeight: '700', color: Colors.textoPrincipal, minWidth: 20, textAlign: 'center' },
  remove: { padding: 4 },
  removeText: { fontSize: 14, color: '#DC2626' },
  subtotal: { fontSize: 15, fontWeight: '700', color: Colors.textoPrincipal, minWidth: 50, textAlign: 'right' },
  footer: { padding: 20, backgroundColor: Colors.blanco, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  totalLabel: { fontSize: 18, fontWeight: '600', color: Colors.textoPrincipal },
  totalValue: { fontSize: 22, fontWeight: '800', color: Colors.verdePrincipal },
  checkoutBtn: { width: '100%' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyEmoji: { fontSize: 72, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: Colors.textoPrincipal, marginBottom: 8 },
  emptySubtitle: { fontSize: 15, color: Colors.textoSecundario, textAlign: 'center', marginBottom: 24 },
  emptyBtn: {},
});
