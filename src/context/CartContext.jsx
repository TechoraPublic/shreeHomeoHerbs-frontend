import { createContext, useContext, useReducer, useEffect } from "react";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { products } from "../data/products";

const STORAGE_KEY = "herbal-store-cart";
const CartContext = createContext(null);

function syncImages(items) {
  return items.map((item) => {
    const live = products.find((p) => p.id === item.id);
    return live ? { ...item, image: live.image } : item;
  });
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const exists = state.find((i) => i.id === action.product.id);
      if (exists) {
        return state.map((i) =>
          i.id === action.product.id
            ? { ...i, quantity: Math.min(i.quantity + (action.qty || 1), i.stock) }
            : i
        );
      }
      return [...state, { ...action.product, quantity: action.qty || 1 }];
    }
    case "REMOVE":
      return state.filter((i) => i.id !== action.id);
    case "INCREASE":
      return state.map((i) =>
        i.id === action.id ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) } : i
      );
    case "DECREASE":
      return state.map((i) =>
        i.id === action.id ? { ...i, quantity: Math.max(i.quantity - 1, 1) } : i
      );
    case "UPDATE_QTY":
      return state.map((i) =>
        i.id === action.id
          ? { ...i, quantity: Math.min(Math.max(action.qty, 1), i.stock) }
          : i
      );
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cartItems, dispatch] = useReducer(
    cartReducer,
    [],
    () => syncImages(loadFromStorage(STORAGE_KEY, []))
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEY, cartItems);
  }, [cartItems]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartSavings = cartItems.reduce(
    (sum, i) => sum + ((i.originalPrice || i.price) - i.price) * i.quantity,
    0
  );

  const isInCart = (id) => cartItems.some((i) => i.id === id);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        cartSavings,
        isInCart,
        addToCart: (product, qty = 1) => dispatch({ type: "ADD", product, qty }),
        removeFromCart: (id) => dispatch({ type: "REMOVE", id }),
        increaseQuantity: (id) => dispatch({ type: "INCREASE", id }),
        decreaseQuantity: (id) => dispatch({ type: "DECREASE", id }),
        updateQuantity: (id, qty) => dispatch({ type: "UPDATE_QTY", id, qty }),
        clearCart: () => dispatch({ type: "CLEAR" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
