import { createContext, useContext, useState, useEffect } from "react";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { products } from "../data/products";

const STORAGE_KEY = "herbal-store-wishlist";
const WishlistContext = createContext(null);

function syncImages(items) {
  return items.map((item) => {
    const live = products.find((p) => p.id === item.id);
    return live ? { ...item, image: live.image } : item;
  });
}

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(
    () => syncImages(loadFromStorage(STORAGE_KEY, []))
  );

  useEffect(() => {
    saveToStorage(STORAGE_KEY, wishlistItems);
  }, [wishlistItems]);

  const isWishlisted = (id) => wishlistItems.some((i) => i.id === id);

  const addToWishlist = (product) => {
    if (!isWishlisted(product.id)) {
      setWishlistItems((prev) => [...prev, product]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleWishlist = (product) => {
    if (isWishlisted(product.id)) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isWishlisted,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist: () => setWishlistItems([]),
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
