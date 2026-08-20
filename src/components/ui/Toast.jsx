import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, X, AlertCircle, Heart, ShoppingCart } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  wishlist: Heart,
  cart: ShoppingCart,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-6 right-4 z-[100] flex flex-col gap-2 max-w-xs w-[calc(100%-2rem)] sm:w-full pointer-events-none">
        {toasts.map(({ id, message, type }) => {
          const Icon = ICONS[type] || CheckCircle;
          return (
            <div
              key={id}
              className="pointer-events-auto flex items-center gap-3 bg-white border border-brand-100 shadow-xl rounded-2xl px-4 py-3 animate-[slideUp_0.3s_ease-out]"
            >
              <Icon
                size={18}
                className={
                  type === "error"
                    ? "text-red-500"
                    : type === "wishlist"
                    ? "text-rose-500"
                    : "text-brand-600"
                }
              />
              <span className="text-sm font-medium text-gray-700 flex-1">{message}</span>
              <button
                onClick={() => dismiss(id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
