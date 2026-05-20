import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { REGIONS, SUELO_BLOQUES, type Region } from './data';
import MapWebView from './MapWebView';
import { Colors } from '../../constants/colors';

// ─── Pestaña 1: Producción ────────────────────────────────────────────────────

function ProduccionTab({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const maxPct = Math.max(...REGIONS.map(r => r.produccion.porcentaje));

  return (
    <View>
      <View style={styles.grid}>
        {REGIONS.map(r => {
          const selected = r.id === selectedId;
          return (
            <TouchableOpacity
              key={r.id}
              style={[styles.prodCard, selected && { borderColor: r.color, borderWidth: 2 }]}
              onPress={() => onSelect(r.id)}
              activeOpacity={0.75}
            >
              <View style={[styles.colorDot, { backgroundColor: r.color }]} />
              <Text style={[styles.prodPct, { color: r.color }]}>
                {r.produccion.porcentaje}%
              </Text>
              <Text style={styles.prodName}>{r.name}</Text>
              <Text style={styles.prodTons}>
                {r.produccion.toneladas.toLocaleString()} t
              </Text>
              <Text style={styles.prodHa}>
                {r.produccion.hectareas.toLocaleString()} ha
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      backgroundColor: r.color,
                      width: `${(r.produccion.porcentaje / maxPct) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.rendimiento}>⚡ {r.produccion.rendimiento}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.source}>
        Fuente: SADER-DGSIAP 2024 · Total nacional: 1,056,317 toneladas
      </Text>
    </View>
  );
}

// ─── Pestaña 2: Perfiles de sabor ─────────────────────────────────────────────

function BarRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={styles.barRowContainer}>
      <Text style={styles.barRowLabel}>{label}</Text>
      <View style={styles.barTrackWide}>
        <View
          style={[styles.barFillWide, { width: `${value}%`, backgroundColor: color }]}
        />
      </View>
      <Text style={styles.barRowValue}>{value}</Text>
    </View>
  );
}

function PerfilesTab({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <View>
      {REGIONS.map(r => {
        const selected = r.id === selectedId;
        return (
          <TouchableOpacity
            key={r.id}
            style={[
              styles.perfilCard,
              selected && { borderColor: r.color, borderWidth: 2 },
            ]}
            onPress={() => onSelect(r.id)}
            activeOpacity={0.85}
          >
            <View style={[styles.perfilHeader, { backgroundColor: r.color + '22' }]}>
              <View style={[styles.colorDot, { backgroundColor: r.color }]} />
              <Text style={[styles.perfilName, { color: r.color }]}>{r.name}</Text>
            </View>

            <View style={styles.perfilBars}>
              <BarRow label="Acidez" value={r.perfil.acidez} color={r.color} />
              <BarRow label="Cuerpo" value={r.perfil.cuerpo} color={r.color} />
              <BarRow label="Dulzor" value={r.perfil.dulzor} color={r.color} />
              <BarRow label="Aroma"  value={r.perfil.aroma}  color={r.color} />
            </View>

            <View style={styles.notasRow}>
              {r.perfil.notas.map(n => (
                <View key={n} style={[styles.chip, { borderColor: r.color }]}>
                  <Text style={[styles.chipText, { color: r.color }]}>{n}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.metodosLabel}>
              ☕ {r.perfil.metodos.join('  ·  ')}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Pestaña 3: Suelo volcánico ───────────────────────────────────────────────

function SueloTab() {
  return (
    <View>
      {SUELO_BLOQUES.map(b => (
        <View key={b.title} style={styles.sueloBlock}>
          <Text style={styles.sueloIcon}>{b.icon}</Text>
          <View style={styles.sueloText}>
            <Text style={styles.sueloTitle}>{b.title}</Text>
            <Text style={styles.sueloDesc}>{b.desc}</Text>
          </View>
        </View>
      ))}
      <Text style={styles.source}>
        Fuente: INEGI — Edafología; SADER — Atlas Agroalimentario
      </Text>
    </View>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

const TABS = ['Producción 2024', 'Perfiles de sabor', 'Suelo volcánico'] as const;

export default function CafeVolcanicoMap() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* Mapa interactivo */}
      <View style={styles.mapContainer}>
        <MapWebView
          regions={REGIONS}
          selectedId={selectedRegion}
          onSelect={setSelectedRegion}
        />
      </View>

      {/* Barra de pestañas */}
      <View style={styles.tabBar}>
        {TABS.map((label, i) => (
          <TouchableOpacity
            key={label}
            style={[styles.tabBtn, activeTab === i && styles.tabBtnActive]}
            onPress={() => setActiveTab(i)}
            activeOpacity={0.75}
          >
            <Text
              style={[styles.tabText, activeTab === i && styles.tabTextActive]}
              numberOfLines={2}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenido de la pestaña activa */}
      <View style={styles.tabContent}>
        {activeTab === 0 && (
          <ProduccionTab selectedId={selectedRegion} onSelect={setSelectedRegion} />
        )}
        {activeTab === 1 && (
          <PerfilesTab selectedId={selectedRegion} onSelect={setSelectedRegion} />
        )}
        {activeTab === 2 && <SueloTab />}
      </View>
    </ScrollView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.neutroClaro },
  mapContainer: { height: 280 },

  // Pestañas
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.blanco,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: { borderBottomColor: Colors.verdePrincipal },
  tabText: {
    fontSize: 11,
    color: Colors.textoSecundario,
    textAlign: 'center',
    fontWeight: '500',
  },
  tabTextActive: { color: Colors.verdePrincipal, fontWeight: '700' },
  tabContent: { padding: 12, paddingBottom: 32 },

  // ── Producción ──
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  prodCard: {
    width: '47%',
    backgroundColor: Colors.blanco,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  colorDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 6 },
  prodPct: { fontSize: 26, fontWeight: '800', lineHeight: 30 },
  prodName: { fontSize: 12, color: Colors.textoSecundario, marginBottom: 4 },
  prodTons: { fontSize: 12, fontWeight: '600', color: Colors.textoPrincipal },
  prodHa: { fontSize: 11, color: Colors.textoSecundario },
  barTrack: {
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 5,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 3 },
  rendimiento: { fontSize: 10, color: Colors.textoSecundario },

  // ── Perfiles ──
  perfilCard: {
    backgroundColor: Colors.blanco,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  perfilHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  perfilName: { fontSize: 15, fontWeight: '700' },
  perfilBars: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 4, gap: 8 },
  barRowContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barRowLabel: { fontSize: 11, color: Colors.textoSecundario, width: 46 },
  barTrackWide: {
    flex: 1,
    height: 7,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFillWide: { height: '100%', borderRadius: 4 },
  barRowValue: { fontSize: 11, color: Colors.textoSecundario, width: 26, textAlign: 'right' },
  notasRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 4,
  },
  chip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  chipText: { fontSize: 11, fontWeight: '600' },
  metodosLabel: {
    fontSize: 11,
    color: Colors.textoSecundario,
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 6,
  },

  // ── Suelo volcánico ──
  sueloBlock: {
    flexDirection: 'row',
    backgroundColor: Colors.blanco,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: 'flex-start',
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sueloIcon: { fontSize: 28 },
  sueloText: { flex: 1 },
  sueloTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.verdeOscuro,
    marginBottom: 4,
  },
  sueloDesc: { fontSize: 12, color: Colors.textoSecundario, lineHeight: 18 },

  // Pie de fuente compartido
  source: {
    fontSize: 10,
    color: Colors.textoSecundario,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 4,
    paddingHorizontal: 8,
  },
});
