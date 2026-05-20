import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../contexts/AuthContext';
import { Colors } from '../constants/colors';
import LoadingSpinner from '../components/shared/LoadingSpinner';

// Ajusta este valor a la duración real de tu GIF en milisegundos
const GIF_DURATION_MS = 6300;

// Persiste mientras el proceso de la app esté vivo; se reinicia al abrir de cero
let isFirstAppLaunch = true;

export default function SplashScreen() {
  const { isLoading, role } = useAuthContext();
  const router = useRouter();
  // En primera apertura esperamos el GIF; en reapertura dentro de la app ya está listo
  const [gifDone, setGifDone] = useState(!isFirstAppLaunch);

  useEffect(() => {
    if (!isFirstAppLaunch) return;
    const timer = setTimeout(() => {
      isFirstAppLaunch = false;
      setGifDone(true);
    }, GIF_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading || !gifDone) return;
    if (role === 'vendor') {
      router.replace('/(vendor)/dashboard');
    } else {
      router.replace('/(client)/catalogo');
    }
  }, [isLoading, role, router, gifDone]);

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Image
          source={require('../assets/images/coffee-beans.gif')}
          style={styles.gif}
          contentFit="contain"
        />
        <Text style={styles.brand}>Tech Orgánico</Text>
        <Text style={styles.tagline}>Café de especialidad mexicano</Text>
      </View>
      {isLoading && <LoadingSpinner />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.verdeOscuro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: { alignItems: 'center' },
  gif: { width: 160, height: 160, marginBottom: 16 },
  brand: { fontSize: 36, fontWeight: '800', color: Colors.blanco, letterSpacing: 1 },
  tagline: { fontSize: 15, color: Colors.neutroClaro, marginTop: 8, opacity: 0.8 },
});
