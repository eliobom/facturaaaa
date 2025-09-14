import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';

interface ProductoRow {
  id: string;
  codigo: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string | null;
  activo: boolean;
}

export default function AdminProductosList() {
  const [items, setItems] = useState<ProductoRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('id, codigo, nombre, precio, stock, categoria, activo')
        .order('nombre', { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      console.warn('[Admin Productos] error listando', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const currency = (n: number) => `$${(n || 0).toLocaleString('es-CO')}`;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>Productos</Text>
        <Link href="/admin/productos/new" asChild>
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Nuevo Producto</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {items.map((p) => (
        <View key={p.id} style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.name}>{p.nombre}</Text>
            <Text style={[styles.badge, { backgroundColor: p.activo ? '#DCFCE7' : '#FEE2E2', color: p.activo ? '#065F46' : '#991B1B' }]}>
              {p.activo ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
          <Text style={styles.sub}>Código: {p.codigo}</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.sub}>Stock: {p.stock}</Text>
            <Text style={styles.sub}>Precio: {currency(p.precio)}</Text>
          </View>
          {p.categoria ? <Text style={styles.sub}>Categoría: {p.categoria}</Text> : null}
        </View>
      ))}

      {items.length === 0 && !loading && (
        <Text style={styles.empty}>No hay productos. Crea el primero.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },
  primaryBtn: { backgroundColor: '#2563EB', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  primaryBtnText: { color: 'white', fontWeight: '700' },
  card: { backgroundColor: 'white', padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '700', color: '#111827' },
  sub: { color: '#6B7280', marginTop: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden', fontSize: 12, fontWeight: '700' },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 30 },
});
