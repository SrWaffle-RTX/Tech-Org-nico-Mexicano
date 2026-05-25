import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrdersContext } from '../../../contexts/OrdersContext';
import { mockClients } from '../../../data/mockClients';
import { Colors } from '../../../constants/colors';
import Header from '../../../components/shared/Header';
import Badge from '../../../components/ui/Badge';
import type { ClienteVendedor, SegmentoCliente } from '../../../types/vendor';

const segmentoBadge: Record<SegmentoCliente, 'primary' | 'success' | 'warning'> = {
  mayoreo: 'success',
  detalle: 'primary',
  nuevo: 'warning',
};

function calcSegmento(totalCompras: number): SegmentoCliente {
  if (totalCompras >= 10) return 'mayoreo';
  if (totalCompras >= 3) return 'detalle';
  return 'nuevo';
}

export default function ClienteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useOrdersContext();
  const [cliente, setCliente] = useState<ClienteVendedor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Mock client: use static data directly
    const mock = mockClients.find(c => c.id === id);
    if (mock) {
      setCliente(mock);
      setLoading(false);
      return;
    }

    // Firestore client: fetch user + compute stats from orders
    async function loadFirestoreClient() {
      try {
        const snap = await getDoc(doc(db, 'users', id));
        if (!snap.exists()) return;

        const data = snap.data();
        const clientOrders = orders.filter(o => o.clienteId === id);
        const totalCompras = clientOrders.length;
        const montoTotal = clientOrders.reduce((sum, o) => sum + o.total, 0);
        const sorted = [...clientOrders].sort(
          (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
        );
        const ultimaCompra = sorted[0]?.fechaCreacion ?? data.fechaRegistro ?? new Date().toISOString();

        setCliente({
          id,
          nombre: data.nombre ?? 'Sin nombre',
          email: data.email ?? '',
          segmento: calcSegmento(totalCompras),
          totalCompras,
          montoTotal,
          ultimaCompra,
          frecuenciaCompra: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    loadFirestoreClient();
  }, [id, orders]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Perfil del cliente" showBack />
        <ActivityIndicator style={styles.loader} color={Colors.verdePrincipal} />
      </View>
    );
  }

  if (!cliente) return null;

  return (
    <View style={styles.container}>
      <Header title="Perfil del cliente" showBack />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{cliente.nombre[0]?.toUpperCase() ?? '?'}</Text>
          </View>
          <Text style={styles.nombre}>{cliente.nombre}</Text>
          <Text style={styles.email}>{cliente.email}</Text>
          {cliente.telefono ? <Text style={styles.telefono}>{cliente.telefono}</Text> : null}
          <Badge label={cliente.segmento} variant={segmentoBadge[cliente.segmento]} />
        </View>

        <Text style={styles.sectionTitle}>Historial de compras</Text>
        <View style={styles.statsGrid}>
          <StatItem label="Compras" value={String(cliente.totalCompras)} />
          <StatItem label="Monto total" value={`$${cliente.montoTotal.toLocaleString()}`} />
          <StatItem label="Frec. días" value={cliente.frecuenciaCompra > 0 ? `c/${cliente.frecuenciaCompra}d` : 'Primera'} />
        </View>

        <Text style={styles.sectionTitle}>Última compra</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoValue}>
            {new Date(cliente.ultimaCompra).toLocaleDateString('es-MX', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>

        {cliente.notas ? (
          <>
            <Text style={styles.sectionTitle}>Notas</Text>
            <View style={styles.notasCard}>
              <Text style={styles.notasText}>{cliente.notas}</Text>
            </View>
          </>
        ) : null}

        <View style={styles.segmentoInfo}>
          <Text style={styles.segmentoTitle}>Segmento: {cliente.segmento}</Text>
          <Text style={styles.segmentoDesc}>
            {cliente.segmento === 'mayoreo' && 'Cliente de alto volumen. Pedidos frecuentes y montos elevados.'}
            {cliente.segmento === 'detalle' && 'Cliente recurrente de compras individuales.'}
            {cliente.segmento === 'nuevo' && 'Cliente nuevo. Aún sin historial suficiente para clasificar.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutroClaro },
  scroll: { padding: 20, paddingBottom: 40 },
  profileCard: { backgroundColor: Colors.blanco, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24, gap: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.verdePrincipal, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 32, fontWeight: '700', color: Colors.blanco },
  nombre: { fontSize: 20, fontWeight: '800', color: Colors.textoPrincipal },
  email: { fontSize: 13, color: Colors.textoSecundario },
  telefono: { fontSize: 13, color: Colors.verdePrincipal, fontWeight: '600' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.verdeOscuro, marginBottom: 10 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.blanco, borderRadius: 12, padding: 16, marginBottom: 20, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
  statItem: { alignItems: 'center', flex: 1 },
  statVal: { fontSize: 20, fontWeight: '800', color: Colors.verdePrincipal },
  statLabel: { fontSize: 11, color: Colors.textoSecundario, marginTop: 4 },
  infoCard: { backgroundColor: Colors.blanco, borderRadius: 12, padding: 16, marginBottom: 20 },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.textoPrincipal },
  notasCard: { backgroundColor: Colors.amarilloCalido + '20', borderRadius: 12, padding: 16, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: Colors.amarilloCalido },
  notasText: { fontSize: 14, color: Colors.textoPrincipal, lineHeight: 22 },
  segmentoInfo: { backgroundColor: Colors.verdePrincipal + '12', borderRadius: 12, padding: 16 },
  segmentoTitle: { fontSize: 15, fontWeight: '700', color: Colors.verdePrincipal, marginBottom: 6 },
  segmentoDesc: { fontSize: 13, color: Colors.textoPrincipal, lineHeight: 20 },
  loader: { marginTop: 40 },
});
