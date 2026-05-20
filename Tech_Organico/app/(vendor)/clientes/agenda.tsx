import React, { useState, useMemo } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import { mockClients } from '../../../data/mockClients';
import { Colors } from '../../../constants/colors';
import Header from '../../../components/shared/Header';
import ClientRow from '../../../components/vendor/ClientRow';
import type { ClienteVendedor } from '../../../types/vendor';

export default function AgendaClientesScreen() {
  const [busqueda, setBusqueda] = useState('');

  const clientes = useMemo(() => {
    if (!busqueda) return mockClients;
    const q = busqueda.toLowerCase();
    return mockClients.filter(
      c => c.nombre.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    );
  }, [busqueda]);

  return (
    <View style={styles.container}>
      <Header title="Agenda de clientes" />
      <View style={styles.searchBox}>
        <TextInput
          style={styles.search}
          placeholder="Buscar por nombre o correo..."
          placeholderTextColor={Colors.textoSecundario}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>
      <FlatList
        data={clientes}
        keyExtractor={c => c.id}
        renderItem={({ item }) => <ClientRow cliente={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutroClaro },
  searchBox: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  search: { backgroundColor: Colors.blanco, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.textoPrincipal, borderWidth: 1, borderColor: '#E5E7EB' },
  list: { padding: 16, paddingBottom: 32 },
});
