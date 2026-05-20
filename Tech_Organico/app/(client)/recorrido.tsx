import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

export default function RecorridoScreen() {
  const { url, titulo } = useLocalSearchParams<{ url: string; titulo: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [cargando, setCargando] = useState(true);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.btnRegresar} activeOpacity={0.7}>
          <Text style={styles.iconoRegresar}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo} numberOfLines={1}>{titulo}</Text>
      </View>

      <View style={styles.visor}>
        {cargando && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={Colors.verdePrincipal} />
            <Text style={styles.loaderTexto}>Cargando recorrido 360°...</Text>
          </View>
        )}
        <WebView
          source={{ uri: url as string }}
          style={styles.webview}
          onLoadEnd={() => setCargando(false)}
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          domStorageEnabled
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.verdeOscuro,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  btnRegresar: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  iconoRegresar: {
    color: Colors.blanco,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 7,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  titulo: {
    flex: 1,
    color: Colors.blanco,
    fontSize: 15,
    fontWeight: '600',
  },
  visor: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutroClaro,
    zIndex: 10,
    gap: 12,
  },
  loaderTexto: {
    color: Colors.textoSecundario,
    fontSize: 14,
  },
  webview: {
    flex: 1,
  },
});
