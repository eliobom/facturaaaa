export interface DashboardMetrics {
  ventasHoy: {
    cantidad: number;
    total: number;
    crecimiento: number;
  };
  ventasSemana: {
    cantidad: number;
    total: number;
    crecimiento: number;
  };
  ventasMes: {
    cantidad: number;
    total: number;
    crecimiento: number;
  };
  productosVendidos: number;
  clientesAtendidos: number;
  inventarioBajo: number;
}

export interface VentaReciente {
  id: string;
  cliente: string;
  productos: string[];
  total: number;
  fecha: Date;
  estado: 'completada' | 'pendiente' | 'cancelada';
}

export interface ProductoPopular {
  id: string;
  nombre: string;
  categoria: string;
  ventasHoy: number;
  ingresos: number;
  stock: number;
}

export interface AlertaInventario {
  id: string;
  producto: string;
  stockActual: number;
  stockMinimo: number;
  categoria: string;
}