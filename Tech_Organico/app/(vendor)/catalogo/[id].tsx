import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Switch, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { mockCafes } from '../../../data/mockCafes';
import { Colors } from '../../../constants/colors';
import Header from '../../../components/shared/Header';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import type { Cafe } from '../../../types/cafe';

export default function EditarProductoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const isNuevo = id === 'nuevo';
  const original: Cafe | undefined = isNuevo ? undefined : mockCafes.find(c => c.id === id);

  const [nombre, setNombre] = useState(original?.nombre ?? '');
  const [precio, setPrecio] = useState(String(original?.precio ?? ''));
  const [descripcion, setDescripcion] = useState(original?.descripcion ?? '');
  const [stock, setStock] = useState(String(original?.stock ?? ''));
  const [tiene360, setTiene360] = useState(original?.tiene360 ?? false);
  const [activo, setActivo] = useState(original?.activo ?? true);
  const [saving, setSaving] = useState(false);

  function handleGuardar() {
    if (!nombre || !precio) {
      Alert.alert('Datos incompletos', 'Nombre y precio son obligatorios.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert('Guardado', isNuevo ? 'Producto creado correctamente.' : 'Producto actualizado correctamente.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 1000);
  }

  return (
    <View style={styles.container}>
      <Header title={isNuevo ? 'Nuevo producto' : 'Editar producto'} showBack />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {!isNuevo && original && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID: {original.id}</Text>
            <Text style={styles.infoLabel}>Origen: {original.origen}</Text>
          </View>
        )}

        <Input label="Nombre del producto" placeholder="Ej. Chiapas Altura Lavado" value={nombre} onChangeText={setNombre} />
        <Input label="Precio (MXN / 250g)" placeholder="220" keyboardType="numeric" value={precio} onChangeText={setPrecio} />
        <Input label="Stock disponible (kg)" placeholder="50" keyboardType="numeric" value={stock} onChangeText={setStock} />

        <Text style={styles.fieldLabel}>Descripción</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Descripción del café..."
          multiline
          numberOfLines={4}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholderTextColor={Colors.textoSecundario}
        />

        <View style={styles.switchRow}>
          <View>
            <Text style={styles.fieldLabel}>Vista 360°</Text>
            <Text style={styles.switchDesc}>Activar experiencia 360° para este café</Text>
          </View>
          <Switch
            value={tiene360}
            onValueChange={setTiene360}
            trackColor={{ true: Colors.verdePrincipal, false: '#D1D5DB' }}
            thumbColor={Colors.blanco}
          />
        </View>

        <View style={styles.switchRow}>
          <View>
            <Text style={styles.fieldLabel}>Activo en catálogo</Text>
            <Text style={styles.switchDesc}>Visible para los clientes</Text>
          </View>
          <Switch
            value={activo}
            onValueChange={setActivo}
            trackColor={{ true: Colors.verdePrincipal, false: '#D1D5DB' }}
            thumbColor={Colors.blanco}
          />
        </View>

        <Button label={isNuevo ? 'Crear producto ✓' : 'Guardar cambios ✓'} onPress={handleGuardar} loading={saving} style={styles.btn} />
        {!isNuevo && (
          <Button
            label="Eliminar producto"
            onPress={() => Alert.alert('Eliminar', '¿Seguro que deseas eliminar este producto?', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Eliminar', style: 'destructive', onPress: () => router.back() }])}
            variant="danger"
            style={styles.btn}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutroClaro },
  scroll: { padding: 20, paddingBottom: 40 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  infoLabel: { fontSize: 12, color: Colors.textoSecundario },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.textoPrincipal, marginBottom: 6 },
  textarea: { backgroundColor: Colors.blanco, borderRadius: 10, borderWidth: 1.5, borderColor: '#D1D5DB', padding: 14, fontSize: 14, color: Colors.textoPrincipal, marginBottom: 20, textAlignVertical: 'top', minHeight: 100 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.blanco, borderRadius: 12, padding: 16, marginBottom: 12 },
  switchDesc: { fontSize: 12, color: Colors.textoSecundario, marginTop: 2 },
  btn: { width: '100%', marginBottom: 12 },
});
