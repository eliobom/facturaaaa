import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Switch } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

interface FormValues {
  full_name: string;
  email: string;
  password: string;
  commission: string; // percentage string
  role: boolean; // true=admin, false=seller
}

export default function NuevoUsuario() {
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      commission: '0',
      role: false,
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const commissionNum = Number(values.commission || 0);
      if (Number.isNaN(commissionNum) || commissionNum < 0) {
        Alert.alert('Validación', 'Comisión inválida');
        return;
      }

      // Invitación con confirmación de email. Esto NO reemplaza la sesión actual si el proyecto requiere confirmación.
      const { data, error } = await supabase.auth.signUp({
        email: values.email.trim(),
        password: values.password,
        options: {
          data: { full_name: values.full_name },
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/login` : undefined,
        },
      });
      if (error) throw error;

      const userId = data.user?.id;
      if (!userId) {
        // Si el proyecto auto-confirma usuarios, puede venir una sesión inmediata; aún así hay user
        Alert.alert('Usuario pendiente', 'Se envió invitación. Al confirmar, podrá iniciar sesión.');
        router.replace('/admin/usuarios');
        return;
      }

      // Guardamos perfil con rol y comisión (y email para listado)
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({ id: userId, full_name: values.full_name.trim(), email: values.email.trim(), role: values.role ? 'admin' : 'seller', commission: commissionNum })
        .eq('id', userId);
      if (upsertError) throw upsertError;

      Alert.alert('Éxito', 'Usuario creado/invitado correctamente');
      router.replace('/admin/usuarios');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo crear el usuario');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nuevo Usuario</Text>

      <Text style={styles.label}>Nombre</Text>
      <Controller
        control={control}
        name="full_name"
        rules={{ required: 'Nombre requerido' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Nombre del vendedor" value={value} onChangeText={onChange} />
        )}
      />

      <Text style={styles.label}>Correo</Text>
      <Controller
        control={control}
        name="email"
        rules={{ required: 'Correo requerido' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="correo@empresa.com" keyboardType="email-address" autoCapitalize="none" value={value} onChangeText={onChange} />
        )}
      />

      <Text style={styles.label}>Contraseña temporal</Text>
      <Controller
        control={control}
        name="password"
        rules={{ required: 'Contraseña requerida' }}
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="••••••••" secureTextEntry value={value} onChangeText={onChange} />
        )}
      />

      <Text style={styles.label}>Comisión (%)</Text>
      <Controller
        control={control}
        name="commission"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="0" keyboardType="numeric" value={value} onChangeText={onChange} />
        )}
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Es Admin</Text>
        <Controller control={control} name="role" render={({ field: { value, onChange } }) => (
          <Switch value={value} onValueChange={onChange} />
        )} />
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
        <Text style={styles.primaryText}>{isSubmitting ? 'Creando...' : 'Crear usuario'}</Text>
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
  primaryBtn: { backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  primaryText: { color: 'white', fontWeight: '800' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
});
