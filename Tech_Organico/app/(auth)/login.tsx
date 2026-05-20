import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../../contexts/AuthContext';
import { Colors } from '../../constants/colors';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginScreen() {
  const { login } = useAuthContext();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email || !password) {
      setError('Completa todos los campos.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      router.replace(email.trim().toLowerCase() === 'admin@techorganico.mx' ? '/(vendor)/dashboard' : '/(client)/catalogo');
    } catch {
      setError('Ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.emoji}>☕</Text>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Correo electrónico"
            placeholder="tu@correo.mx"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Contraseña"
            placeholder="••••••••"
            isPassword
            value={password}
            onChangeText={setPassword}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button label="Iniciar sesión" onPress={handleLogin} loading={loading} style={styles.btn} />

          <View style={styles.hint}>
            <Text style={styles.hintText}>Administrador: </Text>
            <Text style={styles.hintEmail}>admin@techorganico.mx</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.link}>Regístrate</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.guestBtn} onPress={() => router.replace('/(client)/catalogo')}>
          <Text style={styles.guestText}>Continuar como invitado →</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.neutroClaro },
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  emoji: { fontSize: 56, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.verdeOscuro },
  subtitle: { fontSize: 15, color: Colors.textoSecundario, marginTop: 4 },
  form: { gap: 0 },
  btn: { marginTop: 8, width: '100%' },
  error: { color: '#DC2626', fontSize: 13, marginBottom: 8 },
  hint: { flexDirection: 'row', alignItems: 'center', marginTop: 12, justifyContent: 'center' },
  hintText: { fontSize: 12, color: Colors.textoSecundario },
  hintEmail: { fontSize: 12, color: Colors.verdePrincipal, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { fontSize: 14, color: Colors.textoSecundario },
  link: { fontSize: 14, color: Colors.verdePrincipal, fontWeight: '700' },
  guestBtn: { alignItems: 'center', marginTop: 16 },
  guestText: { fontSize: 14, color: Colors.tonoTierra, fontWeight: '600' },
});
