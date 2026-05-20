import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  color?: string;
}

export default function StatCard({ title, value, subtitle, icon, color = Colors.verdePrincipal }: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.blanco,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  iconBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  icon: { fontSize: 22 },
  value: { fontSize: 22, fontWeight: '700', color: Colors.textoPrincipal },
  title: { fontSize: 12, color: Colors.textoSecundario, marginTop: 4, textAlign: 'center' },
  subtitle: { fontSize: 11, color: Colors.verdeSecundario, marginTop: 2, fontWeight: '600' },
});
