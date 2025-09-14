export interface Vendedor {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  zona: string;
  comision: number;
  metaVentas: number;
  ventasDelDia: number;
  ventasDelMes: number;
  avatar?: string;
}

export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen?: string;
  activo: boolean;
}

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  direccion: string;
  ciudad: string;
  tipoDocumento: 'CC' | 'NIT' | 'CE';
  numeroDocumento: string;
  fechaRegistro: Date;
  ultimaCompra?: Date;
  totalCompras: number;
}

export interface Venta {
  id: string;
  vendedorId: string;
  clienteId: string;
  productos: ProductoVenta[];
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'credito';
  estado: 'completada' | 'pendiente' | 'cancelada';
  fecha: Date;
  observaciones?: string;
  ubicacion?: {
    lat: number;
    lng: number;
    direccion: string;
  };
}

export interface ProductoVenta {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  descuento: number;
  subtotal: number;
}

export interface MetricasVendedor {
  ventasHoy: {
    cantidad: number;
    total: number;
    meta: number;
  };
  ventasSemana: {
    cantidad: number;
    total: number;
  };
  ventasMes: {
    cantidad: number;
    total: number;
    meta: number;
  };
  comisionesGanadas: number;
  clientesAtendidos: number;
  productosVendidos: number;
  promedioVenta: number;
}