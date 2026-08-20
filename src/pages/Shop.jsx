import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { products } from "../data/products";
import { filterProducts } from "../utils/productUtils";
import ProductCard from "../components/products/ProductCard";
import { useDebounce } from "../hooks/useDebounce";

const CATEGORIES = ["All", "Soaps", "Hair Care"];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "bestselling", label: "Best Selling" },
];
const PRODUCTS_PER_PAGE = 8;

export default function Shop() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  const filtered = useMemo(
    () => filterProducts(products, { search: debouncedSearch, category, sort }),
    [debouncedSearch, category, sort]
  );
  const pageCount = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const visibleProducts = filtered.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setSort("featured");
  }

  const hasActiveFilters = search || category !== "All" || sort !== "featured";

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      {/* Shop Hero */}
      <section className="bg-white border-b border-brand-100 pt-24 pb-10 lg:pt-28 lg:pb-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
         
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Shop All Products
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
            Discover our complete range of natural and herbal care products, crafted with traditional wisdom.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Search + Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-brand-100 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Desktop: Category + Sort */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Category pills */}
            <div className="flex items-center gap-1.5 bg-white border border-brand-100 rounded-full px-2 py-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setPage(1); }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 ${
                    category === cat
                      ? "bg-brand-600 text-white"
                      : "text-gray-600 hover:bg-brand-50 hover:text-brand-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="appearance-none bg-white border border-brand-100 rounded-full pl-4 pr-8 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-brand-400 cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Mobile: Filter button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="sm:hidden flex items-center justify-center gap-2 bg-white border border-brand-100 rounded-full px-4 py-3 text-sm font-medium text-gray-700"
          >
            <SlidersHorizontal size={15} />
            Filter & Sort
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-brand-600" />
            )}
          </button>
        </div>

        {/* Product count + clear */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-800">{filtered.length}</span> of{" "}
            <span className="font-semibold text-gray-800">{products.length}</span> products
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-brand-600 hover:text-brand-800 flex items-center gap-1 transition-colors"
            >
              <X size={12} />
              Clear filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🌿</div>
            <h3 className="font-heading text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 text-sm mb-6">Try adjusting your search or filters.</p>
            <button
              onClick={clearFilters}
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {pageCount > 1 && (
          <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Product pages">
            <button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} aria-label="Previous page" className="w-9 h-9 rounded-full border border-brand-200 flex items-center justify-center text-brand-700 disabled:opacity-40">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <button key={pageNumber} onClick={() => setPage(pageNumber)} aria-label={`Page ${pageNumber}`} className={`w-9 h-9 rounded-full text-sm font-semibold ${page === pageNumber ? "bg-brand-600 text-white" : "border border-brand-200 text-brand-700 hover:bg-brand-50"}`}>
                {pageNumber}
              </button>
            ))}
            <button onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount} aria-label="Next page" className="w-9 h-9 rounded-full border border-brand-200 flex items-center justify-center text-brand-700 disabled:opacity-40">
              <ChevronRight size={16} />
            </button>
          </nav>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-lg font-semibold text-gray-800">Filter & Sort</h3>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setPage(1); }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                      category === cat
                        ? "bg-brand-600 text-white border-brand-600"
                        : "border-brand-200 text-gray-600 hover:border-brand-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Sort By</p>
              <div className="flex flex-col gap-2">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => { setSort(o.value); setPage(1); }}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      sort === o.value
                        ? "bg-brand-100 text-brand-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 rounded-full transition-colors"
            >
              Show {filtered.length} Products
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
