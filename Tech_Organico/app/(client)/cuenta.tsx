import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../../contexts/AuthContext';
import { Colors } from '../../constants/colors';
import Header from '../../components/shared/Header';
import Button from '../../components/ui/Button';

export default function CuentaScreen() {
  const { user, role, logout } = useAuthContext();
  const router = useRouter();

  if (role === 'guest') {
    return (
      <View style={styles.container}>
        <Header title="Mi cuenta" />
        <View style={styles.guestBox}>
          <Text style={styles.guestEmoji}>👤</Text>
          <Text style={styles.guestTitle}>Inicia sesión para ver tu cuenta</Text>
          <Button label="Iniciar sesión" onPress={() => router.push('/(auth)/login')} style={styles.btn} />
          <Button label="Registrarme" onPress={() => router.push('/(auth)/register')} variant="outline" style={styles.btn} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Mi cuenta" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarBox}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.nombre[0]?.toUpperCase() ?? '?'}</Text>
          </View>
          <Text style={styles.nombre}>{user?.nombre}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.card}>
          <MenuItem label="📦 Mis pedidos" onPress={() => router.push('/(client)/pedidos')} />
          <MenuItem label="🛒 Mi carrito" onPress={() => router.push('/(client)/carrito')} />
        </View>

        <Button
          label="Cerrar sesión"
          onPress={async () => { await logout(); router.replace('/'); }}
          variant="danger"
          style={styles.logoutBtn}
        />
      </ScrollView>
    </View>
  );
}

function MenuItem({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuArrow}>→</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutroClaro },
  scroll: { padding: 20, paddingBottom: 40 },
  guestBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  guestEmoji: { fontSize: 72, marginBottom: 16 },
  guestTitle: { fontSize: 20, fontWeight: '700', color: Colors.textoPrincipal, marginBottom: 24, textAlign: 'center' },
  btn: { width: '100%', marginBottom: 12 },
  avatarBox: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.verdePrincipal, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 36, fontWeight: '700', color: Colors.blanco },
  nombre: { fontSize: 22, fontWeight: '700', color: Colors.textoPrincipal },
  email: { fontSize: 14, color: Colors.textoSecundario, marginTop: 4 },
  card: { backgroundColor: Colors.blanco, borderRadius: 14, marginBottom: 24, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  menuLabel: { fontSize: 15, color: Colors.textoPrincipal, fontWeight: '500' },
  menuArrow: { fontSize: 16, color: Colors.textoSecundario },
  logoutBtn: { width: '100%' },
});
