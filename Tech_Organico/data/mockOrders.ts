import type { Order } from '../types/order';
import { mockCafes } from './mockCafes';

export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    clienteId: 'cli-003',
    clienteNombre: 'María García',
    items: [
      { cafe: mockCafes[2]!, cantidad: 2 },
      { cafe: mockCafes[0]!, cantidad: 1 },
    ],
    total: 740,
    status: 'entregado',
    direccionEntrega: 'Av. Independencia 123, Oaxaca, OAX',
    metodoPago: 'Tarjeta',
    fechaCreacion: '2026-04-25T10:00:00Z',
    fechaActualizacion: '2026-04-27T14:00:00Z',
  },
  {
    id: 'ord-002',
    clienteId: 'cli-005',
    clienteNombre: 'Juan Hernández',
    items: [{ cafe: mockCafes[3]!, cantidad: 3 }],
    total: 570,
    status: 'enviado',
    direccionEntrega: 'Calle Reforma 45, Guadalajara, JAL',
    metodoPago: 'Transferencia',
    fechaCreacion: '2026-05-05T09:30:00Z',
    fechaActualizacion: '2026-05-06T11:00:00Z',
  },
  {
    id: 'ord-003',
    clienteId: 'cli-006',
    clienteNombre: 'Brenda Torres',
    items: [{ cafe: mockCafes[4]!, cantidad: 1 }],
    total: 480,
    status: 'confirmado',
    direccionEntrega: 'Blvd. Adolfo López 78, Puebla, PUE',
    metodoPago: 'Tarjeta',
    fechaCreacion: '2026-05-09T16:00:00Z',
    fechaActualizacion: '2026-05-09T16:05:00Z',
  },
];

export const mockVentasSemana = [
  { semana: '14 abr', total: 3200, pedidos: 12 },
  { semana: '21 abr', total: 4100, pedidos: 15 },
  { semana: '28 abr', total: 3750, pedidos: 14 },
  { semana: '05 may', total: 5200, pedidos: 19 },
];

export const mockVentasPorProducto = [
  { cafeId: 'cafe-001', nombre: 'Chiapas Altura', unidades: 42, ingreso: 9240 },
  { cafeId: 'cafe-003', nombre: 'Veracruz Honey', unidades: 35, ingreso: 9100 },
  { cafeId: 'cafe-002', nombre: 'Oaxaca Anaeróbico', unidades: 28, ingreso: 8680 },
  { cafeId: 'cafe-004', nombre: 'Guerrero Oscuro', unidades: 22, ingreso: 4180 },
  { cafeId: 'cafe-005', nombre: 'Puebla Geisha', unidades: 10, ingreso: 4800 },
];
