import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

interface Option {
  id: string;
  label: string;
}

export default function NuevaTransferencia() {
  const [productos, setProductos] = useState<Option[]>([]);
  const [bodegas, setBodegas] = useState<Option[]>([]);
  const [productoId, setProductoId] = useState('');
  const [fromBodegaId, setFromBodegaId] = useState('');
  const [toBodegaId, setToBodegaId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [{ data: prods }, { data: bods }] = await Promise.all([
        supabase.from('productos').select('id, nombre, codigo').order('nombre', { ascending: true }),
        supabase.from('bodegas').select('id, nombre, codigo').order('nombre', { ascending: true }),
      ]);
      setProductos((prods || []).map((p: any) => ({ id: p.id, label: `${p.nombre} (${p.codigo})` })));
      setBodegas((bods || []).map((b: any) => ({ id: b.id, label: `${b.nombre} (${b.codigo})` })));
    };
    load();
  }, []);

  const handleSubmit = async () => {
    if (!productoId || !fromBodegaId || !toBodegaId || !quantity) {
      Alert.alert('Campos requeridos', 'Selecciona producto, bodegas y cantidad.');
      return;
    }
    if (fromBodegaId === toBodegaId) {
      Alert.alert('Validación', 'Las bodegas origen y destino deben ser diferentes.');
      return;
    }

    try {
      setSubmitting(true);
      // Usamos procedimiento RPC si está creado; si no, caemos a inserciones básicas
      const { error } = await supabase.rpc('transfer_stock', {
        p_producto_id: productoId,
        p_from_bodega_id: fromBodegaId,
        p_to_bodega_id: toBodegaId,
        p_quantity: Number(quantity),
        p_note: note || null,
      });

      if (error) throw error;
      Alert.alert('Éxito', 'Transferencia realizada');
      router.replace('/admin/transferencias');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo realizar la transferencia');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nueva Transferencia</Text>

      <Text style={styles.label}>Producto</Text>
      <View style={styles.selectList}>
        {productos.map((opt) => (
          <TouchableOpacity key={opt.id} style={[styles.option, productoId === opt.id && styles.optionActive]} onPress={() => setProductoId(opt.id)}>
            <Text style={styles.optionText}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Bodega Origen</Text>
      <View style={styles.selectList}>
        {bodegas.map((opt) => (
          <TouchableOpacity key={opt.id} style={[styles.option, fromBodegaId === opt.id && styles.optionActive]} onPress={() => setFromBodegaId(opt.id)}>
            <Text style={styles.optionText}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Bodega Destino</Text>
      <View style={styles.selectList}>
        {bodegas.map((opt) => (
          <TouchableOpacity key={opt.id} style={[styles.option, toBodegaId === opt.id && styles.optionActive]} onPress={() => setToBodegaId(opt.id)}>
            <Text style={styles.optionText}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Cantidad</Text>
      <TextInput style={styles.input} placeholder="0" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />

      <Text style={styles.label}>Nota</Text>
      <TextInput style={[styles.input, styles.textarea]} placeholder="Opcional" value={note} onChangeText={setNote} multiline />

      <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.primaryBtnText}>{submitting ? 'Procesando...' : 'Transferir'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 12 },
  label: { fontWeight: '600', color: '#111827', marginTop: 10, marginBottom: 6 },
  input: { backgroundColor: 'white', borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, padding: 12 },
  textarea: { height: 100, textAlignVertical: 'top' },
  selectList: { backgroundColor: 'white', borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, maxHeight: 200, overflow: 'hidden' },
  option: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  optionActive: { backgroundColor: '#EFF6FF' },
  optionText: { color: '#111827' },
  primaryBtn: { backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  primaryBtnText: { color: 'white', fontWeight: '700' },
});
