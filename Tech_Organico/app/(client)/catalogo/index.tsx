import React from 'react';
import { View, FlatList, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCafes } from '../../../hooks/useCafes';
import { Colors } from '../../../constants/colors';
import CafeCard from '../../../components/catalog/CafeCard';
import FiltroBar from '../../../components/catalog/FiltroBar';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import Header from '../../../components/shared/Header';
import RecorridosSection from '../../../components/client/RecorridosSection';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

export default function CatalogoScreen() {
  const { cafes, filtros, setFiltros, busqueda, setBusqueda } = useCafes();
  const { role } = useAuthContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Header
        title="Tech Orgánico Mexicano"
        logoSource={require('../../../assets/images/logo.png')}
        rightAction={role === 'guest' ? { icon: '👤', onPress: () => router.push('/(auth)/login') } : undefined}
      />
      <View style={styles.searchBox}>
        <TextInput
          style={styles.search}
          placeholder="Buscar café, origen, notas..."
          placeholderTextColor={Colors.textoSecundario}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>
      <FiltroBar filtros={filtros} onChangeFiltros={setFiltros} />
      <FlatList
        data={cafes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <CafeCard cafe={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<RecorridosSection />}
        ListEmptyComponent={<LoadingSpinner message="Sin resultados para estos filtros." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutroClaro },
  searchBox: { paddingHorizontal: 16, paddingTop: 12 },
  search: {
    backgroundColor: Colors.blanco,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textoPrincipal,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
});
