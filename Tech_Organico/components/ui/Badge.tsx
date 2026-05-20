import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export default function Badge({ label, variant = 'primary' }: BadgeProps) {
  return (
    <View style={[styles.base, bgColors[variant]]}>
      <Text style={[styles.text, textColors[variant]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  text: { fontSize: 11, fontWeight: '600' },
});

const bgColors: Record<BadgeVariant, object> = {
  primary: { backgroundColor: Colors.verdePrincipal + '20' },
  success: { backgroundColor: Colors.verdeSecundario + '20' },
  warning: { backgroundColor: Colors.amarilloCalido + '30' },
  info: { backgroundColor: '#3B82F620' },
  neutral: { backgroundColor: Colors.neutroClaro },
};

const textColors: Record<BadgeVariant, object> = {
  primary: { color: Colors.verdePrincipal },
  success: { color: Colors.verdeSecundario },
  warning: { color: '#B45309' },
  info: { color: '#1D4ED8' },
  neutral: { color: Colors.textoSecundario },
};
