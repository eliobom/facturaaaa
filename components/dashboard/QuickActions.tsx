import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus, Scan, FileText, Users, Package, ChartBar as BarChart3 } from 'lucide-react-native';

interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
}

export default function QuickActions() {
  const actions: QuickAction[] = [
    {
      id: 'nueva-venta',
      title: 'Nueva Venta',
      icon: <Plus size={24} color="#FFFFFF" />,
      color: '#2563EB',
      onPress: () => console.log('Nueva venta'),
    },
    {
      id: 'escanear',
      title: 'Escanear',
      icon: <Scan size={24} color="#FFFFFF" />,
      color: '#059669',
      onPress: () => console.log('Escanear'),
    },
    {
      id: 'factura',
      title: 'Facturar',
      icon: <FileText size={24} color="#FFFFFF" />,
      color: '#DC2626',
      onPress: () => console.log('Facturar'),
    },
    {
      id: 'cliente',
      title: 'Nuevo Cliente',
      icon: <Users size={24} color="#FFFFFF" />,
      color: '#7C3AED',
      onPress: () => console.log('Nuevo cliente'),
    },
    {
      id: 'producto',
      title: 'Producto',
      icon: <Package size={24} color="#FFFFFF" />,
      color: '#EA580C',
      onPress: () => console.log('Nuevo producto'),
    },
    {
      id: 'reportes',
      title: 'Reportes',
      icon: <BarChart3 size={24} color="#FFFFFF" />,
      color: '#0891B2',
      onPress: () => console.log('Reportes'),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acciones Rápidas</Text>
      <View style={styles.actionsGrid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionButton, { backgroundColor: action.color }]}
            onPress={action.onPress}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              {action.icon}
            </View>
            <Text style={styles.actionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});