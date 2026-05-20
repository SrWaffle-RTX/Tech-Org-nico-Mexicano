import type { Cafe } from './cafe';

export type OrderStatus = 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';

export interface CartItem {
  cafe: Cafe;
  cantidad: number;
}

export interface Order {
  id: string;
  clienteId: string;
  clienteNombre: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  direccionEntrega: string;
  metodoPago: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  notas?: string;
}
