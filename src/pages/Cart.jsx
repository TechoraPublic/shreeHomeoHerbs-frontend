import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/ui/Toast";
import { formatPrice } from "../utils/currency";
import ProductImage from "../components/ui/ProductImage";

export default function Cart() {
  const { cartItems, cartTotal, cartSavings, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useCart();
  const { showToast } = useToast();

  function handleRemove(item) {
    removeFromCart(item.id);
    showToast(`${item.name} removed from cart`);
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#faf8f5] pt-24 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-brand-400" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Looks like you haven't added anything yet. Explore our herbal collection!
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors group"
          >
            Continue Shopping
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] pt-20">
      {/* Header */}
      <div className="bg-white border-b border-brand-100 py-8">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
            Shopping Cart
            <span className="ml-3 text-base font-normal text-gray-400">({cartItems.length} {cartItems.length === 1 ? "item" : "items"})</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-brand-50 flex gap-4">
                {/* Image */}
                <Link to={`/product/${item.slug}`} className="shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-brand-50">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-brand-600 uppercase tracking-widest">{item.category}</span>
                      <Link to={`/product/${item.slug}`}>
                        <h3 className="font-heading text-base font-semibold text-gray-800 hover:text-brand-700 transition-colors leading-snug">
                          {item.name}
                        </h3>
                      </Link>
                      {item.size && (
                        <span className="text-xs text-gray-400">{item.size}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemove(item)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center border border-brand-200 rounded-full overflow-hidden">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-brand-50 disabled:opacity-40 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        disabled={item.quantity >= item.stock}
                        aria-label="Increase quantity"
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-brand-50 disabled:opacity-40 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <div className="font-heading font-bold text-brand-700">{formatPrice(item.price * item.quantity)}</div>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <div className="text-xs text-gray-400 line-through">{formatPrice(item.originalPrice * item.quantity)}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear cart */}
            <div className="flex justify-end">
              <button
                onClick={() => { clearCart(); showToast("Cart cleared"); }}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <Trash2 size={12} />
                Clear cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-brand-50 p-6 sticky top-24">
              <h2 className="font-heading text-lg font-bold text-gray-800 mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-medium text-gray-800">
                    {formatPrice(cartItems.reduce((s, i) => s + (i.originalPrice || i.price) * i.quantity, 0))}
                  </span>
                </div>
                {cartSavings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600 flex items-center gap-1">
                      <Tag size={12} />
                      Discount
                    </span>
                    <span className="text-emerald-600 font-semibold">−{formatPrice(cartSavings)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
              </div>

              <div className="border-t border-brand-100 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-heading font-bold text-gray-800">Total</span>
                  <span className="font-heading text-xl font-bold text-brand-700">{formatPrice(cartTotal)}</span>
                </div>
                {cartSavings > 0 && (
                  <p className="text-xs text-emerald-600 mt-1 text-right">
                    You save {formatPrice(cartSavings)}!
                  </p>
                )}
              </div>

              <Link
                to="/checkout"
                className="block w-full text-center bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 rounded-full transition-colors mb-4"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/shop"
                className="block w-full text-center border-2 border-brand-200 text-brand-700 hover:border-brand-600 hover:bg-brand-50 font-semibold py-3 rounded-full transition-all duration-200 text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
