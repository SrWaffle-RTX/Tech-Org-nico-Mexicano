import React, { createContext, useContext, useState } from 'react';
import type { CartItem } from '../types/order';
import type { Cafe } from '../types/cafe';

interface CartContextValue {
  items: CartItem[];
  total: number;
  count: number;
  addItem: (cafe: Cafe, cantidad?: number) => void;
  removeItem: (cafeId: string) => void;
  updateCantidad: (cafeId: string, cantidad: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(cafe: Cafe, cantidad = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.cafe.id === cafe.id);
      if (existing) {
        return prev.map(i =>
          i.cafe.id === cafe.id ? { ...i, cantidad: i.cantidad + cantidad } : i,
        );
      }
      return [...prev, { cafe, cantidad }];
    });
  }

  function removeItem(cafeId: string) {
    setItems(prev => prev.filter(i => i.cafe.id !== cafeId));
  }

  function updateCantidad(cafeId: string, cantidad: number) {
    if (cantidad <= 0) {
      removeItem(cafeId);
      return;
    }
    setItems(prev =>
      prev.map(i => (i.cafe.id === cafeId ? { ...i, cantidad } : i)),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.cafe.precio * i.cantidad, 0);
  const count = items.reduce((sum, i) => sum + i.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, total, count, addItem, removeItem, updateCantidad, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext debe usarse dentro de CartProvider');
  return ctx;
}
