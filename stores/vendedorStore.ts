import { create } from 'zustand';
import { Vendedor, MetricasVendedor, Venta, Cliente, Producto } from '@/types/vendedor';

interface VendedorState {
  // Datos del vendedor
  vendedor: Vendedor | null;
  metricas: MetricasVendedor | null;
  
  // Datos de trabajo
  productos: Producto[];
  clientes: Cliente[];
  ventasRecientes: Venta[];
  
  // Estados de UI
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
  
  // Venta en progreso
  ventaActual: {
    cliente: Cliente | null;
    productos: ProductoVenta[];
    descuentoGeneral: number;
    observaciones: string;
  };
  
  // Actions
  setVendedor: (vendedor: Vendedor) => void;
  setMetricas: (metricas: MetricasVendedor) => void;
  setProductos: (productos: Producto[]) => void;
  setClientes: (clientes: Cliente[]) => void;
  setVentasRecientes: (ventas: Venta[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOnlineStatus: (status: boolean) => void;
  
  // Venta actions
  iniciarVenta: () => void;
  seleccionarCliente: (cliente: Cliente) => void;
  agregarProducto: (producto: Producto, cantidad: number) => void;
  removerProducto: (productoId: string) => void;
  actualizarCantidad: (productoId: string, cantidad: number) => void;
  aplicarDescuento: (descuento: number) => void;
  completarVenta: (metodoPago: string) => Promise<void>;
  cancelarVenta: () => void;
}

export const useVendedorStore = create<VendedorState>((set, get) => ({
  // Estado inicial
  vendedor: null,
  metricas: null,
  productos: [],
  clientes: [],
  ventasRecientes: [],
  isLoading: false,
  error: null,
  isOnline: true,
  
  ventaActual: {
    cliente: null,
    productos: [],
    descuentoGeneral: 0,
    observaciones: '',
  },

  // Setters básicos
  setVendedor: (vendedor) => set({ vendedor }),
  setMetricas: (metricas) => set({ metricas }),
  setProductos: (productos) => set({ productos }),
  setClientes: (clientes) => set({ clientes }),
  setVentasRecientes: (ventasRecientes) => set({ ventasRecientes }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setOnlineStatus: (isOnline) => set({ isOnline }),

  // Acciones de venta
  iniciarVenta: () => set({
    ventaActual: {
      cliente: null,
      productos: [],
      descuentoGeneral: 0,
      observaciones: '',
    }
  }),

  seleccionarCliente: (cliente) => set(state => ({
    ventaActual: { ...state.ventaActual, cliente }
  })),

  agregarProducto: (producto, cantidad) => set(state => {
    const productosActuales = [...state.ventaActual.productos];
    const existente = productosActuales.find(p => p.productoId === producto.id);
    
    if (existente) {
      existente.cantidad += cantidad;
      existente.subtotal = existente.cantidad * existente.precio;
    } else {
      productosActuales.push({
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad,
        descuento: 0,
        subtotal: cantidad * producto.precio,
      });
    }
    
    return {
      ventaActual: { ...state.ventaActual, productos: productosActuales }
    };
  }),

  removerProducto: (productoId) => set(state => ({
    ventaActual: {
      ...state.ventaActual,
      productos: state.ventaActual.productos.filter(p => p.productoId !== productoId)
    }
  })),

  actualizarCantidad: (productoId, cantidad) => set(state => {
    const productos = state.ventaActual.productos.map(p => 
      p.productoId === productoId 
        ? { ...p, cantidad, subtotal: cantidad * p.precio }
        : p
    );
    
    return {
      ventaActual: { ...state.ventaActual, productos }
    };
  }),

  aplicarDescuento: (descuento) => set(state => ({
    ventaActual: { ...state.ventaActual, descuentoGeneral: descuento }
  })),

  completarVenta: async (metodoPago) => {
    // Aquí iría la lógica para guardar la venta
    console.log('Completando venta...', metodoPago);
    // Reset venta actual
    get().iniciarVenta();
  },

  cancelarVenta: () => {
    get().iniciarVenta();
  },
}));