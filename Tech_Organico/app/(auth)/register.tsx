import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../../contexts/AuthContext';
import { ADMIN_EMAIL } from '../../constants/config';
import { Colors } from '../../constants/colors';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function RegisterScreen() {
  const { register } = useAuthContext();
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister() {
    if (!nombre || !email || !password) {
      setError('Completa todos los campos.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      await register(nombre.trim(), cleanEmail, password);
      router.replace(cleanEmail === ADMIN_EMAIL ? '/(vendor)/dashboard' : '/(client)/catalogo');
    } catch {
      setError('Ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Únete a Tech Orgánico</Text>
        </View>

        <Input label="Nombre completo" placeholder="Tu nombre" value={nombre} onChangeText={setNombre} />
        <Input
          label="Correo electrónico"
          placeholder="tu@correo.mx"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <Input label="Contraseña" placeholder="Mínimo 6 caracteres" isPassword value={password} onChangeText={setPassword} />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button label="Registrarme" onPress={handleRegister} loading={loading} style={styles.btn} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.link}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.neutroClaro },
  container: { flexGrow: 1, padding: 24 },
  back: { marginBottom: 24, marginTop: 16 },
  backText: { fontSize: 15, color: Colors.verdePrincipal, fontWeight: '600' },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.verdeOscuro },
  subtitle: { fontSize: 15, color: Colors.textoSecundario, marginTop: 4 },
  btn: { marginTop: 8, width: '100%' },
  error: { color: '#DC2626', fontSize: 13, marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { fontSize: 14, color: Colors.textoSecundario },
  link: { fontSize: 14, color: Colors.verdePrincipal, fontWeight: '700' },
});
