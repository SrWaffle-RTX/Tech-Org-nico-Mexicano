import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/colors';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], styles[size], (disabled || loading) && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? Colors.verdePrincipal : Colors.blanco} size="small" />
      ) : (
        <Text style={[styles.label, labelStyles[variant], labelSizes[size]]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: { backgroundColor: Colors.verdePrincipal },
  secondary: { backgroundColor: Colors.verdeSecundario },
  outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: Colors.verdePrincipal },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: '#DC2626' },
  sm: { paddingVertical: 8, paddingHorizontal: 16 },
  md: { paddingVertical: 14, paddingHorizontal: 24 },
  lg: { paddingVertical: 18, paddingHorizontal: 32 },
  disabled: { opacity: 0.5 },
  label: { fontWeight: '600' },
});

const labelStyles: Record<Variant, TextStyle> = {
  primary: { color: Colors.blanco },
  secondary: { color: Colors.blanco },
  outline: { color: Colors.verdePrincipal },
  ghost: { color: Colors.verdePrincipal },
  danger: { color: Colors.blanco },
};

const labelSizes: Record<Size, TextStyle> = {
  sm: { fontSize: 13 },
  md: { fontSize: 15 },
  lg: { fontSize: 17 },
};
