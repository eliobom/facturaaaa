import React from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

interface FormValues {
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: string;
  stock: string;
  categoria?: string;
  imagen?: string;
  activo: boolean;
}

export default function NuevoProducto() {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      codigo: '',
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '0',
      categoria: '',
      imagen: '',
      activo: true,
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        codigo: values.codigo.trim(),
        nombre: values.nombre.trim(),
        descripcion: values.descripcion?.trim() || null,
        precio: Number(values.precio || 0),
        stock: Number(values.stock || 0),
        categoria: values.categoria?.trim() || null,
        imagen: values.imagen?.trim() || null,
        activo: values.activo,
      };

      const { error } = await supabase.from('productos').insert(payload);
      if (error) throw error;
      Alert.alert('Éxito', 'Producto creado correctamente');
      router.replace('/admin/productos');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo crear el producto');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nuevo Producto</Text>

      <Text style={styles.label}>Código</Text>
      <Controller
        control={control}
        name="codigo"
        rules={{ required: 'El código es obligatorio' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="P-001" value={value} onChangeText={onChange} />
        )}
      />
      {errors.codigo && <Text style={styles.error}>{errors.codigo.message}</Text>}

      <Text style={styles.label}>Nombre</Text>
      <Controller
        control={control}
        name="nombre"
        rules={{ required: 'El nombre es obligatorio' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Camiseta" value={value} onChangeText={onChange} />
        )}
      />
      {errors.nombre && <Text style={styles.error}>{errors.nombre.message}</Text>}

      <Text style={styles.label}>Descripción</Text>
      <Controller
        control={control}
        name="descripcion"
        render={({ field: { onChange, value } }) => (
          <TextInput style={[styles.input, styles.textarea]} placeholder="Detalle del producto" value={value} onChangeText={onChange} multiline />
        )}
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>Precio</Text>
          <Controller
            control={control}
            name="precio"
            rules={{ required: 'Precio requerido' }}
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="0" value={value} onChangeText={onChange} keyboardType="numeric" />
            )}
          />
          {errors.precio && <Text style={styles.error}>{errors.precio.message}</Text>}
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.label}>Stock</Text>
          <Controller
            control={control}
            name="stock"
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="0" value={value} onChangeText={onChange} keyboardType="numeric" />
            )}
          />
        </View>
      </View>

      <Text style={styles.label}>Categoría</Text>
      <Controller
        control={control}
        name="categoria"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Ropa" value={value} onChangeText={onChange} />
        )}
      />

      <Text style={styles.label}>URL de imagen</Text>
      <Controller
        control={control}
        name="imagen"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="https://..." value={value} onChangeText={onChange} />
        )}
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Activo</Text>
        <Controller
          control={control}
          name="activo"
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
  textarea: { height: 100, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  primaryBtn: { backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  primaryBtnText: { color: 'white', fontWeight: '700' },
  error: { color: '#DC2626', marginTop: 4 },
});
