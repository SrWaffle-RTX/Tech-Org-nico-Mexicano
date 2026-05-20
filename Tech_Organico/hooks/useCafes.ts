import { useState, useMemo } from 'react';
import { mockCafes } from '../data/mockCafes';
import type { Cafe, FiltrosCafe } from '../types/cafe';

export function useCafes() {
  const [filtros, setFiltros] = useState<FiltrosCafe>({});
  const [busqueda, setBusqueda] = useState('');

  const cafes = useMemo(() => {
    return mockCafes.filter(cafe => {
      if (!cafe.activo) return false;
      if (filtros.categoria && cafe.categoria !== filtros.categoria) return false;
      if (filtros.origen && cafe.origen !== filtros.origen) return false;
      if (filtros.proceso && cafe.proceso !== filtros.proceso) return false;
      if (filtros.tostado && cafe.tostado !== filtros.tostado) return false;
      if (filtros.precioMin && cafe.precio < filtros.precioMin) return false;
      if (filtros.precioMax && cafe.precio > filtros.precioMax) return false;
      if (busqueda) {
        const q = busqueda.toLowerCase();
        return (
          cafe.nombre.toLowerCase().includes(q) ||
          cafe.origen.toLowerCase().includes(q) ||
          cafe.notasDeCata.some(n => n.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [filtros, busqueda]);

  function getCafeById(id: string): Cafe | undefined {
    return mockCafes.find(c => c.id === id);
  }

  return { cafes, filtros, setFiltros, busqueda, setBusqueda, getCafeById };
}
