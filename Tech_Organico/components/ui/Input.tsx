import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '../../constants/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export default function Input({ label, error, isPassword = false, style, ...props }: InputProps) {
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.row, error ? styles.errorBorder : styles.normalBorder]}>
        <TextInput
          style={[styles.input, style]}
          secureTextEntry={isPassword && !showPass}
          placeholderTextColor={Colors.textoSecundario}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}>
            <Text style={styles.eyeText}>{showPass ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textoPrincipal, marginBottom: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: Colors.blanco,
    paddingHorizontal: 14,
  },
  normalBorder: { borderColor: '#D1D5DB' },
  errorBorder: { borderColor: '#DC2626' },
  input: { flex: 1, fontSize: 15, color: Colors.textoPrincipal, paddingVertical: 14 },
  eyeBtn: { padding: 4 },
  eyeText: { fontSize: 16 },
  error: { fontSize: 12, color: '#DC2626', marginTop: 4 },
});
