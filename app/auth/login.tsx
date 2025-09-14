import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

interface FormValues {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>({
    defaultValues: { email: '', password: '' }
  });
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/admin');
      }
      setLoadingSession(false);
    };
    check();
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      });
      if (error) throw error;
      router.replace('/admin');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo iniciar sesión');
    }
  };

  const onSignUp = async (values: FormValues) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email.trim(),
        password: values.password,
        options: {
          emailRedirectTo: Platform.select({ web: window.location.origin + '/auth/login', default: undefined }),
        }
      });
      if (error) throw error;
      Alert.alert('Revisa tu email', 'Te enviamos un correo de confirmación. Después de confirmar, vuelve a iniciar sesión.');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo registrar');
    }
  };

  if (loadingSession) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Acceso de Administrador</Text>

        <Text style={styles.label}>Correo</Text>
        <Controller
          control={control}
          name="email"
          rules={{ required: 'El correo es obligatorio' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="admin@empresa.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Text style={styles.label}>Contraseña</Text>
        <Controller
          control={control}
          name="password"
          rules={{ required: 'La contraseña es obligatoria' }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
          <Text style={styles.primaryText}>{isSubmitting ? 'Ingresando...' : 'Ingresar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={handleSubmit(onSignUp)} disabled={isSubmitting}>
          <Text style={styles.secondaryText}>Crear cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: { width: 420, maxWidth: '100%', backgroundColor: 'white', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  title: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 16, textAlign: 'center' },
  label: { fontWeight: '600', color: '#111827', marginTop: 10, marginBottom: 6 },
  input: { backgroundColor: '#FFF', borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 8, padding: 12 },
  primaryBtn: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  primaryText: { color: '#FFF', fontWeight: '800' },
  secondaryBtn: { borderColor: '#2563EB', borderWidth: 1, borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 10 },
  secondaryText: { color: '#2563EB', fontWeight: '800' },
});
