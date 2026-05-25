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

// Semanas suman $22,140 en total y 68 pedidos — coincide con unidades CRM
export const mockVentasSemana = [
  { semana: '1-7 may', total: 4800, pedidos: 16 },
  { semana: '8-14 may', total: 5200, pedidos: 17 },
  { semana: '15-21 may', total: 5900, pedidos: 18 },
  { semana: '22-31 may', total: 6240, pedidos: 17 },
];

// Ingresos por producto suman $22,140 — misma cifra que el total del mes
export const mockVentasPorProducto = [
  { cafeId: 'cafe-001', nombre: 'Café Americano', unidades: 28, ingreso: 9100 },
  { cafeId: 'cafe-002', nombre: 'Café Espresso', unidades: 22, ingreso: 6820 },
  { cafeId: 'cafe-003', nombre: 'Café Gourmet', unidades: 18, ingreso: 6220 },
];

export const mockProductoCRM = [
  {
    cafeId: 'cafe-001',
    nombre: 'Café Americano',
    origen: 'Veracruz',
    variedad: 'Bourbon',
    tostado: 'Medio',
    precio: 310,
    precioMayoreo: 260,
    unidadesMes: 28,
    ingresoMes: 9100,
    unidadesMesAnterior: 24,
    stockActual: 45,
    stockMax: 100,
  },
  {
    cafeId: 'cafe-002',
    nombre: 'Café Espresso',
    origen: 'Chiapas',
    variedad: 'Caturra',
    tostado: 'Oscuro',
    precio: 290,
    precioMayoreo: 240,
    unidadesMes: 22,
    ingresoMes: 6820,
    unidadesMesAnterior: 19,
    stockActual: 35,
    stockMax: 100,
  },
  {
    cafeId: 'cafe-003',
    nombre: 'Café Gourmet',
    origen: 'Veracruz',
    variedad: 'Geisha',
    tostado: 'Claro',
    precio: 320,
    precioMayoreo: 270,
    unidadesMes: 18,
    ingresoMes: 6220,
    unidadesMesAnterior: 15,
    stockActual: 20,
    stockMax: 100,
  },
];

export type MesKey = 'enero' | 'febrero' | 'marzo' | 'abril' | 'mayo' | 'general';

export const mockDatosMes: Record<MesKey, {
  ventasSemana: { semana: string; total: number; pedidos: number }[];
  productoCRM: typeof mockProductoCRM;
  subtitleVentas: string;
  subtitleUnidades?: string;
}> = {
  enero: {
    subtitleVentas: 'Inicio de año',
    ventasSemana: [
      { semana: '1-7 ene', total: 2000, pedidos: 7 },
      { semana: '8-14 ene', total: 2100, pedidos: 7 },
      { semana: '15-21 ene', total: 2200, pedidos: 7 },
      { semana: '22-31 ene', total: 2270, pedidos: 7 },
    ],
    productoCRM: [
      { cafeId: 'cafe-001', nombre: 'Café Americano', origen: 'Veracruz', variedad: 'Bourbon', tostado: 'Medio', precio: 310, precioMayoreo: 260, unidadesMes: 12, ingresoMes: 3720, unidadesMesAnterior: 10, stockActual: 45, stockMax: 100 },
      { cafeId: 'cafe-002', nombre: 'Café Espresso', origen: 'Chiapas', variedad: 'Caturra', tostado: 'Oscuro', precio: 290, precioMayoreo: 240, unidadesMes: 9, ingresoMes: 2610, unidadesMesAnterior: 7, stockActual: 35, stockMax: 100 },
      { cafeId: 'cafe-003', nombre: 'Café Gourmet', origen: 'Veracruz', variedad: 'Geisha', tostado: 'Claro', precio: 320, precioMayoreo: 270, unidadesMes: 7, ingresoMes: 2240, unidadesMesAnterior: 5, stockActual: 20, stockMax: 100 },
    ],
  },
  febrero: {
    subtitleVentas: '+21% vs enero',
    ventasSemana: [
      { semana: '1-7 feb', total: 2500, pedidos: 8 },
      { semana: '8-14 feb', total: 2600, pedidos: 9 },
      { semana: '15-21 feb', total: 2700, pedidos: 9 },
      { semana: '22-28 feb', total: 2600, pedidos: 8 },
    ],
    productoCRM: [
      { cafeId: 'cafe-001', nombre: 'Café Americano', origen: 'Veracruz', variedad: 'Bourbon', tostado: 'Medio', precio: 310, precioMayoreo: 260, unidadesMes: 15, ingresoMes: 4650, unidadesMesAnterior: 12, stockActual: 45, stockMax: 100 },
      { cafeId: 'cafe-002', nombre: 'Café Espresso', origen: 'Chiapas', variedad: 'Caturra', tostado: 'Oscuro', precio: 290, precioMayoreo: 240, unidadesMes: 11, ingresoMes: 3190, unidadesMesAnterior: 9, stockActual: 35, stockMax: 100 },
      { cafeId: 'cafe-003', nombre: 'Café Gourmet', origen: 'Veracruz', variedad: 'Geisha', tostado: 'Claro', precio: 320, precioMayoreo: 270, unidadesMes: 8, ingresoMes: 2560, unidadesMesAnterior: 7, stockActual: 20, stockMax: 100 },
    ],
  },
  marzo: {
    subtitleVentas: '+23% vs febrero',
    ventasSemana: [
      { semana: '1-7 mar', total: 3000, pedidos: 10 },
      { semana: '8-14 mar', total: 3200, pedidos: 11 },
      { semana: '15-21 mar', total: 3300, pedidos: 11 },
      { semana: '22-31 mar', total: 3340, pedidos: 10 },
    ],
    productoCRM: [
      { cafeId: 'cafe-001', nombre: 'Café Americano', origen: 'Veracruz', variedad: 'Bourbon', tostado: 'Medio', precio: 310, precioMayoreo: 260, unidadesMes: 18, ingresoMes: 5580, unidadesMesAnterior: 15, stockActual: 45, stockMax: 100 },
      { cafeId: 'cafe-002', nombre: 'Café Espresso', origen: 'Chiapas', variedad: 'Caturra', tostado: 'Oscuro', precio: 290, precioMayoreo: 240, unidadesMes: 14, ingresoMes: 4060, unidadesMesAnterior: 11, stockActual: 35, stockMax: 100 },
      { cafeId: 'cafe-003', nombre: 'Café Gourmet', origen: 'Veracruz', variedad: 'Geisha', tostado: 'Claro', precio: 320, precioMayoreo: 270, unidadesMes: 10, ingresoMes: 3200, unidadesMesAnterior: 8, stockActual: 20, stockMax: 100 },
    ],
  },
  abril: {
    subtitleVentas: '+38% vs marzo',
    ventasSemana: [
      { semana: '1-7 abr', total: 4100, pedidos: 13 },
      { semana: '8-14 abr', total: 4400, pedidos: 15 },
      { semana: '15-21 abr', total: 4700, pedidos: 15 },
      { semana: '22-30 abr', total: 4550, pedidos: 15 },
    ],
    productoCRM: [
      { cafeId: 'cafe-001', nombre: 'Café Americano', origen: 'Veracruz', variedad: 'Bourbon', tostado: 'Medio', precio: 310, precioMayoreo: 260, unidadesMes: 24, ingresoMes: 7440, unidadesMesAnterior: 18, stockActual: 45, stockMax: 100 },
      { cafeId: 'cafe-002', nombre: 'Café Espresso', origen: 'Chiapas', variedad: 'Caturra', tostado: 'Oscuro', precio: 290, precioMayoreo: 240, unidadesMes: 19, ingresoMes: 5510, unidadesMesAnterior: 14, stockActual: 35, stockMax: 100 },
      { cafeId: 'cafe-003', nombre: 'Café Gourmet', origen: 'Veracruz', variedad: 'Geisha', tostado: 'Claro', precio: 320, precioMayoreo: 270, unidadesMes: 15, ingresoMes: 4800, unidadesMesAnterior: 10, stockActual: 20, stockMax: 100 },
    ],
  },
  mayo: {
    subtitleVentas: '+25% vs abril',
    ventasSemana: mockVentasSemana,
    productoCRM: mockProductoCRM,
  },
  // Vista acumulada Ene–May 2026
  general: {
    subtitleVentas: 'Acumulado · Ene–May',
    subtitleUnidades: '46 prom./mes',
    ventasSemana: [
      { semana: 'Ene', total: 8570, pedidos: 28 },
      { semana: 'Feb', total: 10400, pedidos: 34 },
      { semana: 'Mar', total: 12840, pedidos: 42 },
      { semana: 'Abr', total: 17750, pedidos: 58 },
      { semana: 'May', total: 22140, pedidos: 68 },
    ],
    productoCRM: [
      { cafeId: 'cafe-001', nombre: 'Café Americano', origen: 'Veracruz', variedad: 'Bourbon', tostado: 'Medio', precio: 310, precioMayoreo: 260, unidadesMes: 97, ingresoMes: 30490, unidadesMesAnterior: 24, stockActual: 45, stockMax: 100 },
      { cafeId: 'cafe-002', nombre: 'Café Espresso', origen: 'Chiapas', variedad: 'Caturra', tostado: 'Oscuro', precio: 290, precioMayoreo: 240, unidadesMes: 75, ingresoMes: 22190, unidadesMesAnterior: 19, stockActual: 35, stockMax: 100 },
      { cafeId: 'cafe-003', nombre: 'Café Gourmet', origen: 'Veracruz', variedad: 'Geisha', tostado: 'Claro', precio: 320, precioMayoreo: 270, unidadesMes: 58, ingresoMes: 19020, unidadesMesAnterior: 15, stockActual: 20, stockMax: 100 },
    ],
  },
};
