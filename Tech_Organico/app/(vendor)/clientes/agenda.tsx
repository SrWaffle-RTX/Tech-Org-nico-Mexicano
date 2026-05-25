import React, { useState, useMemo, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useOrdersContext } from '../../../contexts/OrdersContext';
import { mockClients } from '../../../data/mockClients';
import { Colors } from '../../../constants/colors';
import Header from '../../../components/shared/Header';
import ClientRow from '../../../components/vendor/ClientRow';
import type { ClienteVendedor, SegmentoCliente } from '../../../types/vendor';

function calcSegmento(totalCompras: number): SegmentoCliente {
  if (totalCompras >= 10) return 'mayoreo';
  if (totalCompras >= 3) return 'detalle';
  return 'nuevo';
}

export default function AgendaClientesScreen() {
  const [busqueda, setBusqueda] = useState('');
  const [registeredClients, setRegisteredClients] = useState<ClienteVendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const { orders } = useOrdersContext();

  useEffect(() => {
    async function fetchClients() {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'client'));
        const snap = await getDocs(q);
        const mockEmails = new Set(mockClients.map(c => c.email.toLowerCase()));

        const fromFirestore: ClienteVendedor[] = snap.docs
          .filter(d => !mockEmails.has((d.data().email ?? '').toLowerCase()))
          .map(d => {
            const data = d.data();
            const uid = d.id;

            const clientOrders = orders.filter(o => o.clienteId === uid);
            const totalCompras = clientOrders.length;
            const montoTotal = clientOrders.reduce((sum, o) => sum + o.total, 0);
            const sorted = [...clientOrders].sort(
              (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
            );
            const ultimaCompra = sorted[0]?.fechaCreacion ?? data.fechaRegistro ?? new Date().toISOString();

            return {
              id: uid,
              nombre: data.nombre ?? 'Sin nombre',
              email: data.email ?? '',
              segmento: calcSegmento(totalCompras),
              totalCompras,
              montoTotal,
              ultimaCompra,
              frecuenciaCompra: 0,
            };
          });

        setRegisteredClients(fromFirestore);
      } catch {
        // si falla Firestore, solo muestra mock clients
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, [orders]);

  const allClients = useMemo(() => [...mockClients, ...registeredClients], [registeredClients]);

  const clientes = useMemo(() => {
    if (!busqueda) return allClients;
    const q = busqueda.toLowerCase();
    return allClients.filter(
      c => c.nombre.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    );
  }, [busqueda, allClients]);

  return (
    <View style={styles.container}>
      <Header title="Agenda de clientes" />
      <View style={styles.searchBox}>
        <TextInput
          style={styles.search}
          placeholder="Buscar por nombre o correo..."
          placeholderTextColor={Colors.textoSecundario}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} color={Colors.verdePrincipal} />
      ) : (
        <FlatList
          data={clientes}
          keyExtractor={c => c.id}
          renderItem={({ item }) => <ClientRow cliente={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutroClaro },
  searchBox: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  search: { backgroundColor: Colors.blanco, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.textoPrincipal, borderWidth: 1, borderColor: '#E5E7EB' },
  list: { padding: 16, paddingBottom: 32 },
  loader: { marginTop: 40 },
});
