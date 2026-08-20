import { Heart, ShoppingBag, Trash2, X, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/ui/Toast";
import { formatPrice } from "../utils/currency";
import ProductImage from "../components/ui/ProductImage";

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (wishlistItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#faf8f5] pt-24 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-rose-400" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h1>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Save products you love and find them here anytime.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors">
            <ShoppingBag size={16} />Explore Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] pt-20">
      <div className="bg-white border-b border-brand-100 py-8">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
            Wishlist <span className="ml-2 text-base font-normal text-gray-400">({wishlistItems.length})</span>
          </h1>
          <button onClick={clearWishlist} className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
            <Trash2 size={12} />Clear wishlist
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {wishlistItems.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col border border-transparent hover:border-brand-100">
              <div className="relative h-48 bg-brand-50 overflow-hidden">
                <Link to={`/product/${product.slug}`} tabIndex={-1}>
                  <ProductImage src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </Link>
                <button
                  onClick={() => { removeFromWishlist(product.id); showToast(`${product.name} removed from wishlist`, "wishlist"); }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <span className="text-[10px] font-semibold text-brand-600 uppercase tracking-widest mb-1">{product.category}</span>
                <Link to={`/product/${product.slug}`} className="font-heading text-sm font-semibold text-gray-800 mb-2 hover:text-brand-700 transition-colors line-clamp-2">{product.name}</Link>

                <div className="flex items-baseline gap-2 mb-4 mt-auto">
                  <span className="font-heading text-base font-bold text-brand-700">{formatPrice(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { addToCart(product); showToast(`${product.name} added to cart`, "cart"); }}
                    disabled={product.stock === 0}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-full border border-brand-600 text-brand-600 hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ShoppingCart size={13} />Add to Cart
                  </button>
                  <button
                    onClick={() => { addToCart(product); navigate("/checkout"); }}
                    disabled={product.stock === 0}
                    className="flex-1 text-xs font-semibold py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
