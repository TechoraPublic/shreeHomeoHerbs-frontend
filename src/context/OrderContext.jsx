import { createContext, useContext, useState, useCallback } from "react";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { products } from "../data/products";

const ORDERS_KEY = "herbal-store-orders";
const OrderContext = createContext(null);

function syncOrderImages(orders) {
  return orders.map((order) => ({
    ...order,
    items: order.items.map((item) => {
      const live = products.find((p) => p.id === item.id);
      return live ? { ...item, image: live.image } : item;
    }),
  }));
}

const TRACKING_STEPS = ["Order Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

function generateOrderId() {
  return `HN${Date.now().toString().slice(-8).toUpperCase()}`;
}

// Demo: assign a deterministic tracking step based on order age
function getTrackingStep(placedAt) {
  const ageMinutes = (Date.now() - new Date(placedAt).getTime()) / 60000;
  if (ageMinutes < 1) return 0;
  if (ageMinutes < 2) return 1;
  if (ageMinutes < 5) return 2;
  if (ageMinutes < 10) return 3;
  if (ageMinutes < 20) return 4;
  return 5;
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => syncOrderImages(loadFromStorage(ORDERS_KEY, [])));

  const placeOrder = useCallback(({ items, address, paymentMethod, total, savings }) => {
    const order = {
      id: generateOrderId(),
      items,
      address,
      paymentMethod,
      total,
      savings,
      status: "Order Placed",
      placedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    };
    const updated = [order, ...orders];
    setOrders(updated);
    saveToStorage(ORDERS_KEY, updated);
    return order;
  }, [orders]);

  const getOrder = useCallback((id) => orders.find((o) => o.id === id), [orders]);

  const getUserOrders = useCallback((userId) =>
    orders.filter((o) => !userId || o.userId === userId),
    [orders]
  );

  return (
    <OrderContext.Provider value={{
      orders,
      placeOrder,
      getOrder,
      getUserOrders,
      TRACKING_STEPS,
      getTrackingStep,
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used inside OrderProvider");
  return ctx;
}
