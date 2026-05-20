import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, G, Text as SvgText } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import type { VentaSemanal } from '../../types/vendor';

interface SalesChartProps {
  data: VentaSemanal[];
}

const CHART_W = 300;
const CHART_H = 150;
const BAR_W = 36;
const PAD = 28;

export default function SalesChart({ data }: SalesChartProps) {
  const maxVal = Math.max(...data.map(d => d.total));
  const availableH = CHART_H - PAD * 2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ventas semanales</Text>
      <Svg width={CHART_W} height={CHART_H + 30}>
        <G>
          {data.map((item, i) => {
            const barH = (item.total / maxVal) * availableH;
            const x = PAD + i * ((CHART_W - PAD * 2) / data.length) + (CHART_W - PAD * 2) / data.length / 2 - BAR_W / 2;
            const y = PAD + availableH - barH;
            return (
              <G key={item.semana}>
                <Rect
                  x={x}
                  y={y}
                  width={BAR_W}
                  height={barH}
                  rx={6}
                  fill={Colors.verdePrincipal}
                  opacity={0.85}
                />
                <SvgText
                  x={x + BAR_W / 2}
                  y={CHART_H + 20}
                  textAnchor="middle"
                  fontSize={10}
                  fill={Colors.textoSecundario}
                >
                  {item.semana}
                </SvgText>
                <SvgText
                  x={x + BAR_W / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize={10}
                  fill={Colors.verdePrincipal}
                  fontWeight="bold"
                >{`$${(item.total / 1000).toFixed(1)}k`}</SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.blanco, borderRadius: 14, padding: 16, alignItems: 'center' },
  title: { fontSize: 14, fontWeight: '600', color: Colors.textoPrincipal, alignSelf: 'flex-start', marginBottom: 8 },
});
