import type { ImageSourcePropType } from 'react-native';

export type TostadoLevel = 'claro' | 'medio' | 'oscuro';
export type ProcesoCafe = 'lavado' | 'natural' | 'honey' | 'anaerobico';
export type OrigenCafe =
  | 'Chiapas'
  | 'Oaxaca'
  | 'Veracruz'
  | 'Guerrero'
  | 'Puebla'
  | 'Nayarit';
export type CategoriaCatalogo = 'coleccion_cafetalera' | 'merch';

export interface CafeVariante {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen: ImageSourcePropType;
}

export interface Cafe {
  id: string;
  nombre: string;
  origen?: OrigenCafe;
  categoria: CategoriaCatalogo;
  atributos: string[];
  proceso?: ProcesoCafe;
  tostado?: TostadoLevel;
  altitud?: string;
  variedad?: string;
  descripcion: string;
  notasDeCata: string[];
  precio: number;
  precioMayoreo?: number;
  imagen: ImageSourcePropType;
  imagenes?: ImageSourcePropType[];
  variantes?: CafeVariante[];
  tiene360: boolean;
  url360?: string;
  stock: number;
  activo: boolean;
}

export interface FiltrosCafe {
  categoria?: CategoriaCatalogo;
  origen?: OrigenCafe;
  proceso?: ProcesoCafe;
  tostado?: TostadoLevel;
  precioMin?: number;
  precioMax?: number;
}
