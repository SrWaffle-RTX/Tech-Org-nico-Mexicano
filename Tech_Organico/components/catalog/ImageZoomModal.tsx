import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet,
  Dimensions, type ImageSourcePropType,
} from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, runOnUI,
} from 'react-native-reanimated';

const { width: W, height: H } = Dimensions.get('window');

interface Props {
  images: ImageSourcePropType[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
}

export default function ImageZoomModal({ images, initialIndex, visible, onClose }: Props) {
  const [idx, setIdx] = useState(initialIndex);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const savedTx = useSharedValue(0);
  const savedTy = useSharedValue(0);

  const resetZoom = () => {
    'worklet';
    scale.value = withSpring(1);
    savedScale.value = 1;
    tx.value = withSpring(0);
    ty.value = withSpring(0);
    savedTx.value = 0;
    savedTy.value = 0;
  };

  useEffect(() => {
    if (visible) {
      setIdx(initialIndex);
      runOnUI(resetZoom)();
    }
  }, [visible, initialIndex]);

  function navigate(dir: 1 | -1) {
    const next = idx + dir;
    if (next < 0 || next >= images.length) return;
    runOnUI(resetZoom)();
    setIdx(next);
  }

  const pinch = Gesture.Pinch()
    .onUpdate(e => { scale.value = Math.max(1, savedScale.value * e.scale); })
    .onEnd(() => {
      if (scale.value <= 1) {
        resetZoom();
      } else {
        savedScale.value = scale.value;
      }
    });

  const pan = Gesture.Pan()
    .minDistance(5)
    .onUpdate(e => {
      tx.value = savedTx.value + e.translationX;
      ty.value = savedTy.value + e.translationY;
    })
    .onEnd(() => {
      savedTx.value = tx.value;
      savedTy.value = ty.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => { resetZoom(); });

  const composed = Gesture.Exclusive(doubleTap, Gesture.Simultaneous(pinch, pan));

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: tx.value },
      { translateY: ty.value },
    ],
  }));

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={s.overlay}>
        <TouchableOpacity style={s.closeBtn} onPress={onClose}>
          <Text style={s.closeText}>✕</Text>
        </TouchableOpacity>

        <GestureDetector gesture={composed}>
          <Animated.Image
            source={images[idx]}
            style={[s.image, animStyle]}
            resizeMode="contain"
          />
        </GestureDetector>

        {images.length > 1 && (
          <View style={s.nav}>
            <TouchableOpacity onPress={() => navigate(-1)} disabled={idx === 0} style={s.navBtn}>
              <Text style={[s.navArrow, idx === 0 && s.disabled]}>‹</Text>
            </TouchableOpacity>
            <View style={s.dots}>
              {images.map((_, i) => (
                <View key={i} style={[s.dot, i === idx && s.dotActive]} />
              ))}
            </View>
            <TouchableOpacity onPress={() => navigate(1)} disabled={idx === images.length - 1} style={s.navBtn}>
              <Text style={[s.navArrow, idx === images.length - 1 && s.disabled]}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={s.hint}>Pellizca para hacer zoom · Doble toque para resetear</Text>
      </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.96)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 52,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  image: { width: W, height: H * 0.72 },
  nav: {
    position: 'absolute',
    bottom: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  navBtn: { padding: 10 },
  navArrow: { color: '#fff', fontSize: 52, lineHeight: 56, fontWeight: '200' },
  disabled: { opacity: 0.2 },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotActive: { backgroundColor: '#fff', width: 20 },
  hint: {
    position: 'absolute',
    bottom: 36,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
  },
});
