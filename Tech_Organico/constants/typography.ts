import { Colors } from './colors';

export const Typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: Colors.textoPrincipal },
  h2: { fontSize: 22, fontWeight: '700' as const, color: Colors.textoPrincipal },
  h3: { fontSize: 18, fontWeight: '600' as const, color: Colors.textoPrincipal },
  body: { fontSize: 15, fontWeight: '400' as const, color: Colors.textoPrincipal },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, color: Colors.textoSecundario },
  label: { fontSize: 12, fontWeight: '600' as const, color: Colors.textoSecundario },
  caption: { fontSize: 11, fontWeight: '400' as const, color: Colors.textoSecundario },
  price: { fontSize: 20, fontWeight: '700' as const, color: Colors.verdePrincipal },
};
