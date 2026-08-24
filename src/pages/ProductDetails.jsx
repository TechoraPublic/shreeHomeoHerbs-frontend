import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star, Heart, ShoppingCart, Minus, Plus, ChevronRight,
  AlertTriangle, CheckCircle, Package, Leaf, Zap,
} from "lucide-react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../components/ui/Toast";
import { formatPrice, calcDiscount } from "../utils/currency";
import { getStockStatus } from "../utils/productUtils";
import ProductCard from "../components/products/ProductCard";
import ProductImage from "../components/ui/ProductImage";

function StarRow({ rating, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
        />
      ))}
    </div>
  );
}

function RatingBar({ star, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-4 text-gray-600 font-medium">{star}</span>
      <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-gray-400">{count}</span>
    </div>
  );
}

const TABS = ["Description", "Benefits", "Ingredients", "Specifications", "Reviews"];

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.slug === slug);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#faf8f5] pt-20">
        <div className="text-center">
          <div className="text-5xl mb-4">🌿</div>
          <h1 className="font-heading text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/shop" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-full transition-colors">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const {
    id, name, category, description, shortDescription,
    price, originalPrice, rating, reviewCount, stock,
    image, gallery = [], benefits = [], specifications = [],
    ingredients = [], offer, reviews = [],
  } = product;

  const discount = calcDiscount(price, originalPrice);
  const stockStatus = getStockStatus(stock);
  const wishlisted = isWishlisted(id);
  const outOfStock = stock === 0;
  const images = gallery.length > 0 ? gallery : [image];

  function handleAddToCart() {
    if (outOfStock) return;
    addToCart(product, qty);
    showToast(`${name} added to cart`, "cart");
  }

  function handleBuyNow() {
    if (outOfStock) return;
    addToCart(product, qty);
    navigate("/cart");
  }

  function handleWishlist() {
    toggleWishlist(product);
    showToast(
      wishlisted ? `${name} removed from wishlist` : `${name} added to wishlist`,
      "wishlist"
    );
  }

  // Rating breakdown
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  // Related products
  const related = products.filter((p) => p.category === category && p.id !== id).slice(0, 4);

  return (
    <main className="min-h-screen bg-[#faf8f5] pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-50">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/shop" className="hover:text-brand-600 transition-colors">Shop</Link>
            <ChevronRight size={12} />
            <Link to={`/shop?category=${category}`} className="hover:text-brand-600 transition-colors">{category}</Link>
            <ChevronRight size={12} />
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16" data-reveal>

          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative bg-white rounded-3xl overflow-hidden aspect-square shadow-sm border border-brand-50">
              <ProductImage
                src={images[activeImg]}
                alt={name}
                className="w-full h-full object-cover"
              />
              {offer?.enabled && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                  {offer.label}
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? "border-brand-500 shadow-md" : "border-transparent hover:border-brand-200"
                    }`}
                  >
                    <ProductImage
                      src={img}
                      alt={`${name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 self-start">
            <span className="inline-block text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">
              {category}
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              {name}
            </h1>

            {/* Rating */}
            {rating && (
              <div className="flex items-center gap-3 mb-4">
                <StarRow rating={rating} />
                <span className="text-sm font-bold text-amber-600">{rating}</span>
                <span className="text-sm text-gray-400">({reviewCount} reviews)</span>
              </div>
            )}

            {/* Short description */}
            {shortDescription && (
              <p className="text-gray-600 text-sm leading-relaxed mb-5 border-l-2 border-brand-300 pl-3">
                {shortDescription}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-heading text-3xl font-bold text-brand-700">{formatPrice(price)}</span>
              {originalPrice && originalPrice > price && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(originalPrice)}</span>
                  <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-2.5 py-1 rounded-full">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Offer */}
            {offer?.enabled && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-sm font-medium px-4 py-2.5 rounded-xl mb-4">
                <Zap size={14} className="shrink-0" />
                {offer.label}
              </div>
            )}

            {/* Stock */}
            <div className="mb-5">
              {stockStatus.type === "in" && (
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                  <CheckCircle size={15} />
                  In Stock
                </div>
              )}
              {(stockStatus.type === "low" || stockStatus.type === "critical") && (
                <div className="flex items-center gap-2 text-orange-600 text-sm font-medium">
                  <AlertTriangle size={15} />
                  {stockStatus.label} in stock
                </div>
              )}
              {stockStatus.type === "out" && (
                <div className="flex items-center gap-2 text-red-600 text-sm font-semibold">
                  <Package size={15} />
                  Out of Stock
                </div>
              )}
            </div>

            {/* Quantity */}
            {!outOfStock && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-600">Quantity</span>
                <div className="flex items-center border border-brand-200 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-brand-50 disabled:opacity-40 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-gray-800">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(stock, q + 1))}
                    disabled={qty >= stock}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-brand-50 disabled:opacity-40 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3.5 rounded-full transition-all duration-200 ${
                  outOfStock
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-brand-600 hover:bg-brand-700 text-white hover:shadow-lg hover:shadow-brand-200"
                }`}
              >
                <ShoppingCart size={18} />
                {outOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={outOfStock}
                className={`flex-1 font-semibold py-3.5 rounded-full border-2 transition-all duration-200 ${
                  outOfStock
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-brand-600 text-brand-700 hover:bg-brand-600 hover:text-white"
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className={`flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
                wishlisted ? "text-rose-500" : "text-gray-500 hover:text-rose-500"
              }`}
            >
              <Heart size={16} className={wishlisted ? "fill-rose-500" : ""} />
              {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>

            {/* Trust badges */}
            <div className="mt-6 pt-6 border-t border-brand-50 grid grid-cols-3 gap-3">
              {[
                { icon: Leaf, label: "100% Natural" },
                { icon: CheckCircle, label: "Quality Assured" },
                { icon: Package, label: "Safe Packaging" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center">
                    <Icon size={16} className="text-brand-600" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-brand-50 mb-12 overflow-hidden">
          {/* Tab nav */}
          <div className="flex overflow-x-auto border-b border-brand-50 scrollbar-hide">
            {TABS.filter((tab) => {
              if (tab === "Benefits" && benefits.length === 0) return false;
              if (tab === "Ingredients" && ingredients.length === 0) return false;
              if (tab === "Specifications" && specifications.length === 0) return false;
              if (tab === "Reviews" && reviews.length === 0) return false;
              return true;
            }).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors duration-200 ${
                  activeTab === tab
                    ? "border-brand-600 text-brand-700"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-6 lg:p-8">
            {activeTab === "Description" && (
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                <p>{description}</p>
              </div>
            )}

            {activeTab === "Benefits" && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 bg-brand-50 rounded-xl p-3">
                    <CheckCircle size={16} className="text-brand-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700">{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "Ingredients" && (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ing, i) => (
                  <span key={i} className="bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1.5 rounded-full border border-brand-100">
                    {ing}
                  </span>
                ))}
              </div>
            )}

            {activeTab === "Specifications" && (
              <div className="overflow-hidden rounded-xl border border-brand-100">
                <table className="w-full text-sm">
                  <tbody>
                    {specifications.map(({ label, value }, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-brand-50/50" : "bg-white"}>
                        <td className="px-5 py-3 font-semibold text-gray-700 w-1/3">{label}</td>
                        <td className="px-5 py-3 text-gray-600">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "Reviews" && (
              <div className="space-y-8">
                {/* Summary */}
                <div className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-brand-50">
                  <div className="text-center">
                    <div className="font-heading text-6xl font-bold text-brand-700 mb-1">{rating}</div>
                    <StarRow rating={rating} />
                    <div className="text-sm text-gray-500 mt-1">{reviewCount} reviews</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {ratingCounts.map(({ star, count }) => (
                      <RatingBar key={star} star={star} count={count} total={reviews.length} />
                    ))}
                  </div>
                </div>

                {/* Review list — DEMO DATA */}
                <p className="text-xs text-gray-400 italic">* Reviews shown are demo content for display purposes.</p>
                <div className="space-y-5">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-brand-50 pb-5 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-gray-800 text-sm">{review.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StarRow rating={review.rating} />
                            <span className="text-xs text-gray-400">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="font-medium text-gray-700 text-sm mb-1">{review.title}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                You May Also Like
              </h2>
              <div className="flex justify-center">
                <div className="w-12 h-0.5 bg-brand-400 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
