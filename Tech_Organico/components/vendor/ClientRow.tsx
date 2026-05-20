import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import Badge from '../ui/Badge';
import type { ClienteVendedor } from '../../types/vendor';

interface ClientRowProps {
  cliente: ClienteVendedor;
}

const segmentoBadge = {
  mayoreo: 'success' as const,
  detalle: 'primary' as const,
  nuevo: 'warning' as const,
};

export default function ClientRow({ cliente }: ClientRowProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/(vendor)/clientes/${cliente.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{cliente.nombre[0]?.toUpperCase() ?? '?'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nombre}>{cliente.nombre}</Text>
        <Text style={styles.sub}>{cliente.email}</Text>
        <Text style={styles.compras}>{cliente.totalCompras} compras · ${cliente.montoTotal.toLocaleString()}</Text>
      </View>
      <Badge label={cliente.segmento} variant={segmentoBadge[cliente.segmento]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.verdePrincipal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: Colors.blanco, fontSize: 18, fontWeight: '700' },
  info: { flex: 1 },
  nombre: { fontSize: 15, fontWeight: '600', color: Colors.textoPrincipal },
  sub: { fontSize: 12, color: Colors.textoSecundario, marginTop: 1 },
  compras: { fontSize: 11, color: Colors.verdeSecundario, marginTop: 2 },
});
