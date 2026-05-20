import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import Badge from '../ui/Badge';
import type { Cafe } from '../../types/cafe';

interface CafeCardProps {
  cafe: Cafe;
}

export default function CafeCard({ cafe }: CafeCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(client)/catalogo/${cafe.id}`)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={cafe.imagen} style={styles.image} resizeMode="contain" />
      </View>
      {cafe.tiene360 && (
        <View style={styles.badge360}>
          <Text style={styles.badge360Text}>360°</Text>
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.nombre} numberOfLines={1}>{cafe.nombre}</Text>
        {cafe.origen || cafe.altitud ? (
          <Text style={styles.origen}>
            {[cafe.origen, cafe.altitud].filter(Boolean).join(' · ')}
          </Text>
        ) : null}
        <View style={styles.tags}>
          {cafe.atributos.map(a => (
            <Badge key={a} label={a} variant="primary" />
          ))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.precio}>
            ${cafe.precio}
            {cafe.categoria !== 'merch' && <Text style={styles.unit}> / 250g</Text>}
          </Text>
          <View style={[styles.stockDot, { backgroundColor: cafe.stock > 10 ? Colors.verdeSecundario : Colors.amarilloCalido }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.blanco,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#FFFFFF',
  },
  image: { width: '100%', height: 200 },
  badge360: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.verdePrincipal,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badge360Text: { color: Colors.blanco, fontSize: 11, fontWeight: '700' },
  body: { padding: 14 },
  nombre: { fontSize: 16, fontWeight: '700', color: Colors.textoPrincipal, marginBottom: 4 },
  origen: { fontSize: 12, color: Colors.textoSecundario, marginBottom: 10 },
  tags: { flexDirection: 'row', gap: 6, marginBottom: 12, flexWrap: 'wrap' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  precio: { fontSize: 18, fontWeight: '700', color: Colors.verdePrincipal },
  unit: { fontSize: 12, fontWeight: '400', color: Colors.textoSecundario },
  stockDot: { width: 10, height: 10, borderRadius: 5 },
});
