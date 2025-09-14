import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, TextInput, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: 'admin' | 'seller';
  commission: number;
};

export default function AdminUsuariosList() {
  const router = useRouter();
  const [items, setItems] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('profiles').select('id, full_name, email, role, commission, created_at').order('created_at', { ascending: false });
      if (q.trim()) {
        query = query.ilike('email', `%${q.trim()}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      setItems((data as any) || []);
    } catch (e) {
      console.warn('[Admin Usuarios] list error', e);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => { load(); }, [load]);

  const updateCommission = async (id: string, commission: number) => {
    try {
      const { error } = await supabase.from('profiles').update({ commission }).eq('id', id);
      if (error) throw error;
      setItems((prev) => prev.map(p => p.id === id ? { ...p, commission } : p));
      Alert.alert('Éxito', 'Comisión actualizada');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo actualizar');
    }
  };

  const toggleRole = async (id: string, current: 'admin'|'seller') => {
    const next = current === 'admin' ? 'seller' : 'admin';
    try {
      const { error } = await supabase.from('profiles').update({ role: next }).eq('id', id);
      if (error) throw error;
      setItems((prev) => prev.map(p => p.id === id ? { ...p, role: next } : p));
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo cambiar el rol');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>Usuarios</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/admin/usuarios/new')}>
          <Text style={styles.primaryBtnText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Buscar por email"
        value={q}
        onChangeText={setQ}
        onSubmitEditing={load}
      />

      {items.map((u) => (
        <View key={u.id} style={styles.card}>
          <Text style={styles.name}>{u.full_name || 'Sin nombre'}</Text>
          <Text style={styles.email}>{u.email || 'sin-email'}</Text>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Comisión (%)</Text>
              <TextInput
                style={styles.input}
                defaultValue={String(u.commission || 0)}
                keyboardType="numeric"
                onEndEditing={(e) => {
                  const val = Number(e.nativeEvent.text || 0);
                  if (!Number.isNaN(val)) updateCommission(u.id, val);
                }}
              />
            </View>
            <TouchableOpacity style={styles.roleBtn} onPress={() => toggleRole(u.id, u.role)}>
              <Text style={styles.roleBtnText}>{u.role.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {items.length === 0 && !loading && (
        <Text style={styles.empty}>No hay usuarios aún. Crea el primero.</Text>
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
  search: { backgroundColor: 'white', borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12 },
  card: { backgroundColor: 'white', padding: 14, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  name: { fontSize: 16, fontWeight: '700', color: '#111827' },
  email: { color: '#6B7280', marginTop: 2 },
  rowBetween: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 8 },
  label: { fontWeight: '600', color: '#111827', marginBottom: 6 },
  input: { backgroundColor: 'white', borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, padding: 10 },
  roleBtn: { backgroundColor: '#1D4ED8', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 14 },
  roleBtnText: { color: 'white', fontWeight: '800' },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 30 },
});
