import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';

interface BodegaRow {
  id: string;
  codigo: string;
  nombre: string;
  ciudad: string | null;
  direccion: string | null;
  activa: boolean;
}

export default function AdminBodegasList() {
  const [items, setItems] = useState<BodegaRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bodegas')
        .select('id, codigo, nombre, ciudad, direccion, activa')
        .order('nombre', { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      console.warn('[Admin Bodegas] error listando', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>Bodegas</Text>
        <Link href="/admin/bodegas/new" asChild>
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Nueva Bodega</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {items.map((b) => (
        <View key={b.id} style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.name}>{b.nombre}</Text>
            <Text style={[styles.badge, { backgroundColor: b.activa ? '#DBEAFE' : '#F3F4F6', color: b.activa ? '#1E40AF' : '#374151' }]}>
              {b.activa ? 'Activa' : 'Inactiva'}
            </Text>
          </View>
          <Text style={styles.sub}>Código: {b.codigo}</Text>
          <Text style={styles.sub}>Ciudad: {b.ciudad || '-'}</Text>
          <Text style={styles.sub}>Dirección: {b.direccion || '-'}</Text>
        </View>
      ))}

      {items.length === 0 && !loading && (
        <Text style={styles.empty}>No hay bodegas. Crea la primera.</Text>
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
