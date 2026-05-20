import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { Colors } from '../../constants/colors';

interface Props {
  visible: boolean;
}

export default function LoadingOverlay({ visible }: Props) {
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    if (visible) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.reset();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <LottieView
        ref={lottieRef}
        source={require('../../assets/animations/coffee-loading.json')}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.neutroClaro,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  animation: {
    width: 220,
    height: 220,
  },
});
