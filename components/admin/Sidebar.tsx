import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Home, Package, Warehouse, ArrowLeftRight, Tags, Truck, Users } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

const items = [
  { href: '/admin', label: 'Inicio', icon: Home },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/bodegas', label: 'Bodegas', icon: Warehouse },
  { href: '/admin/transferencias', label: 'Transferencias', icon: ArrowLeftRight },
  { href: '/admin/categorias', label: 'Categorías', icon: Tags },
  { href: '/admin/proveedores', label: 'Proveedores', icon: Truck },
  { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setEmail(data.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  return (
    <View style={styles.sidebar}>
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AD</Text>
        </View>
        <Text style={styles.name}>Admin</Text>
        <Text style={styles.email}>admin@factura.com</Text>
      </View>

      <View style={styles.menu}>
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Pressable key={href} onPress={() => router.push(href)} style={[styles.item, active && styles.itemActive]}> 
              <Icon size={18} color={active ? '#FFFFFF' : '#E5E7EB'} />
              <Text style={[styles.itemText, active && styles.itemTextActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        {email ? <Text style={styles.footerEmail}>{email}</Text> : null}
        <Pressable style={styles.signOutBtn} onPress={async () => {
          await supabase.auth.signOut();
          router.replace('/auth/login');
        }}>
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: { width: 260, backgroundColor: '#0F172A', paddingVertical: 20 },
  profile: { alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  avatarText: { color: 'white', fontWeight: '800', fontSize: 18 },
  name: { color: 'white', fontWeight: '700' },
  email: { color: '#94A3B8', marginTop: 2, fontSize: 12 },
  menu: { marginTop: 8 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  itemActive: { backgroundColor: '#1D4ED8', borderTopRightRadius: 999, borderBottomRightRadius: 999 },
  itemText: { color: '#E5E7EB', marginLeft: 10, fontWeight: '600' },
  itemTextActive: { color: '#FFFFFF' },
  footer: { marginTop: 'auto', paddingHorizontal: 16, paddingTop: 12 },
  footerEmail: { color: '#94A3B8', fontSize: 12, marginBottom: 8 },
  signOutBtn: { backgroundColor: '#334155', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  signOutText: { color: 'white', fontWeight: '700' },
});
