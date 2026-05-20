import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Order } from '../types/order';

const STORAGE_KEY = '@lm_orders';

interface OrdersContextValue {
  orders: Order[];
  addOrder: (order: Order) => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) setOrders(JSON.parse(raw));
    });
  }, []);

  async function addOrder(order: Order) {
    const updated = [order, ...orders];
    setOrders(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function getOrderById(id: string) {
    return orders.find(o => o.id === id);
  }

  return (
    <OrdersContext.Provider value={{ orders, addOrder, getOrderById }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrdersContext() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrdersContext must be inside OrdersProvider');
  return ctx;
}
