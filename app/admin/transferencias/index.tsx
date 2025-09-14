import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '@/lib/supabase';

interface TransferRow {
  id: string;
  producto_id: string;
  from_bodega_id: string | null;
  to_bodega_id: string | null;
  quantity: number;
  note: string | null;
  created_at: string;
}

export default function AdminTransferenciasList() {
  const [items, setItems] = useState<TransferRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stock_movements')
        .select('id, producto_id, from_bodega_id, to_bodega_id, quantity, note, created_at')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      console.warn('[Admin Transferencias] error listando', e);
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
        <Text style={styles.title}>Transferencias de Stock</Text>
        <Link href="/admin/transferencias/new" asChild>
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Nueva Transferencia</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {items.map((t) => (
        <View key={t.id} style={styles.card}>
          <Text style={styles.row}><Text style={styles.label}>Cantidad:</Text> {t.quantity}</Text>
          <Text style={styles.row}><Text style={styles.label}>De bodega:</Text> {t.from_bodega_id || '-'}</Text>
          <Text style={styles.row}><Text style={styles.label}>A bodega:</Text> {t.to_bodega_id || '-'}</Text>
          <Text style={styles.row}><Text style={styles.label}>Nota:</Text> {t.note || '-'}</Text>
          <Text style={styles.date}>{new Date(t.created_at).toLocaleString()}</Text>
        </View>
      ))}

      {items.length === 0 && !loading && (
        <Text style={styles.empty}>No hay transferencias aún.</Text>
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
  row: { color: '#111827', marginTop: 4 },
  label: { color: '#6B7280' },
  date: { color: '#6B7280', marginTop: 6, fontSize: 12 },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 30 },
});
