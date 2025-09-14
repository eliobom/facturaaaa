import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronRight, Clock, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import { VentaReciente } from '@/types/dashboard';

interface VentasRecientesProps {
  ventas: VentaReciente[];
}

export default function VentasRecientes({ ventas }: VentasRecientesProps) {
  const getStatusIcon = (estado: VentaReciente['estado']) => {
    switch (estado) {
      case 'completada':
        return <CheckCircle size={16} color="#059669" />;
      case 'pendiente':
        return <Clock size={16} color="#D97706" />;
      case 'cancelada':
        return <XCircle size={16} color="#DC2626" />;
      default:
        return null;
    }
  };

  const getStatusColor = (estado: VentaReciente['estado']) => {
    switch (estado) {
      case 'completada':
        return '#059669';
      case 'pendiente':
        return '#D97706';
      case 'cancelada':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  const renderVenta = ({ item }: { item: VentaReciente }) => (
    <TouchableOpacity style={styles.ventaItem} activeOpacity={0.7}>
      <View style={styles.ventaHeader}>
        <View style={styles.clienteContainer}>
          <Text style={styles.clienteNombre}>{item.cliente}</Text>
          <View style={styles.statusContainer}>
            {getStatusIcon(item.estado)}
            <Text style={[styles.statusText, { color: getStatusColor(item.estado) }]}>
              {item.estado}
            </Text>
          </View>
        </View>
        <ChevronRight size={16} color="#9CA3AF" />
      </View>
      
      <Text style={styles.productos}>
        {item.productos.slice(0, 2).join(', ')}
        {item.productos.length > 2 && ` +${item.productos.length - 2} más`}
      </Text>
      
      <View style={styles.ventaFooter}>
        <Text style={styles.fecha}>
          {format(item.fecha, 'dd MMM, HH:mm', { locale: es })}
        </Text>
        <Text style={styles.total}>
          ${item.total.toLocaleString('es-CO')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ventas Recientes</Text>
        <TouchableOpacity>
          <Text style={styles.verTodas}>Ver todas</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={ventas.slice(0, 5)}
        renderItem={renderVenta}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  verTodas: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
  },
  ventaItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  ventaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  clienteContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clienteNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  productos: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  ventaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fecha: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  total: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
});