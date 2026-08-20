import { FALLBACK, getImageSrc } from "../../utils/imageUtils";

/**
 * Reusable image component with automatic fallback.
 * - referrerPolicy="no-referrer" bypasses hotlink protection on external hosts.
 * - onError switches to local fallback SVG on any load failure.
 */
export default function ProductImage({ src, alt = "", className = "", style }) {
  const resolved = getImageSrc(src);

  function handleError(e) {
    const el = e.currentTarget;
    // Prevent infinite loop if the fallback itself fails
    if (el.getAttribute("data-fallback-applied") === "1") return;
    el.setAttribute("data-fallback-applied", "1");
    el.removeAttribute("crossorigin");
    el.src = FALLBACK;
  }

  return (
    <img
      src={resolved}
      alt={alt}
      className={className}
      style={style}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      onError={handleError}
    />
  );
}
