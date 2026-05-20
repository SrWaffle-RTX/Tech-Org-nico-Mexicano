import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../contexts/AuthContext';
import { Colors } from '../constants/colors';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function SplashScreen() {
  const { isLoading, role } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      if (role === 'vendor') {
        router.replace('/(vendor)/dashboard');
      } else {
        router.replace('/(client)/catalogo');
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, [isLoading, role, router]);

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.emoji}>☕</Text>
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
  emoji: { fontSize: 72, marginBottom: 16 },
  brand: { fontSize: 36, fontWeight: '800', color: Colors.blanco, letterSpacing: 1 },
  tagline: { fontSize: 15, color: Colors.neutroClaro, marginTop: 8, opacity: 0.8 },
});
