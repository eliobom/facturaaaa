import React from 'react';
import { Slot } from 'expo-router';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.content}>
          <Slot />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#E5E7EB' },
  container: { flex: 1, flexDirection: 'row' },
  content: { flex: 1, backgroundColor: '#F8FAFC' },
});
