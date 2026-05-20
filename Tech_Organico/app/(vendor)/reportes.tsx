import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { mockVentasPorProducto } from '../../data/mockOrders';
import { Colors } from '../../constants/colors';
import Header from '../../components/shared/Header';
import Button from '../../components/ui/Button';
import SalesChart from '../../components/vendor/SalesChart';
import { mockVentasSemana } from '../../data/mockOrders';

const DONUT_R = 80;
const DONUT_CX = 110;
const DONUT_CY = 110;
const STROKE_W = 36;

const donutColors = [
  Colors.verdePrincipal,
  Colors.verdeSecundario,
  Colors.tonoTierra,
  Colors.amarilloCalido,
  '#3B82F6',
];

function polarToXY(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function DonutChart() {
  const total = mockVentasPorProducto.reduce((s, p) => s + p.ingreso, 0);
  let startAngle = 0;
  const slices = mockVentasPorProducto.map((prod, i) => {
    const pct = prod.ingreso / total;
    const sweep = pct * 360;
    const start = startAngle;
    startAngle += sweep;
    return { ...prod, pct, sweep, start, color: donutColors[i] ?? Colors.verdePrincipal };
  });

  return (
    <Svg width={220} height={220}>
      {slices.map(slice => {
        const s = polarToXY(DONUT_CX, DONUT_CY, DONUT_R, slice.start);
        const e = polarToXY(DONUT_CX, DONUT_CY, DONUT_R, slice.start + slice.sweep);
        const large = slice.sweep > 180 ? 1 : 0;
        const d = `M ${s.x} ${s.y} A ${DONUT_R} ${DONUT_R} 0 ${large} 1 ${e.x} ${e.y}`;
        return (
          <Path
            key={slice.cafeId}
            d={d}
            fill="none"
            stroke={slice.color}
            strokeWidth={STROKE_W}
          />
        );
      })}
      <SvgText x={DONUT_CX} y={DONUT_CY - 8} textAnchor="middle" fontSize={13} fill={Colors.textoSecundario}>
        Ingresos
      </SvgText>
      <SvgText x={DONUT_CX} y={DONUT_CY + 14} textAnchor="middle" fontSize={16} fill={Colors.verdePrincipal} fontWeight="bold">{`$${(total / 1000).toFixed(1)}k`}</SvgText>
    </Svg>
  );
}

export default function ReportesScreen() {
  return (
    <View style={styles.container}>
      <Header title="Reportes" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Ingresos por producto</Text>
        <View style={styles.donutCard}>
          <DonutChart />
          <View style={styles.leyenda}>
            {mockVentasPorProducto.map((p, i) => (
              <View key={p.cafeId} style={styles.leyendaRow}>
                <View style={[styles.leyendaDot, { backgroundColor: donutColors[i] ?? Colors.verdePrincipal }]} />
                <Text style={styles.leyendaNombre} numberOfLines={1}>{p.nombre}</Text>
                <Text style={styles.leyendaVal}>${p.ingreso.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Tendencia semanal</Text>
        <View style={styles.chartCard}>
          <SalesChart data={mockVentasSemana} />
        </View>

        <Text style={styles.sectionTitle}>Exportar reportes</Text>
        <Button
          label="📄 Exportar PDF"
          onPress={() => Alert.alert('Función próximamente', 'La exportación a PDF estará disponible en la próxima versión.')}
          variant="outline"
          style={styles.exportBtn}
        />
        <Button
          label="📊 Exportar CSV"
          onPress={() => Alert.alert('Función próximamente', 'La exportación a CSV estará disponible en la próxima versión.')}
          variant="outline"
          style={styles.exportBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutroClaro },
  scroll: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.verdeOscuro, marginBottom: 12 },
  donutCard: { backgroundColor: Colors.blanco, borderRadius: 14, padding: 16, marginBottom: 20, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  leyenda: { width: '100%', marginTop: 12 },
  leyendaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  leyendaDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  leyendaNombre: { flex: 1, fontSize: 13, color: Colors.textoPrincipal },
  leyendaVal: { fontSize: 13, fontWeight: '700', color: Colors.verdePrincipal },
  chartCard: { backgroundColor: Colors.blanco, borderRadius: 14, padding: 16, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  exportBtn: { width: '100%', marginBottom: 12 },
});
