import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthContext } from './AuthContext';
import type { Order, OrderStatus } from '../types/order';

interface OrdersContextValue {
  orders: Order[];
  addOrder: (order: Order) => Promise<void>;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user, role } = useAuthContext();

  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    const ordersRef = collection(db, 'orders');
    const q =
      role === 'vendor'
        ? ordersRef
        : query(ordersRef, where('clienteId', '==', user.id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Order[] = snapshot.docs.map((d) => ({
        ...(d.data() as Order),
        id: d.id,
      }));
      fetched.sort(
        (a, b) =>
          new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
      );
      setOrders(fetched);
    });

    return unsubscribe;
  }, [user?.id, role]);

  async function addOrder(order: Order) {
    const { id, ...data } = order;
    await setDoc(doc(db, 'orders', id), { ...data, id });
  }

  async function updateOrderStatus(orderId: string, status: OrderStatus) {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      fechaActualizacion: new Date().toISOString(),
    });
  }

  function getOrderById(id: string) {
    return orders.find((o) => o.id === id);
  }

  return (
    <OrdersContext.Provider value={{ orders, addOrder, getOrderById, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrdersContext() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrdersContext must be inside OrdersProvider');
  return ctx;
}
