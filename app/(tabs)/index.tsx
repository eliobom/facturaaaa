import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  SafeAreaView,
  TouchableOpacity 
} from 'react-native';
import { 
  DollarSign, 
  Target, 
  TrendingUp, 
  Users, 
  Award,
  Plus,
  Scan,
  FileText,
  MapPin
} from 'lucide-react-native';
import { useVendedorStore } from '@/stores/vendedorStore';
import MetricCard from '@/components/dashboard/MetricCard';

export default function InicioScreen() {
  const { 
    vendedor,
    metricas, 
    ventasRecientes, 
    isLoading,
    isOnline,
    setVendedor,
    setMetricas, 
    setVentasRecientes, 
    setLoading 
  } = useVendedorStore();

  // Simular carga de datos del vendedor
  const loadVendedorData = async () => {
    try {
      setLoading(true);
      // Obtener sesión y perfil del usuario
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;

      let vendedorNombre = 'Vendedor';
      let vendedorEmail = session?.user?.email || '';
      let comision = 0;

      if (userId) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('full_name, commission')
          .eq('id', userId)
          .single();
        if (prof) {
          vendedorNombre = prof.full_name || vendedorNombre;
          comision = Number(prof.commission || 0);
        }
      }

      setVendedor({
        id: userId || '0',
        nombre: vendedorNombre,
        email: vendedorEmail,
        telefono: '',
        zona: '',
        comision: comision,
        metaVentas: 0,
        ventasDelDia: 0,
        ventasDelMes: 0,
        avatar: undefined as any,
      });

      // Métricas en cero por defecto (si no hay tablas ventas/clientes aún)
      setMetricas({
        ventasHoy: { cantidad: 0, total: 0, meta: 0 },
        ventasSemana: { cantidad: 0, total: 0 },
        ventasMes: { cantidad: 0, total: 0, meta: 0 },
        comisionesGanadas: 0,
        clientesAtendidos: 0,
        productosVendidos: 0,
        promedioVenta: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendedorData();
  }, []);

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-CO')}`;
  };

  const calcularProgreso = (actual: number, meta: number) => {
    return Math.min((actual / meta) * 100, 100);
  };

  const accionesRapidas = [
    {
      id: 'nueva-venta',
      titulo: 'Nueva Venta',
      icono: <Plus size={24} color="#FFFFFF" />,
      color: '#2563EB',
      ruta: '/vender',
    },
    {
      id: 'escanear',
      titulo: 'Escanear',
      icono: <Scan size={24} color="#FFFFFF" />,
      color: '#059669',
      ruta: '/productos',
    },
    {
      id: 'factura',
      titulo: 'Última Factura',
      icono: <FileText size={24} color="#FFFFFF" />,
      color: '#DC2626',
      ruta: '/ventas/historial',
    },
    {
      id: 'ubicacion',
      titulo: 'Mi Ubicación',
      icono: <MapPin size={24} color="#FFFFFF" />,
      color: '#7C3AED',
      ruta: '/perfil',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadVendedorData} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header del Vendedor */}
        <View style={styles.header}>
          <View style={styles.vendedorInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {vendedor?.nombre.split(' ').map(n => n[0]).join('') || 'CM'}
              </Text>
            </View>
            <View style={styles.vendedorTexto}>
              <Text style={styles.saludo}>¡Hola, {vendedor?.nombre.split(' ')[0] || 'Vendedor'}!</Text>
              <Text style={styles.zona}>{vendedor?.zona || 'Zona no asignada'}</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: isOnline ? '#059669' : '#DC2626' }]} />
                <Text style={styles.statusText}>
                  {isOnline ? 'En línea' : 'Sin conexión'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Progreso de Meta Diaria */}
        <View style={styles.metaContainer}>
          <View style={styles.metaHeader}>
            <Text style={styles.metaTitle}>Meta del Día</Text>
            <Text style={styles.metaProgreso}>
              {Math.round(calcularProgreso(metricas?.ventasHoy.total || 0, metricas?.ventasHoy.meta || 1))}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${calcularProgreso(metricas?.ventasHoy.total || 0, metricas?.ventasHoy.meta || 1)}%` }
              ]} 
            />
          </View>
          <Text style={styles.metaTexto}>
            {formatCurrency(metricas?.ventasHoy.total || 0)} de {formatCurrency(metricas?.ventasHoy.meta || 0)}
          </Text>
        </View>

        {/* Métricas del Vendedor */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricsRow}>
            <View style={styles.metricHalf}>
              <MetricCard
                title="Ventas Hoy"
                value={formatCurrency(metricas?.ventasHoy.total || 0)}
                subtitle={`${metricas?.ventasHoy.cantidad || 0} ventas`}
                icon={<DollarSign size={20} color="#2563EB" />}
                color="#2563EB"
              />
            </View>
            <View style={styles.metricHalf}>
              <MetricCard
                title="Comisiones"
                value={formatCurrency(metricas?.comisionesGanadas || 0)}
                subtitle="Este mes"
                icon={<Award size={20} color="#059669" />}
                color="#059669"
              />
            </View>
          </View>
          
          <View style={styles.metricsRow}>
            <View style={styles.metricHalf}>
              <MetricCard
                title="Clientes Atendidos"
                value={metricas?.clientesAtendidos.toString() || '0'}
                subtitle="Hoy"
                icon={<Users size={20} color="#7C3AED" />}
                color="#7C3AED"
              />
            </View>
            <View style={styles.metricHalf}>
              <MetricCard
                title="Promedio Venta"
                value={formatCurrency(metricas?.promedioVenta || 0)}
                subtitle="Este mes"
                icon={<TrendingUp size={20} color="#EA580C" />}
                color="#EA580C"
              />
            </View>
          </View>
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.accionesGrid}>
            {accionesRapidas.map((accion) => (
              <TouchableOpacity
                key={accion.id}
                style={[styles.accionButton, { backgroundColor: accion.color }]}
                activeOpacity={0.8}
              >
                <View style={styles.accionIcon}>
                  {accion.icono}
                </View>
                <Text style={styles.accionText}>{accion.titulo}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Resumen del Mes */}
        <View style={styles.section}>
          <View style={styles.resumenCard}>
            <Text style={styles.resumenTitle}>Resumen del Mes</Text>
            <View style={styles.resumenStats}>
              <View style={styles.resumenStat}>
                <Text style={styles.resumenValue}>
                  {formatCurrency(metricas?.ventasMes.total || 0)}
                </Text>
                <Text style={styles.resumenLabel}>Total Vendido</Text>
              </View>
              <View style={styles.resumenStat}>
                <Text style={styles.resumenValue}>
                  {metricas?.ventasMes.cantidad || 0}
                </Text>
                <Text style={styles.resumenLabel}>Ventas Realizadas</Text>
              </View>
              <View style={styles.resumenStat}>
                <Text style={styles.resumenValue}>
                  {Math.round(calcularProgreso(metricas?.ventasMes.total || 0, metricas?.ventasMes.meta || 1))}%
                </Text>
                <Text style={styles.resumenLabel}>Meta Mensual</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  vendedorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  vendedorTexto: {
    flex: 1,
  },
  saludo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  zona: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  metaContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  metaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  metaProgreso: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  metaTexto: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  metricsContainer: {
    paddingHorizontal: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metricHalf: {
    flex: 1,
    marginHorizontal: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  accionesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  accionButton: {
    width: '48%',
    aspectRatio: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
  },
  accionIcon: {
    marginRight: 8,
  },
  accionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resumenCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resumenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  resumenStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resumenStat: {
    alignItems: 'center',
  },
  resumenValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  resumenLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});