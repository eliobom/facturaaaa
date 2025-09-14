import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  growth?: number;
  icon?: React.ReactNode;
  color?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  growth, 
  icon, 
  color = '#2563EB' 
}: MetricCardProps) {
  const isPositiveGrowth = growth && growth > 0;
  const isNegativeGrowth = growth && growth < 0;

  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
        </View>
      </View>
      
      <Text style={styles.value}>{value}</Text>
      
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
      
      {growth !== undefined && (
        <View style={styles.growthContainer}>
          {isPositiveGrowth && (
            <TrendingUp size={16} color="#059669" />
          )}
          {isNegativeGrowth && (
            <TrendingDown size={16} color="#DC2626" />
          )}
          <Text style={[
            styles.growthText,
            { color: isPositiveGrowth ? '#059669' : isNegativeGrowth ? '#DC2626' : '#6B7280' }
          ]}>
            {growth > 0 ? '+' : ''}{growth}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
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
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    flex: 1,
  },
  iconContainer: {
    marginLeft: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});