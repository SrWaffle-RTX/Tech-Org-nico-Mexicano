import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet,
  Modal, TouchableOpacity, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthContext } from '../../contexts/AuthContext';
import { Colors } from '../../constants/colors';
import StatCard from '../../components/vendor/StatCard';
import SalesChart from '../../components/vendor/SalesChart';
import ProductCRMCard from '../../components/vendor/ProductCRMCard';
import { mockDatosMes } from '../../data/mockOrders';
import type { MesKey } from '../../data/mockOrders';

const MESES_OPCIONES: { key: MesKey; label: string; esGeneral?: boolean }[] = [
  { key: 'enero',   label: 'Enero 2026' },
  { key: 'febrero', label: 'Febrero 2026' },
  { key: 'marzo',   label: 'Marzo 2026' },
  { key: 'abril',   label: 'Abril 2026' },
  { key: 'mayo',    label: 'Mayo 2026' },
  { key: 'general', label: 'Vista general', esGeneral: true },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function DashboardScreen() {
  const { user } = useAuthContext();
  const insets = useSafeAreaInsets();
  const [mesKey, setMesKey] = useState<MesKey>('mayo');
  const [showPicker, setShowPicker] = useState(false);

  const datosMes = mockDatosMes[mesKey];
  const { ventasSemana, productoCRM, subtitleVentas } = datosMes;

  const totalVentas = productoCRM.reduce((s, p) => s + p.ingresoMes, 0);
  const totalUnidades = productoCRM.reduce((s, p) => s + p.unidadesMes, 0);
  const topProducto = productoCRM.reduce((a, b) => (a.unidadesMes > b.unidadesMes ? a : b));
  const semanaActual = ventasSemana[ventasSemana.length - 1];

  const mesOp = MESES_OPCIONES.find(m => m.key === mesKey)!;
  const mesLabel = mesOp.label;
  const chipLabel = mesKey === 'general' ? 'General' : mesOp.label.split(' ')[0];
  const unidadesSubtitle = datosMes.subtitleUnidades ?? `${semanaActual?.pedidos ?? 0} esta semana`;
  const headerSubtitle = mesKey === 'general' ? 'Vista general · Ene–May 2026' : `Resumen de ${mesLabel}`;

  return (
    <>
      <ScrollView
        style={styles.bg}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 4 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.topBar}>
          <View style={styles.greetingArea}>
            <Text style={styles.greeting}>
              {getGreeting()}, {user?.nombre ?? 'Admin'} 👋
            </Text>
            <Text style={styles.subtitle}>{headerSubtitle}</Text>
          </View>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* KPIs */}
        <View style={styles.kpiGrid}>
          {/* Card tappable para cambiar mes */}
          <TouchableOpacity
            style={styles.statWrapper}
            onPress={() => setShowPicker(true)}
            activeOpacity={0.85}
          >
            <StatCard
              title="Ventas del mes"
              value={`$${totalVentas.toLocaleString()}`}
              subtitle={subtitleVentas}
              icon="💰"
              color={Colors.verdePrincipal}
            />
            <View style={styles.mesChip}>
              <Text style={styles.mesChipText}>{chipLabel} ▾</Text>
            </View>
          </TouchableOpacity>

          <StatCard
            title="Unidades vendidas"
            value={String(totalUnidades)}
            subtitle={unidadesSubtitle}
            icon="📦"
            color={Colors.verdeSecundario}
          />
        </View>
        <View style={styles.kpiGrid}>
          <StatCard
            title="Satisfacción"
            value="4.8/5"
            subtitle="92% reseñas positivas"
            icon="⭐"
            color={Colors.amarilloCalido}
          />
          <StatCard
            title="Top producto"
            value={topProducto.nombre.replace('Café ', '')}
            subtitle={`${topProducto.unidadesMes} unidades`}
            icon="🏆"
            color={Colors.tonoTierra}
          />
        </View>

        {/* Gráfica semanal */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ventas semanales</Text>
        </View>
        <View style={styles.chartCard}>
          <SalesChart data={ventasSemana} />
        </View>

        {/* CRM */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Colección Cafetalera</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>3 productos</Text>
            </View>
          </View>
          <Text style={styles.sectionSub}>Precio · ventas · stock por producto</Text>
        </View>

        {productoCRM.map((item, i) => (
          <ProductCRMCard key={item.cafeId} item={item} index={i} />
        ))}
      </ScrollView>

      {/* Modal selector de mes */}
      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowPicker(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Seleccionar mes</Text>

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
  bg: { flex: 1, backgroundColor: Colors.neutroClaro },
  scroll: { paddingLeft: 16, paddingRight: 20, paddingBottom: 40 },
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, paddingLeft: 48 },
  greetingArea: { flex: 1 },
  greeting: { fontSize: 22, fontWeight: '800', color: Colors.verdeOscuro },
  subtitle: { fontSize: 13, color: Colors.textoSecundario, marginTop: 2 },
  logo: { width: 68, height: 68 },
  kpiGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },

  // Wrapper que contiene StatCard + chip encima
  statWrapper: { flex: 1, position: 'relative' },
  mesChip: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.verdePrincipal + '18',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  mesChipText: { fontSize: 10, color: Colors.verdePrincipal, fontWeight: '700' },

  sectionHeader: { marginTop: 20, marginBottom: 12 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.verdeOscuro },
  sectionBadge: { backgroundColor: Colors.verdePrincipal + '18', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  sectionBadgeText: { fontSize: 11, color: Colors.verdePrincipal, fontWeight: '600' },
  sectionSub: { fontSize: 12, color: Colors.textoSecundario, marginTop: 3 },
  chartCard: { backgroundColor: Colors.blanco, borderRadius: 14, padding: 16, marginBottom: 4, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },

  // Modal
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
