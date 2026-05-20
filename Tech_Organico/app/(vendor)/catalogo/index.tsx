import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { mockCafes } from '../../../data/mockCafes';
import { Colors } from '../../../constants/colors';
import Header from '../../../components/shared/Header';
import Badge from '../../../components/ui/Badge';
import type { Cafe } from '../../../types/cafe';

export default function VendorCatalogoScreen() {
  const router = useRouter();

  function renderCafe({ item }: { item: Cafe }) {
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => router.push(`/(vendor)/catalogo/${item.id}`)}
        activeOpacity={0.85}
      >
        <Image source={item.imagen} style={styles.img} resizeMode="contain" />
        <View style={styles.info}>
          <Text style={styles.nombre}>{item.nombre}</Text>
          <Text style={styles.origen}>{item.origen}{item.tostado ? ` · ${item.tostado}` : ''}</Text>
          <View style={styles.badges}>
            {item.proceso && <Badge label={item.proceso} variant="primary" />}
            {item.tiene360 && <Badge label="360°" variant="success" />}
          </View>
          <View style={styles.footer}>
            <Text style={styles.precio}>${item.precio}</Text>
            <Text style={styles.stock}>Stock: {item.stock} kg</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Gestión de catálogo"
        rightAction={{ icon: '＋', onPress: () => router.push('/(vendor)/catalogo/nuevo') }}
      />
      <FlatList
        data={mockCafes}
        keyExtractor={c => c.id}
        renderItem={renderCafe}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutroClaro },
  list: { padding: 16, paddingBottom: 32 },
  row: { flexDirection: 'row', backgroundColor: Colors.blanco, borderRadius: 14, marginBottom: 12, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  img: { width: 90, height: 90 },
  info: { flex: 1, padding: 12 },
  nombre: { fontSize: 14, fontWeight: '700', color: Colors.textoPrincipal },
  origen: { fontSize: 12, color: Colors.textoSecundario, marginTop: 2, marginBottom: 6 },
  badges: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  precio: { fontSize: 16, fontWeight: '700', color: Colors.verdePrincipal },
  stock: { fontSize: 11, color: Colors.textoSecundario },
});
