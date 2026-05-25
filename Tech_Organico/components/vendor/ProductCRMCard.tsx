import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export type ProductoCRMData = {
  cafeId: string;
  nombre: string;
  origen: string;
  variedad: string;
  tostado: string;
  precio: number;
  precioMayoreo: number;
  unidadesMes: number;
  ingresoMes: number;
  unidadesMesAnterior: number;
  stockActual: number;
  stockMax?: number;
};

const ACCENTS = [Colors.verdePrincipal, Colors.tonoTierra, Colors.amarilloCalido];

export default function ProductCRMCard({ item, index = 0 }: { item: ProductoCRMData; index?: number }) {
  const trend = ((item.unidadesMes - item.unidadesMesAnterior) / item.unidadesMesAnterior) * 100;
  const trendPos = trend >= 0;
  const maxStock = item.stockMax ?? 100;
  const stockPct = Math.min(item.stockActual / maxStock, 1);
  const stockLow = item.stockActual <= 25;
  const accent = ACCENTS[index % ACCENTS.length]!;

  return (
    <View style={[styles.card, { borderLeftColor: accent }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: accent + '18' }]}>
          <Text style={styles.icon}>☕</Text>
        </View>
        <View style={styles.headerMid}>
          <Text style={styles.name}>{item.nombre}</Text>
          <Text style={styles.meta}>{item.variedad} · Tostado {item.tostado}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: accent + '18' }]}>
          <Text style={[styles.badgeText, { color: accent }]}>{item.origen}</Text>
        </View>
      </View>

      {/* Precios */}
      <View style={styles.pricesRow}>
        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Detalle</Text>
          <Text style={styles.priceValue}>${item.precio}</Text>
        </View>
        <View style={styles.priceSep} />
        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Mayoreo</Text>
          <Text style={[styles.priceValue, { color: Colors.verdeSecundario }]}>${item.precioMayoreo}</Text>
        </View>
      </View>

      {/* Métricas del mes */}
      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricVal}>{item.unidadesMes}</Text>
          <Text style={styles.metricLbl}>unidades</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <Text style={[styles.metricVal, { color: trendPos ? Colors.verdeSecundario : '#E53935' }]}>
            {trendPos ? '+' : ''}{trend.toFixed(1)}%
          </Text>
          <Text style={styles.metricLbl}>vs anterior</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <Text style={styles.metricVal}>${(item.ingresoMes / 1000).toFixed(1)}k</Text>
          <Text style={styles.metricLbl}>ingreso</Text>
        </View>
      </View>

      {/* Barra de stock */}
      <View style={styles.stockSection}>
        <View style={styles.stockRow}>
          <Text style={[styles.stockLabel, stockLow && styles.stockWarn]}>
            {stockLow ? '⚠️ Stock bajo — ' : 'Stock: '}{item.stockActual} uds
          </Text>
          <Text style={styles.stockPct}>{Math.round(stockPct * 100)}%</Text>
        </View>
        <View style={styles.stockTrack}>
          <View
            style={[
              styles.stockFill,
              { width: `${stockPct * 100}%`, backgroundColor: stockLow ? '#E53935' : accent },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.blanco,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  icon: { fontSize: 20 },
  headerMid: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: Colors.textoPrincipal },
  meta: { fontSize: 11, color: Colors.textoSecundario, marginTop: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  pricesRow: {
    flexDirection: 'row',
    backgroundColor: Colors.neutroClaro,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  priceBox: { flex: 1, alignItems: 'center' },
  priceLabel: { fontSize: 10, color: Colors.textoSecundario, marginBottom: 2 },
  priceValue: { fontSize: 20, fontWeight: '700', color: Colors.textoPrincipal },
  priceSep: { width: 1, height: 36, backgroundColor: Colors.textoSecundario + '25', marginHorizontal: 8 },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: Colors.neutroClaro,
    borderRadius: 10,
    padding: 10,
  },
  metric: { flex: 1, alignItems: 'center' },
  metricVal: { fontSize: 16, fontWeight: '700', color: Colors.textoPrincipal },
  metricLbl: { fontSize: 10, color: Colors.textoSecundario, marginTop: 2 },
  metricDivider: { width: 1, backgroundColor: Colors.textoSecundario + '25', marginHorizontal: 4 },
  stockSection: {},
  stockRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  stockLabel: { fontSize: 11, color: Colors.textoSecundario, fontWeight: '500' },
  stockWarn: { color: '#E53935' },
  stockPct: { fontSize: 11, color: Colors.textoSecundario },
  stockTrack: {
    height: 7,
    backgroundColor: Colors.neutroClaro,
    borderRadius: 4,
    overflow: 'hidden',
  },
  stockFill: { height: '100%', borderRadius: 4 },
});
