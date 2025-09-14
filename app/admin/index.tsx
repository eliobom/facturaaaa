import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { BarChart, AreaChart, DonutChart } from '@/components/admin/WebCharts';

export default function AdminHome() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    productos: 0,
    bodegas: 0,
    categorias: 0,
    proveedores: 0,
  });

  const load = async () => {
    setLoading(true);
    try {
      const [p, b, c, s] = await Promise.all([
        supabase.from('productos').select('*', { count: 'exact', head: true }),
        supabase.from('bodegas').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('suppliers').select('*', { count: 'exact', head: true }),
      ]);
      setStats({
        productos: p.count || 0,
        bodegas: b.count || 0,
        categorias: c.count || 0,
        proveedores: s.count || 0,
      });
    } catch (e) {
      console.warn('[Admin] load stats error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Dashboard User</Text>

      {/* Stat cards */}
      <View style={styles.row}>
        <View style={[styles.statCard, styles.mr12]}>
          <Text style={styles.statLabel}>Productos</Text>
          <Text style={styles.statValue}>{stats.productos}</Text>
        </View>
        <View style={[styles.statCard, styles.mr12]}>
          <Text style={styles.statLabel}>Bodegas</Text>
          <Text style={styles.statValue}>{stats.bodegas}</Text>
        </View>
        <View style={[styles.statCard, styles.mr12]}>
          <Text style={styles.statLabel}>Categorías</Text>
          <Text style={styles.statValue}>{stats.categorias}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Proveedores</Text>
          <Text style={styles.statValue}>{stats.proveedores}</Text>
        </View>
      </View>

      <View style={styles.row}>
        {/* Charts column */}
        <View style={[styles.chartsCol, styles.mr12]}>
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Movimientos por mes</Text>
            {Platform.OS === 'web' ? <BarChart /> : <View style={styles.barChartPlaceholder} />}
          </View>
          <View style={styles.chartCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.chartTitle}>Resumen</Text>
              <View style={styles.calendarPlaceholder} />
            </View>
            {Platform.OS === 'web' ? <AreaChart /> : <View style={styles.areaChartPlaceholder} />}
          </View>
        </View>

        {/* Side KPI */}
        <View style={styles.kpiSide}>
          <View style={styles.kpiCard}>
            {Platform.OS === 'web' ? <DonutChart /> : (
              <View style={styles.donutPlaceholder}><Text style={styles.kpiDonutValue}>45%</Text></View>
            )}
            <View style={{ marginTop: 12 }}>
              <Text style={styles.kpiLine}>Lorem ipsum</Text>
              <Text style={styles.kpiLine}>Dolor amet</Text>
              <Text style={styles.kpiLine}>Lorem ipsum</Text>
              <Text style={styles.kpiLine}>Dolor amet</Text>
            </View>
            <View style={styles.kpiButton}><Text style={styles.kpiButtonText}>Check Now</Text></View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 16 },
  row: { flexDirection: 'row', marginBottom: 12 },
  mr12: { marginRight: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statLabel: { color: '#64748B', fontWeight: '600', marginBottom: 6 },
  statValue: { color: '#0F172A', fontWeight: '800', fontSize: 22 },

  chartsCol: { flex: 3 },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chartTitle: { color: '#0F172A', fontWeight: '700', marginBottom: 10 },
  barChartPlaceholder: { height: 180, backgroundColor: '#EEF2FF', borderRadius: 10, borderWidth: 1, borderColor: '#DBEAFE' },
  areaChartPlaceholder: { height: 130, backgroundColor: '#FFF7ED', borderRadius: 10, borderWidth: 1, borderColor: '#FED7AA', marginTop: 10 },
  calendarPlaceholder: { width: 80, height: 24, backgroundColor: '#F1F5F9', borderRadius: 6 },

  kpiSide: { flex: 1, paddingLeft: 6 },
  kpiCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  donutPlaceholder: { width: 160, height: 160, borderRadius: 80, borderWidth: 14, borderColor: '#FBBF24', justifyContent: 'center', alignItems: 'center', marginVertical: 4 },
  kpiDonutValue: { fontWeight: '800', fontSize: 22, color: '#0F172A' },
  kpiLine: { color: '#64748B', marginTop: 6 },
  kpiButton: { marginTop: 12, backgroundColor: '#2563EB', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
  kpiButtonText: { color: '#FFFFFF', fontWeight: '800' },
});
