import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useCartContext } from '../../contexts/CartContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { useOrdersContext } from '../../contexts/OrdersContext';
import type { Order } from '../../types/order';
import { Colors } from '../../constants/colors';
import Header from '../../components/shared/Header';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const metodosPago = ['Tarjeta', 'Transferencia', 'Efectivo contra entrega'];

export default function CheckoutScreen() {
  const { items, total, clearCart } = useCartContext();
  const { user } = useAuthContext();
  const { addOrder } = useOrdersContext();
  const router = useRouter();

  const [direccion, setDireccion] = useState(user?.direccion ?? '');
  const [metodoPago, setMetodoPago] = useState(metodosPago[0] ?? '');
  const [loading, setLoading] = useState(false);

  async function handleConfirmar() {
    if (!direccion) {
      Alert.alert('Dirección requerida', 'Ingresa tu dirección de entrega.');
      return;
    }
    setLoading(true);
    const now = new Date().toISOString();
    const order: Order = {
      id: `ord-${Date.now()}`,
      clienteId: user?.id ?? 'guest',
      clienteNombre: user?.nombre ?? 'Cliente',
      items: [...items],
      total,
      status: 'pendiente',
      direccionEntrega: direccion,
      metodoPago,
      fechaCreacion: now,
      fechaActualizacion: now,
    };
    await addOrder(order);
    clearCart();
    setLoading(false);
    Alert.alert(
      '¡Pedido confirmado! 🎉',
      'Tu pedido ha sido recibido. Lo puedes seguir en la sección Pedidos.',
      [{ text: 'Ver mis pedidos', onPress: () => router.replace('/(client)/pedidos') }],
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Checkout" showBack />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>Resumen del pedido</Text>
        {items.map(item => (
          <View key={item.cafe.id} style={styles.itemRow}>
            <Text style={styles.itemNombre}>{item.cafe.nombre}</Text>
            <Text style={styles.itemDetalle}>{item.cantidad} × ${item.cafe.precio}</Text>
            <Text style={styles.itemSubtotal}>${item.cafe.precio * item.cantidad}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total a pagar</Text>
          <Text style={styles.totalValue}>${total}</Text>
        </View>

        <Text style={styles.section}>Dirección de entrega</Text>
        <Input
          placeholder="Calle, número, colonia, ciudad..."
          value={direccion}
          onChangeText={setDireccion}
        />

        <Text style={styles.section}>Método de pago</Text>
        <View style={styles.metodosGrid}>
          {metodosPago.map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.metodoCard, metodoPago === m && styles.metodoActivo]}
              onPress={() => setMetodoPago(m)}
            >
              <Text style={[styles.metodoText, metodoPago === m && styles.metodoTextoActivo]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button label="Confirmar pedido ✓" onPress={handleConfirmar} loading={loading} style={styles.btn} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutroClaro },
  scroll: { padding: 20, paddingBottom: 40 },
  section: { fontSize: 16, fontWeight: '700', color: Colors.verdeOscuro, marginBottom: 12, marginTop: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, backgroundColor: Colors.blanco, borderRadius: 10, padding: 12 },
  itemNombre: { flex: 1, fontSize: 14, color: Colors.textoPrincipal, fontWeight: '600' },
  itemDetalle: { fontSize: 13, color: Colors.textoSecundario, marginRight: 8 },
  itemSubtotal: { fontSize: 14, fontWeight: '700', color: Colors.verdePrincipal },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.verdePrincipal, borderRadius: 12, padding: 16, marginBottom: 24 },
  totalLabel: { fontSize: 16, fontWeight: '600', color: Colors.blanco },
  totalValue: { fontSize: 22, fontWeight: '800', color: Colors.blanco },
  metodosGrid: { gap: 10, marginBottom: 24 },
  metodoCard: { borderRadius: 10, padding: 14, borderWidth: 1.5, borderColor: '#D1D5DB', backgroundColor: Colors.blanco },
  metodoActivo: { borderColor: Colors.verdePrincipal, backgroundColor: Colors.verdePrincipal + '10' },
  metodoText: { fontSize: 14, color: Colors.textoSecundario, fontWeight: '600' },
  metodoTextoActivo: { color: Colors.verdePrincipal },
  btn: { width: '100%' },
});
