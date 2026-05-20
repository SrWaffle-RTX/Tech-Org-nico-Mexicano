import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface CafeTagProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export default function CafeTag({ label, active = false, onPress }: CafeTagProps) {
  return (
    <TouchableOpacity
      style={[styles.tag, active && styles.tagActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: Colors.verdePrincipal,
    backgroundColor: Colors.blanco,
    marginRight: 8,
  },
  tagActive: { backgroundColor: Colors.verdePrincipal },
  text: { fontSize: 13, fontWeight: '600', color: Colors.verdePrincipal },
  textActive: { color: Colors.blanco },
});
