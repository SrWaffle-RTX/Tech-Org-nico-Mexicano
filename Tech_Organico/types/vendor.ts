export type SegmentoCliente = 'mayoreo' | 'detalle' | 'nuevo';

export interface ClienteVendedor {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  segmento: SegmentoCliente;
  totalCompras: number;
  montoTotal: number;
  ultimaCompra: string;
  frecuenciaCompra: number;
  notas?: string;
}

export interface VentaSemanal {
  semana: string;
  total: number;
  pedidos: number;
}

export interface VentaPorProducto {
  cafeId: string;
  nombre: string;
  unidades: number;
  ingreso: number;
}

export interface DashboardKPIs {
  ventasMes: number;
  pedidosMes: number;
  satisfaccion: number;
  topProducto: string;
  crecimiento: number;
}
