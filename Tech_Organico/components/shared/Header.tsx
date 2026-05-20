import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: { icon: string; onPress: () => void };
  logoSource?: ImageSourcePropType;
}

export default function Header({ title, showBack = false, rightAction, logoSource }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Text style={styles.icon}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtn} />
        )}
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {rightAction ? (
          <TouchableOpacity onPress={rightAction.onPress} style={styles.iconBtn}>
            <Text style={styles.icon}>{rightAction.icon}</Text>
          </TouchableOpacity>
        ) : logoSource ? (
          <Image source={logoSource} style={styles.logoImg} resizeMode="contain" />
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.verdeOscuro,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.blanco,
    flex: 1,
    textAlign: 'center',
  },
  iconBtn: { width: 40, alignItems: 'center' },
  icon: { fontSize: 22, color: Colors.blanco },
  logoImg: { width: 40, height: 40, borderRadius: 6 },
});
