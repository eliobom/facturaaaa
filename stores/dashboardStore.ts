import { create } from 'zustand';
import { DashboardMetrics, VentaReciente, ProductoPopular, AlertaInventario } from '@/types/dashboard';

interface DashboardState {
  metrics: DashboardMetrics | null;
  ventasRecientes: VentaReciente[];
  productosPopulares: ProductoPopular[];
  alertasInventario: AlertaInventario[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setMetrics: (metrics: DashboardMetrics) => void;
  setVentasRecientes: (ventas: VentaReciente[]) => void;
  setProductosPopulares: (productos: ProductoPopular[]) => void;
  setAlertasInventario: (alertas: AlertaInventario[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  metrics: null,
  ventasRecientes: [],
  productosPopulares: [],
  alertasInventario: [],
  isLoading: false,
  error: null,

  setMetrics: (metrics) => set({ metrics }),
  setVentasRecientes: (ventasRecientes) => set({ ventasRecientes }),
  setProductosPopulares: (productosPopulares) => set({ productosPopulares }),
  setAlertasInventario: (alertasInventario) => set({ alertasInventario }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));