export function getStockStatus(stock) {
  if (stock === 0) return { label: "Out of Stock", type: "out" };
  if (stock <= 5) return { label: `Only ${stock} left`, type: "critical" };
  if (stock <= 10) return { label: `Only ${stock} left`, type: "low" };
  return { label: "In Stock", type: "in" };
}

export function getPrimaryBadge(product) {
  if (product.offer?.enabled) return { label: product.offer.label || "Limited Time Offer", color: "red" };
  if (product.stock > 0 && product.stock <= 5) return { label: "Limited Stock", color: "orange" };
  if (product.bestseller) return { label: "Bestseller", color: "brand" };
  if (product.discount > 0) return { label: `${product.discount}% OFF`, color: "green" };
  return null;
}

export function filterProducts(products, { search, category, sort }) {
  let result = [...products];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }

  if (category && category !== "All") {
    result = result.filter((p) => p.category === category);
  }

  switch (sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case "bestselling":
      result.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
      break;
    case "featured":
    default:
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  return result;
}
