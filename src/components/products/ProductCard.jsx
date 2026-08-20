import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star, AlertTriangle } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../ui/Toast";
import { formatPrice, calcDiscount } from "../../utils/currency";
import { getStockStatus, getPrimaryBadge } from "../../utils/productUtils";
import ProductImage from "../ui/ProductImage";

const BADGE_STYLES = {
  red: "bg-red-500 text-white",
  orange: "bg-orange-500 text-white",
  brand: "bg-brand-600 text-white",
  green: "bg-emerald-500 text-white",
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  const {
    id, name, slug, category, shortDescription, description,
    price, originalPrice, rating, reviewCount, stock, image,
  } = product;

  const discount = calcDiscount(price, originalPrice);
  const stockStatus = getStockStatus(stock);
  const badge = getPrimaryBadge(product);
  const wishlisted = isWishlisted(id);
  const outOfStock = stock === 0;
  const displayDesc = shortDescription || description || "";

  function handleAddToCart(e) {
    e.preventDefault();
    if (outOfStock) return;
    addToCart(product);
    showToast(`${name} added to cart`, "cart");
  }

  function handleWishlist(e) {
    e.preventDefault();
    toggleWishlist(product);
    showToast(
      wishlisted ? `${name} removed from wishlist` : `${name} added to wishlist`,
      "wishlist"
    );
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col border border-transparent hover:border-brand-100">
      {/* Image */}
      <div className="relative overflow-hidden bg-brand-50 h-48">
        <Link to={`/product/${slug}`} tabIndex={-1} aria-hidden="true">
          <ProductImage
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-all duration-300 pointer-events-none" />

        {/* Badge */}
        {badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase ${BADGE_STYLES[badge.color]}`}>
            {badge.label}
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
            wishlisted
              ? "bg-rose-500 text-white"
              : "bg-white text-gray-400 hover:text-rose-500 hover:bg-rose-50"
          }`}
        >
          <Heart size={14} className={wishlisted ? "fill-white" : ""} />
        </button>

       
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] font-semibold text-brand-600 uppercase tracking-widest mb-1">
          {category}
        </span>

        <Link to={`/product/${slug}`} className="group/title">
          <h3 className="font-heading text-base font-semibold text-gray-800 mb-1.5 leading-snug group-hover/title:text-brand-700 transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1.5 mb-2">
            <StarRating rating={rating} />
            <span className="text-xs font-semibold text-amber-600">{rating}</span>
            {reviewCount && (
              <span className="text-xs text-gray-400">({reviewCount})</span>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-3 line-clamp-2">
          {displayDesc}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-heading text-lg font-bold text-brand-700">
            {formatPrice(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="text-sm text-gray-400 line-through">{formatPrice(originalPrice)}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                {discount}% OFF
              </span>
            </>
          )}
        </div>

        {/* Stock warning */}
        {stockStatus.type === "critical" && (
          <div className="flex items-center gap-1 text-orange-600 text-xs font-medium mb-3">
            <AlertTriangle size={12} />
            <span>{stockStatus.label}</span>
          </div>
        )}
        {stockStatus.type === "out" && (
          <div className="text-red-500 text-xs font-semibold mb-3">Out of Stock</div>
        )}

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-full transition-all duration-200 mt-auto ${
            outOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isInCart(id)
              ? "bg-brand-100 text-brand-700 hover:bg-brand-600 hover:text-white"
              : "bg-brand-600 text-white hover:bg-brand-700 hover:shadow-md"
          }`}
        >
          <ShoppingCart size={14} />
          {outOfStock ? "Out of Stock" : isInCart(id) ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
