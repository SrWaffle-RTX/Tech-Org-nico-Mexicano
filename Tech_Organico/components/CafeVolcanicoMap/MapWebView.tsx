import React, { useRef, useEffect, useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import type { Region } from './data';

interface Props {
  regions: Region[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function buildHtml(regions: Region[]): string {
  const mapData = JSON.stringify(
    regions.map(r => ({ id: r.id, name: r.name, color: r.color, bounds: r.bounds }))
  );

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { height: 100%; width: 100%; }
    .region-lbl {
      background: rgba(255,255,255,0.92);
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
      box-shadow: 0 1px 3px rgba(0,0,0,0.28);
      font-family: -apple-system, Arial, sans-serif;
      pointer-events: none;
    }
    .leaflet-control-attribution { font-size: 8px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var REGIONS = ${mapData};
    var selectedId = null;
    var layers = {};

    var map = L.map('map', {
      scrollWheelZoom: false,
      zoomControl: true,
      tap: false,
    }).setView([20.0, -95.0], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);

    function updateStyles() {
      Object.keys(layers).forEach(function(id) {
        var sel = id === selectedId;
        layers[id].setStyle({ fillOpacity: sel ? 0.62 : 0.28, weight: sel ? 3 : 2 });
      });
    }

    function selectRegion(id) {
      selectedId = id;
      updateStyles();
    }

    REGIONS.forEach(function(region) {
      var rect = L.rectangle(region.bounds, {
        color: region.color,
        fillColor: region.color,
        fillOpacity: 0.28,
        weight: 2,
      }).addTo(map);

      rect.on('click', function() {
        selectRegion(region.id);
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(region.id);
        }
      });

      var center = rect.getBounds().getCenter();
      L.marker(center, {
        icon: L.divIcon({
          className: '',
          html: '<div class="region-lbl">' + region.name + '</div>',
          iconSize: [90, 22],
          iconAnchor: [45, 11],
        }),
        interactive: false,
      }).addTo(map);

      layers[region.id] = rect;
    });

    // Mensajes desde React Native (clic en tarjeta)
    document.addEventListener('message', function(e) { selectRegion(e.data); });
    window.addEventListener('message', function(e) { selectRegion(e.data); });
  </script>
</body>
</html>`;
}

export default function MapWebView({ regions, selectedId, onSelect }: Props) {
  const webViewRef = useRef<WebView>(null);
  const [ready, setReady] = useState(false);
  const html = useMemo(() => buildHtml(regions), [regions]);

  useEffect(() => {
    if (!ready) return;
    // Sincroniza el polígono resaltado cuando cambia la selección desde las tarjetas
    const script = `selectRegion(${JSON.stringify(selectedId)}); true;`;
    webViewRef.current?.injectJavaScript(script);
  }, [selectedId, ready]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <WebView
        ref={webViewRef}
        source={{ html, baseUrl: 'https://unpkg.com' }}
        style={StyleSheet.absoluteFill}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        onLoadEnd={() => setReady(true)}
        onMessage={(e) => onSelect(e.nativeEvent.data)}
      />
    </View>
  );
}
