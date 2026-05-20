import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';

const CARD_WIDTH = 160;
const CARD_HEIGHT = 118;

const RECORRIDOS = [
  {
    id: '7MWyz',
    titulo: 'Vista Aérea de los Cafetales',
    emoji: '🌤️',
    url: 'https://kuula.co/share/collection/7MWyz?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1',
  },
  {
    id: '7MWWq',
    titulo: 'Alrededores de los Cafetales',
    emoji: '🌱',
    url: 'https://kuula.co/share/collection/7MWWq?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1',
  },
  {
    id: '7MWWf',
    titulo: 'Naturaleza de los Cafetales',
    emoji: '🍃',
    url: 'https://kuula.co/share/collection/7MWWf?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1',
  },
  {
    id: '7MWwk',
    titulo: 'Soteapan Veracruz',
    emoji: '🏔️',
    url: 'https://kuula.co/share/collection/7MWwk?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1',
  },
  {
    id: '7MWRy',
    titulo: 'Invernadero en Soteapan Ver.',
    emoji: '🌿',
    url: 'https://kuula.co/share/collection/7MWRy?logo=1&info=1&fs=1&vr=0&sd=1&thumbs=1',
  },
];

export default function RecorridosSection() {
  const router = useRouter();

  const abrir = (url: string, titulo: string) => {
    router.push({ pathname: '/recorrido', params: { url, titulo } } as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.encabezado}>
        <Text style={styles.titulo}>Conoce nuestros orígenes</Text>
        <Text style={styles.subtitulo}>Recorridos 360° por nuestras fincas</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {RECORRIDOS.map(r => (
          <TouchableOpacity
            key={r.id}
            onPress={() => abrir(r.url, r.titulo)}
            activeOpacity={0.82}
          >
            <LinearGradient
              colors={[Colors.verdeSecundario, Colors.verdePrincipal]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tarjeta}
            >
              <View style={styles.badge360}>
                <Text style={styles.badge360Text}>360°</Text>
              </View>
              <Text style={styles.emoji}>{r.emoji}</Text>
              <Text style={styles.tarjetaTitulo} numberOfLines={2}>
                {r.titulo}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: Colors.neutroClaro,
  },
  encabezado: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.verdeOscuro,
    letterSpacing: 0.2,
  },
  subtitulo: {
    fontSize: 12,
    color: Colors.textoSecundario,
    marginTop: 3,
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 4,
  },
  tarjeta: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 14,
    padding: 12,
    justifyContent: 'space-between',
  },
  badge360: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.amarilloCalido,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badge360Text: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.verdeOscuro,
    letterSpacing: 0.5,
  },
  emoji: {
    fontSize: 28,
    marginTop: 4,
  },
  tarjetaTitulo: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.blanco,
    lineHeight: 16,
  },
});
