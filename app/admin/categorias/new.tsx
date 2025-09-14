import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

interface FormValues {
  nombre: string;
  descripcion?: string;
}

export default function NuevaCategoria() {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: { nombre: '', descripcion: '' }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        nombre: values.nombre.trim(),
        descripcion: values.descripcion?.trim() || null,
      };
      const { error } = await supabase.from('categories').insert(payload);
      if (error) throw error;
      Alert.alert('Éxito', 'Categoría creada');
      router.replace('/admin/categorias');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo crear la categoría');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nueva Categoría</Text>

      <Text style={styles.label}>Nombre</Text>
      <Controller
        control={control}
        name="nombre"
        rules={{ required: 'El nombre es obligatorio' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Ropa" value={value} onChangeText={onChange} />
        )}
      />
      {errors.nombre && <Text style={styles.error}>{errors.nombre.message}</Text>}

      <Text style={styles.label}>Descripción</Text>
      <Controller
        control={control}
        name="descripcion"
        render={({ field: { onChange, value } }) => (
          <TextInput style={[styles.input, styles.textarea]} placeholder="Opcional" value={value} onChangeText={onChange} multiline />
        )}
      />

      <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
        <Text style={styles.primaryBtnText}>{isSubmitting ? 'Guardando...' : 'Guardar'}</Text>
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
  primaryBtn: { backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  primaryBtnText: { color: 'white', fontWeight: '700' },
  error: { color: '#DC2626', marginTop: 4 },
});
