import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, G, Text as SvgText, TSpan } from 'react-native-svg';
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
      {/* +48 extra height for two-line labels */}
      <Svg width={CHART_W} height={CHART_H + 48}>
        <G>
          {data.map((item, i) => {
            const barH = (item.total / maxVal) * availableH;
            const x =
              PAD +
              i * ((CHART_W - PAD * 2) / data.length) +
              (CHART_W - PAD * 2) / data.length / 2 -
              BAR_W / 2;
            const y = PAD + availableH - barH;

            // Split "1-7 may" → ["1-7", "may"]
            const spaceIdx = item.semana.lastIndexOf(' ');
            const rangePart =
              spaceIdx >= 0 ? item.semana.slice(0, spaceIdx) : item.semana;
            const monthPart =
              spaceIdx >= 0 ? item.semana.slice(spaceIdx + 1) : '';

            const labelX = x + BAR_W / 2;

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
                {/* Valor encima de la barra */}
                <SvgText
                  x={labelX}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize={10}
                  fill={Colors.verdePrincipal}
                  fontWeight="bold"
                >{`$${(item.total / 1000).toFixed(1)}k`}</SvgText>

                {/* Etiqueta en dos líneas: rango y mes */}
                <SvgText
                  x={labelX}
                  y={CHART_H + 18}
                  textAnchor="middle"
                  fontSize={9}
                  fill={Colors.textoSecundario}
                >
                  <TSpan x={labelX} dy="0">{rangePart}</TSpan>
                  {monthPart ? (
                    <TSpan x={labelX} dy="12">{monthPart}</TSpan>
                  ) : null}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.blanco,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textoPrincipal,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
});
