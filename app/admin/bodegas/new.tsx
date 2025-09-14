import React from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

interface FormValues {
  codigo: string;
  nombre: string;
  ciudad?: string;
  direccion?: string;
  activa: boolean;
}

export default function NuevaBodega() {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      codigo: '',
      nombre: '',
      ciudad: '',
      direccion: '',
      activa: true,
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        codigo: values.codigo.trim(),
        nombre: values.nombre.trim(),
        ciudad: values.ciudad?.trim() || null,
        direccion: values.direccion?.trim() || null,
        activa: values.activa,
      };

      const { error } = await supabase.from('bodegas').insert(payload);
      if (error) throw error;
      Alert.alert('Éxito', 'Bodega creada correctamente');
      router.replace('/admin/bodegas');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo crear la bodega');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nueva Bodega</Text>

      <Text style={styles.label}>Código</Text>
      <Controller
        control={control}
        name="codigo"
        rules={{ required: 'El código es obligatorio' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="BOD-001" value={value} onChangeText={onChange} />
        )}
      />
      {errors.codigo && <Text style={styles.error}>{errors.codigo.message}</Text>}

      <Text style={styles.label}>Nombre</Text>
      <Controller
        control={control}
        name="nombre"
        rules={{ required: 'El nombre es obligatorio' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Bodega Central" value={value} onChangeText={onChange} />
        )}
      />
      {errors.nombre && <Text style={styles.error}>{errors.nombre.message}</Text>}

      <Text style={styles.label}>Ciudad</Text>
      <Controller
        control={control}
        name="ciudad"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Medellín" value={value} onChangeText={onChange} />
        )}
      />

      <Text style={styles.label}>Dirección</Text>
      <Controller
        control={control}
        name="direccion"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Calle 10 # 20-30" value={value} onChangeText={onChange} />
        )}
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Activa</Text>
        <Controller
          control={control}
          name="activa"
          render={({ field: { onChange, value } }) => (
            <Switch value={value} onValueChange={onChange} />
          )}
        />
      </View>

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
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  primaryBtn: { backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  primaryBtnText: { color: 'white', fontWeight: '700' },
  error: { color: '#DC2626', marginTop: 4 },
});
