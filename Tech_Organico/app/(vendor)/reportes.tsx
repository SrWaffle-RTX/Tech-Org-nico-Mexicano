import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Modal, TouchableOpacity, Pressable, Alert,
} from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { mockDatosMes } from '../../data/mockOrders';
import type { MesKey } from '../../data/mockOrders';
import { Colors } from '../../constants/colors';
import Header from '../../components/shared/Header';
import Button from '../../components/ui/Button';
import SalesChart from '../../components/vendor/SalesChart';

const MESES_OPCIONES: { key: MesKey; label: string; esGeneral?: boolean }[] = [
  { key: 'enero',   label: 'Enero 2026' },
  { key: 'febrero', label: 'Febrero 2026' },
  { key: 'marzo',   label: 'Marzo 2026' },
  { key: 'abril',   label: 'Abril 2026' },
  { key: 'mayo',    label: 'Mayo 2026' },
  { key: 'general', label: 'Vista general', esGeneral: true },
];

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

type ProductoCRM = { cafeId: string; nombre: string; ingresoMes: number; unidadesMes: number };

function DonutChart({ productos }: { productos: ProductoCRM[] }) {
  const total = productos.reduce((s, p) => s + p.ingresoMes, 0);
  let startAngle = 0;
  const slices = productos.map((prod, i) => {
    const pct = prod.ingresoMes / total;
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
          <Path key={slice.cafeId} d={d} fill="none" stroke={slice.color} strokeWidth={STROKE_W} />
        );
      })}
      <SvgText x={DONUT_CX} y={DONUT_CY - 8} textAnchor="middle" fontSize={13} fill={Colors.textoSecundario}>
        Ingresos
      </SvgText>
      <SvgText x={DONUT_CX} y={DONUT_CY + 14} textAnchor="middle" fontSize={16} fill={Colors.verdePrincipal} fontWeight="bold">
        {`$${(total / 1000).toFixed(1)}k`}
      </SvgText>
    </Svg>
  );
}

function buildCSV(mesKey: MesKey, mesLabel: string) {
  const { productoCRM, ventasSemana } = mockDatosMes[mesKey];
  const totalIngresos = productoCRM.reduce((s, p) => s + p.ingresoMes, 0);
  const totalUnidades = productoCRM.reduce((s, p) => s + p.unidadesMes, 0);

  const lines: string[] = [
    `Reporte Tech Orgánico Mexicano - ${mesLabel}`,
    '',
    'PRODUCTOS',
    'Producto,Unidades,Ingreso (MXN)',
    ...productoCRM.map(p => `${p.nombre},${p.unidadesMes},${p.ingresoMes}`),
    `TOTAL,${totalUnidades},${totalIngresos}`,
    '',
    'VENTAS POR SEMANA / PERÍODO',
    'Período,Total (MXN),Pedidos',
    ...ventasSemana.map(s => `${s.semana},${s.total},${s.pedidos}`),
  ];

  return lines.join('\n');
}

function buildPDFHtml(mesKey: MesKey, mesLabel: string) {
  const { productoCRM, ventasSemana } = mockDatosMes[mesKey];
  const totalIngresos = productoCRM.reduce((s, p) => s + p.ingresoMes, 0);
  const totalUnidades = productoCRM.reduce((s, p) => s + p.unidadesMes, 0);

  const productoRows = productoCRM.map(p => `
    <tr>
      <td>${p.nombre}</td>
      <td style="text-align:center">${p.unidadesMes}</td>
      <td style="text-align:right">$${p.ingresoMes.toLocaleString()}</td>
    </tr>`).join('');

  const semanaRows = ventasSemana.map(s => `
    <tr>
      <td>${s.semana}</td>
      <td style="text-align:center">${s.pedidos}</td>
      <td style="text-align:right">$${s.total.toLocaleString()}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; padding: 32px; color: #1a1a2e; }
    h1 { color: #2d6a4f; font-size: 22px; margin-bottom: 4px; }
    .sub { color: #6b7280; font-size: 13px; margin-bottom: 24px; }
    h2 { color: #2d6a4f; font-size: 15px; margin: 24px 0 8px; border-bottom: 2px solid #2d6a4f; padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #2d6a4f; color: white; padding: 8px 10px; text-align: left; }
    td { padding: 7px 10px; border-bottom: 1px solid #e5e7eb; }
    tr:nth-child(even) td { background: #f9fafb; }
    .total-row td { font-weight: bold; background: #ecfdf5; color: #2d6a4f; }
    .kpi-grid { display: flex; gap: 16px; margin-bottom: 8px; }
    .kpi { background: #f0fdf4; border-radius: 8px; padding: 14px 20px; flex: 1; }
    .kpi-val { font-size: 22px; font-weight: bold; color: #2d6a4f; }
    .kpi-lbl { font-size: 12px; color: #6b7280; margin-top: 2px; }
    .footer { margin-top: 32px; font-size: 11px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <h1>Tech Orgánico Mexicano</h1>
  <div class="sub">Reporte de ventas · ${mesLabel}</div>

  <div class="kpi-grid">
    <div class="kpi">
      <div class="kpi-val">$${totalIngresos.toLocaleString()}</div>
      <div class="kpi-lbl">Ingresos totales</div>
    </div>
    <div class="kpi">
      <div class="kpi-val">${totalUnidades}</div>
      <div class="kpi-lbl">Unidades vendidas</div>
    </div>
  </div>

  <h2>Ingresos por producto</h2>
  <table>
    <thead><tr><th>Producto</th><th style="text-align:center">Unidades</th><th style="text-align:right">Ingreso</th></tr></thead>
    <tbody>
      ${productoRows}
      <tr class="total-row">
        <td>TOTAL</td>
        <td style="text-align:center">${totalUnidades}</td>
        <td style="text-align:right">$${totalIngresos.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>

  <h2>Ventas por ${mesKey === 'general' ? 'mes' : 'semana'}</h2>
  <table>
    <thead><tr><th>Período</th><th style="text-align:center">Pedidos</th><th style="text-align:right">Total</th></tr></thead>
    <tbody>${semanaRows}</tbody>
  </table>

  <div class="footer">Generado por Tech Orgánico Mexicano · ${new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
</body>
</html>`;
}

export default function ReportesScreen() {
  const [mesKey, setMesKey] = useState<MesKey>('mayo');
  const [showPicker, setShowPicker] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'csv' | null>(null);

  const mesOp = MESES_OPCIONES.find(m => m.key === mesKey)!;
  const mesLabel = mesOp.label;
  const { productoCRM, ventasSemana } = mockDatosMes[mesKey];

  async function handleExportCSV() {
    setExporting('csv');
    try {
      const csv = buildCSV(mesKey, mesLabel);
      const fileName = `Reporte_TechOrganico_${mesKey}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Exportar CSV', UTI: 'public.comma-separated-values-text' });
      } else {
        Alert.alert('Archivo guardado', `El reporte se guardó como ${fileName}`);
      }
    } catch {
      Alert.alert('Error', 'No se pudo exportar el CSV.');
    } finally {
      setExporting(null);
    }
  }

  async function handleExportPDF() {
    setExporting('pdf');
    try {
      const html = buildPDFHtml(mesKey, mesLabel);
      await Print.printAsync({ html });
    } catch {
      Alert.alert('Error', 'No se pudo generar el PDF.');
    } finally {
      setExporting(null);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <Header title="Reportes" />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Selector de mes */}
          <TouchableOpacity style={styles.mesSelector} onPress={() => setShowPicker(true)} activeOpacity={0.8}>
            <View>
              <Text style={styles.mesSelectorLabel}>Período</Text>
              <Text style={styles.mesSelectorValue}>{mesLabel}</Text>
            </View>
            <Text style={styles.mesSelectorArrow}>▾</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Ingresos por producto</Text>
          <View style={styles.donutCard}>
            <DonutChart productos={productoCRM} />
            <View style={styles.leyenda}>
              {productoCRM.map((p, i) => (
                <View key={p.cafeId} style={styles.leyendaRow}>
                  <View style={[styles.leyendaDot, { backgroundColor: donutColors[i] ?? Colors.verdePrincipal }]} />
                  <Text style={styles.leyendaNombre} numberOfLines={1}>{p.nombre}</Text>
                  <Text style={styles.leyendaVal}>${p.ingresoMes.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            {mesKey === 'general' ? 'Tendencia mensual' : 'Tendencia semanal'}
          </Text>
          <View style={styles.chartCard}>
            <SalesChart data={ventasSemana} />
          </View>

          <Text style={styles.sectionTitle}>Exportar reporte</Text>
          <Button
            label={exporting === 'pdf' ? 'Generando PDF...' : '📄 Exportar PDF'}
            onPress={handleExportPDF}
            variant="outline"
            style={styles.exportBtn}
          />
          <Button
            label={exporting === 'csv' ? 'Exportando...' : '📊 Exportar CSV'}
            onPress={handleExportCSV}
            variant="outline"
            style={styles.exportBtn}
          />
        </ScrollView>
      </View>

      <Modal visible={showPicker} transparent animationType="fade" onRequestClose={() => setShowPicker(false)}>
        <Pressable style={styles.overlay} onPress={() => setShowPicker(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Seleccionar período</Text>

            {MESES_OPCIONES.map((opcion, i) => {
              const selected = opcion.key === mesKey;
              const showDivider = i > 0 && opcion.esGeneral;
              return (
                <React.Fragment key={opcion.key}>
                  {showDivider && <View style={styles.divider} />}
                  <TouchableOpacity
                    style={[
                      styles.mesRow,
                      selected && styles.mesRowSelected,
                      opcion.esGeneral && styles.mesRowGeneral,
                    ]}
                    onPress={() => { setMesKey(opcion.key); setShowPicker(false); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.mesRowLabel,
                      selected && styles.mesRowLabelSelected,
                      opcion.esGeneral && styles.mesRowLabelGeneral,
                    ]}>
                      {opcion.label}
                    </Text>
                    {selected && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                </React.Fragment>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutroClaro },
  scroll: { padding: 16, paddingBottom: 40 },

  mesSelector: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.blanco, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
    marginBottom: 20, elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4,
    borderWidth: 1.5, borderColor: Colors.verdePrincipal + '40',
  },
  mesSelectorLabel: { fontSize: 11, color: Colors.textoSecundario, marginBottom: 2 },
  mesSelectorValue: { fontSize: 15, fontWeight: '700', color: Colors.verdeOscuro },
  mesSelectorArrow: { fontSize: 18, color: Colors.verdePrincipal },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.verdeOscuro, marginBottom: 12 },
  donutCard: { backgroundColor: Colors.blanco, borderRadius: 14, padding: 16, marginBottom: 20, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  leyenda: { width: '100%', marginTop: 12 },
  leyendaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  leyendaDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  leyendaNombre: { flex: 1, fontSize: 13, color: Colors.textoPrincipal },
  leyendaVal: { fontSize: 13, fontWeight: '700', color: Colors.verdePrincipal },
  chartCard: { backgroundColor: Colors.blanco, borderRadius: 14, padding: 16, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  exportBtn: { width: '100%', marginBottom: 12 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.blanco, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 36 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: Colors.verdeOscuro, marginBottom: 16 },
  mesRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, marginBottom: 6 },
  mesRowSelected: { backgroundColor: Colors.verdePrincipal + '14' },
  mesRowLabel: { fontSize: 15, color: Colors.textoPrincipal, fontWeight: '500' },
  mesRowLabelSelected: { color: Colors.verdePrincipal, fontWeight: '700' },
  mesRowGeneral: { backgroundColor: Colors.verdeOscuro + '08' },
  mesRowLabelGeneral: { color: Colors.verdeOscuro, fontWeight: '600' },
  checkmark: { fontSize: 16, color: Colors.verdePrincipal, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 6 },
});
