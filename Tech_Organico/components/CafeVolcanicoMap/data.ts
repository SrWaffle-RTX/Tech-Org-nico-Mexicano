export interface Region {
  id: string
  name: string
  color: string
  /** [SW, NE] en formato [lat, lng] para Leaflet rectangle */
  bounds: [[number, number], [number, number]]
  produccion: {
    toneladas: number
    porcentaje: number
    hectareas: number
    rendimiento: string
  }
  perfil: {
    acidez: number
    cuerpo: number
    dulzor: number
    aroma: number
    notas: string[]
    metodos: string[]
  }
  suelo: {
    tipo: string
    ph: string
    altitud: string
    descripcion: string
  }
}

export const REGIONS: Region[] = [
  {
    id: 'chiapas',
    name: 'Chiapas',
    color: '#2E7D32',
    bounds: [[14.5, -93.0], [17.8, -90.4]],
    produccion: {
      toneladas: 392942,
      porcentaje: 37.2,
      hectareas: 240605,
      rendimiento: '1.6 t/ha',
    },
    perfil: {
      acidez: 85,
      cuerpo: 80,
      dulzor: 70,
      aroma: 90,
      notas: ['Cítrico', 'Frutos rojos', 'Chocolate'],
      metodos: ['Espresso', 'Chemex'],
    },
    suelo: {
      tipo: 'Andosol húmico',
      ph: '5.5–6.2',
      altitud: '900–1,800 msnm',
      descripcion: 'Suelos derivados del volcán Tacaná y la Sierra Madre de Chiapas. Alta retención de humedad y materia orgánica.',
    },
  },
  {
    id: 'veracruz',
    name: 'Veracruz',
    color: '#1565C0',
    bounds: [[17.2, -98.6], [22.5, -93.6]],
    produccion: {
      toneladas: 256460,
      porcentaje: 24.3,
      hectareas: 148000,
      rendimiento: '1.7 t/ha',
    },
    perfil: {
      acidez: 65,
      cuerpo: 75,
      dulzor: 82,
      aroma: 78,
      notas: ['Nuez', 'Especias', 'Caramelo'],
      metodos: ['Espresso', 'Prensa francesa'],
    },
    suelo: {
      tipo: 'Andosol vítrico',
      ph: '5.8–6.5',
      altitud: '800–1,400 msnm',
      descripcion: 'Influenciado por el Pico de Orizaba (Citlaltépetl). Alta porosidad y buen drenaje natural.',
    },
  },
  {
    id: 'puebla',
    name: 'Puebla',
    color: '#E65100',
    bounds: [[17.8, -99.1], [20.9, -96.7]],
    produccion: {
      toneladas: 225663,
      porcentaje: 21.4,
      hectareas: 66000,
      rendimiento: '3.4 t/ha',
    },
    perfil: {
      acidez: 72,
      cuerpo: 78,
      dulzor: 75,
      aroma: 72,
      notas: ['Equilibrado', 'Vainilla', 'Frutos secos'],
      metodos: ['Drip', 'Pour over'],
    },
    suelo: {
      tipo: 'Andosol y regosol',
      ph: '5.8–6.5',
      altitud: '1,000–1,800 msnm',
      descripcion: 'Faldas del Popocatépetl e Iztaccíhuatl. Mayor rendimiento nacional por riqueza mineral volcánica.',
    },
  },
  {
    id: 'oaxaca',
    name: 'Oaxaca',
    color: '#6A1B9A',
    bounds: [[15.7, -98.5], [18.7, -93.9]],
    produccion: {
      toneladas: 90257,
      porcentaje: 8.5,
      hectareas: 91000,
      rendimiento: '1.0 t/ha',
    },
    perfil: {
      acidez: 88,
      cuerpo: 62,
      dulzor: 68,
      aroma: 85,
      notas: ['Floral', 'Manzana', 'Acidez brillante'],
      metodos: ['V60', 'Aeropress'],
    },
    suelo: {
      tipo: 'Metamórfico con influencia volcánica',
      ph: '5.5–6.0',
      altitud: '1,200–2,000 msnm',
      descripcion: 'Sierra Juárez y Mixteca. Minerales volcánicos que aportan acidez y aromas florales únicos.',
    },
  },
  {
    id: 'guerrero',
    name: 'Guerrero',
    color: '#00695C',
    bounds: [[16.3, -102.2], [18.9, -98.0]],
    produccion: {
      toneladas: 34991,
      porcentaje: 3.3,
      hectareas: 22000,
      rendimiento: '1.6 t/ha',
    },
    perfil: {
      acidez: 70,
      cuerpo: 72,
      dulzor: 74,
      aroma: 76,
      notas: ['Frutado', 'Cacao', 'Suave'],
      metodos: ['Pour over', 'Prensa francesa'],
    },
    suelo: {
      tipo: 'Volcánico y sedimentario',
      ph: '5.6–6.3',
      altitud: '800–1,500 msnm',
      descripcion: 'Sierra Madre del Sur con aportes volcánicos. Perfil equilibrado con notas a fruta y cacao.',
    },
  },
]

export const SUELO_BLOQUES = [
  {
    icon: '💧',
    title: 'Retención hídrica excepcional',
    desc: 'El andosol retiene hasta 3 veces más agua que suelos sedimentarios, garantizando humedad estable durante épocas de sequía.',
  },
  {
    icon: '⚗️',
    title: 'Mineralidad única en taza',
    desc: 'Silicio, calcio, magnesio y potasio de origen ígneo aportan complejidad sensorial que no se replica en otros suelos.',
  },
  {
    icon: '🧪',
    title: 'pH ligeramente ácido (5.5–6.5)',
    desc: 'Rango ideal para la absorción de nutrientes del cafeto, favoreciendo granos densos con alta concentración de azúcares.',
  },
  {
    icon: '🪨',
    title: 'Estructura porosa de origen ígneo',
    desc: 'La porosidad volcánica permite raíces profundas y drenaje eficiente, evitando encharcamiento y enfermedades radiculares.',
  },
] as const
