import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';

interface CategoryRow {
  id: string;
  nombre: string;
  descripcion: string | null;
}

export default function AdminCategoriasList() {
  const [items, setItems] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, nombre, descripcion')
        .order('nombre', { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      console.warn('[Admin Categorias] error listando', e);
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
        <Text style={styles.title}>Categorías</Text>
        <Link href="/admin/categorias/new" asChild>
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Nueva Categoría</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {items.map((c) => (
        <View key={c.id} style={styles.card}>
          <Text style={styles.name}>{c.nombre}</Text>
          {c.descripcion ? <Text style={styles.sub}>{c.descripcion}</Text> : null}
        </View>
      ))}

      {items.length === 0 && !loading && (
        <Text style={styles.empty}>No hay categorías. Crea la primera.</Text>
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
  name: { fontSize: 16, fontWeight: '700', color: '#111827' },
  sub: { color: '#6B7280', marginTop: 6 },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 30 },
});
