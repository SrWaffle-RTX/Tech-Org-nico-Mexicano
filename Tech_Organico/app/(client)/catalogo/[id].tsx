import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Alert, Dimensions, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useCafes } from '../../../hooks/useCafes';
import { useCartContext } from '../../../contexts/CartContext';
import { useAuthContext } from '../../../contexts/AuthContext';
import { Colors } from '../../../constants/colors';
import Header from '../../../components/shared/Header';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import ImageZoomModal from '../../../components/catalog/ImageZoomModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const VIEWER_HTML = (url360: string) => `<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"/>
<script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
<style>body,html{margin:0;padding:0;height:100%;} #panorama{width:100%;height:100%;}</style>
</head><body>
<div id="panorama"></div>
<script>pannellum.viewer('panorama',{type:'equirectangular',panorama:'${url360}',autoLoad:true,showControls:false});</script>
</body></html>`;

export default function CafeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCafeById } = useCafes();
  const { addItem } = useCartContext();
  const { role } = useAuthContext();
  const router = useRouter();
  const [show360, setShow360] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomVisible, setZoomVisible] = useState(false);
  const [cantidad, setCantidad] = useState(0);
  const [selectedVarianteId, setSelectedVarianteId] = useState<string | null>(null);

  const cafe = getCafeById(id ?? '');
  if (!cafe) return null;

  const selectedVariante =
    cafe.variantes?.find(v => v.id === selectedVarianteId) ??
    cafe.variantes?.[0] ??
    null;

  const allImages = selectedVariante
    ? [selectedVariante.imagen]
    : cafe.imagenes?.length
    ? cafe.imagenes
    : [cafe.imagen];

  const descripcionActual = selectedVariante?.descripcion ?? cafe.descripcion;

  function handleAgregarCarrito() {
    if (role === 'guest') {
      Alert.alert(
        'Inicia sesión',
        'Necesitas una cuenta para agregar productos al carrito.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar sesión', onPress: () => router.push('/(auth)/login') },
        ],
      );
      return;
    }
    addItem(cafe!, cantidad);
    Alert.alert('Agregado ✓', `${cantidad} × ${cafe!.nombre} en tu carrito.`);
  }

  return (
    <View style={styles.container}>
      <Header title={cafe.nombre} showBack />
      <ScrollView showsVerticalScrollIndicator={false}>

        {show360 && cafe.url360 ? (
          <View style={styles.imageContainer}>
            <WebView source={{ html: VIEWER_HTML(cafe.url360) }} style={styles.webview} />
          </View>
        ) : (
          <View>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={e => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                setActiveImage(idx);
              }}
            >
              {allImages.map((img, i) => (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.92}
                  onPress={() => { setActiveImage(i); setZoomVisible(true); }}
                >
                  <View style={[styles.imageContainer, { width: SCREEN_WIDTH }]}>
                    <Image
                      source={img}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {allImages.length > 1 && (
              <View style={styles.dotsRow}>
                {allImages.map((_, i) => (
                  <View key={i} style={[styles.dot, i === activeImage && styles.dotActive]} />
                ))}
              </View>
            )}

            <Text style={styles.zoomHint}>Toca la imagen para ampliar</Text>
          </View>
        )}

        {cafe.tiene360 && (
          <Button
            label={show360 ? '← Ver foto' : '🌐 Vista 360°'}
            onPress={() => setShow360(v => !v)}
            variant="outline"
            size="sm"
            style={styles.btn360}
          />
        )}

        <View style={styles.body}>
          {cafe.variantes && cafe.variantes.length > 0 && (
            <View style={styles.variantesSection}>
              <Text style={styles.variantesLabel}>
                Nombre del diseño:{' '}
                <Text style={styles.variantesNombreActivo}>{selectedVariante?.nombre}</Text>
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {cafe.variantes.map(v => (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => setSelectedVarianteId(v.id)}
                    style={[styles.varianteBox, selectedVariante?.id === v.id && styles.varianteBoxActive]}
                  >
                    <Image source={v.imagen} style={styles.varianteImg} resizeMode="cover" />
                    <Text style={styles.varianteName} numberOfLines={2}>{v.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {cafe.atributos.length > 0 && (
            <View style={styles.tagsRow}>
              {cafe.atributos.map(a => (
                <Badge key={a} label={a} variant="primary" />
              ))}
            </View>
          )}

          <View style={styles.infoGrid}>
            {cafe.categoria === 'merch' ? (
              <InfoItem label="Stock" value={`${cafe.stock} pzas`} />
            ) : (
              <>
                {cafe.variedad ? <InfoItem label="Variedad" value={cafe.variedad} /> : null}
                {cafe.altitud ? <InfoItem label="Altitud" value={cafe.altitud} /> : null}
                <InfoItem label="Stock" value={`${cafe.stock} kg`} />
              </>
            )}
          </View>

          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descripcion}>{descripcionActual}</Text>

          {cafe.categoria !== 'merch' && cafe.notasDeCata.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Notas de cata</Text>
              <View style={styles.notasRow}>
                {cafe.notasDeCata.map(nota => (
                  <View key={nota} style={styles.nota}>
                    <Text style={styles.notaText}>{nota}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={styles.compraBox}>
            <View style={styles.precioBox}>
              <Text style={styles.precio}>${cafe.precio}</Text>
              <Text style={styles.unit}>{cafe.categoria === 'merch' ? '/pieza' : '/250g'}</Text>
              {cafe.precioMayoreo && (
                <Text style={styles.mayoreo}>
                  {cafe.categoria === 'merch'
                    ? `Mayoreo (12+): $${cafe.precioMayoreo}`
                    : `Mayoreo: $${cafe.precioMayoreo}`}
                </Text>
              )}
            </View>
            <View style={styles.cantidadRow}>
              <Button label="-" onPress={() => setCantidad(c => Math.max(0, c - 1))} variant="outline" size="sm" style={styles.cantBtn} />
              <Text style={styles.cantNum}>{cantidad}</Text>
              <Button label="+" onPress={() => setCantidad(c => c + 1)} variant="outline" size="sm" style={styles.cantBtn} />
            </View>
          </View>

          <Button label="Agregar al carrito 🛒" onPress={handleAgregarCarrito} style={styles.btnCarrito} />
        </View>
      </ScrollView>

      <ImageZoomModal
        images={allImages}
        initialIndex={activeImage}
        visible={zoomVisible}
        onClose={() => setZoomVisible(false)}
      />
    </View>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutroClaro },
  imageContainer: { height: 300, backgroundColor: '#FFFFFF', justifyContent: 'center' },
  image: { width: '100%', height: 300 },
  webview: { flex: 1 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: 10 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#D1D5DB' },
  dotActive: { backgroundColor: Colors.verdePrincipal, width: 18 },
  zoomHint: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textoSecundario,
    paddingVertical: 6,
  },
  btn360: { margin: 16, marginBottom: 0 },
  body: { padding: 20 },
  tagsRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, backgroundColor: Colors.blanco, borderRadius: 12, padding: 16 },
  infoItem: { alignItems: 'center', flex: 1 },
  infoLabel: { fontSize: 11, color: Colors.textoSecundario, marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: '700', color: Colors.textoPrincipal },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.verdeOscuro, marginBottom: 8 },
  descripcion: { fontSize: 14, color: Colors.textoPrincipal, lineHeight: 22, marginBottom: 20 },
  notasRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  nota: { backgroundColor: Colors.verdePrincipal + '18', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  notaText: { fontSize: 13, color: Colors.verdePrincipal, fontWeight: '600' },
  compraBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  precioBox: {},
  precio: { fontSize: 28, fontWeight: '800', color: Colors.verdePrincipal },
  unit: { fontSize: 13, color: Colors.textoSecundario },
  mayoreo: { fontSize: 12, color: Colors.tonoTierra, marginTop: 2 },
  cantidadRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cantBtn: { width: 40, height: 40 },
  cantNum: { fontSize: 20, fontWeight: '700', color: Colors.textoPrincipal, minWidth: 32, textAlign: 'center' },
  btnCarrito: { width: '100%', marginBottom: 32 },
  variantesSection: { marginBottom: 20 },
  variantesLabel: { fontSize: 13, color: Colors.textoSecundario, marginBottom: 10 },
  variantesNombreActivo: { fontWeight: '700', color: Colors.textoPrincipal },
  varianteBox: { width: 88, marginRight: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#E5E7EB', overflow: 'hidden', backgroundColor: Colors.blanco },
  varianteBoxActive: { borderColor: Colors.verdePrincipal },
  varianteImg: { width: 88, height: 88 },
  varianteName: { fontSize: 11, textAlign: 'center', padding: 6, color: Colors.textoPrincipal, lineHeight: 15 },
});
