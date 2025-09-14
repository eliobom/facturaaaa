import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Plus, Scan, Search, Clock } from 'lucide-react-native';

export default function VenderScreen() {
  const opcionesVenta = [
    {
      id: 'nueva-venta',
      titulo: 'Nueva Venta',
      descripcion: 'Crear una venta desde cero',
      icono: <Plus size={32} color="#2563EB" />,
      color: '#EBF4FF',
    },
    {
      id: 'escanear-producto',
      titulo: 'Escanear Producto',
      descripcion: 'Usar cámara para agregar productos',
      icono: <Scan size={32} color="#059669" />,
      color: '#ECFDF5',
    },
    {
      id: 'buscar-producto',
      titulo: 'Buscar Producto',
      descripcion: 'Buscar en el catálogo',
      icono: <Search size={32} color="#7C3AED" />,
      color: '#F3E8FF',
    },
    {
      id: 'venta-rapida',
      titulo: 'Venta Rápida',
      descripcion: 'Productos más vendidos',
      icono: <Clock size={32} color="#EA580C" />,
      color: '#FFF7ED',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Realizar Venta</Text>
        <Text style={styles.subtitle}>
          Selecciona cómo quieres comenzar tu venta
        </Text>
      </View>

      <View style={styles.content}>
        {opcionesVenta.map((opcion) => (
          <TouchableOpacity
            key={opcion.id}
            style={styles.opcionCard}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: opcion.color }]}>
              {opcion.icono}
            </View>
            <View style={styles.opcionTexto}>
              <Text style={styles.opcionTitulo}>{opcion.titulo}</Text>
              <Text style={styles.opcionDescripcion}>{opcion.descripcion}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Tip: Usa el escáner para agregar productos más rápido
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  opcionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  opcionTexto: {
    flex: 1,
  },
  opcionTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  opcionDescripcion: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FEF3C7',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
  },
});