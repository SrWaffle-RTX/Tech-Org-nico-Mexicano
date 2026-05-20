import React from 'react';
import { View, StyleSheet } from 'react-native';
import CafeTag from './CafeTag';
import type { FiltrosCafe, CategoriaCatalogo } from '../../types/cafe';

interface FiltroBarProps {
  filtros: FiltrosCafe;
  onChangeFiltros: (f: FiltrosCafe) => void;
}

const categorias: { value: CategoriaCatalogo; label: string }[] = [
  { value: 'coleccion_cafetalera', label: 'Colección Cafetalera' },
  { value: 'merch', label: 'Merch' },
];

export default function FiltroBar({ filtros, onChangeFiltros }: FiltroBarProps) {
  function toggleCategoria(c: CategoriaCatalogo) {
    onChangeFiltros({ ...filtros, categoria: filtros.categoria === c ? undefined : c });
  }

  return (
    <View style={styles.container}>
      {categorias.map(c => (
        <CafeTag
          key={c.value}
          label={c.label}
          active={filtros.categoria === c.value}
          onPress={() => toggleCategoria(c.value)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
});
