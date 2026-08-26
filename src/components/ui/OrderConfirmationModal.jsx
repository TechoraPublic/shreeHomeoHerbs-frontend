import { CheckCircle, MapPin, Mail } from "lucide-react";
import { formatPrice } from "../../utils/currency";
import ProductImage from "./ProductImage";

export default function OrderConfirmationModal({ isOpen, order, onClose }) {
  if (!isOpen || !order) return null;

  const { id, items, address, total, email } = order;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-[slideUp_0.2s_ease-out]">
        <div className="p-6 text-center border-b border-brand-50">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
            <CheckCircle size={28} className="text-emerald-500" />
          </div>
          <h2 className="font-heading text-lg font-bold text-gray-900 mb-1">Order Placed Successfully!</h2>
          <p className="text-xs text-gray-500">Order #{id}</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Items Ordered</p>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-50 shrink-0">
                    <ProductImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty ×{item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Delivery Address</p>
            <div className="flex items-start gap-2.5 bg-brand-50 rounded-xl p-3.5">
              <MapPin size={15} className="text-brand-600 mt-0.5 shrink-0" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-gray-800">{address?.fullName}</p>
                <p>{address?.addressLine1}{address?.addressLine2 ? `, ${address.addressLine2}` : ""}</p>
                <p>{address?.city}, {address?.state} — {address?.pincode}</p>
                <p className="text-gray-500 mt-0.5">{address?.phone}</p>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-3 border-t border-brand-50">
            <span className="font-heading font-bold text-gray-800">Total Paid</span>
            <span className="font-heading text-lg font-bold text-brand-700">{formatPrice(total)}</span>
          </div>

          {/* Email notice */}
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-4 py-3 rounded-xl">
            <Mail size={15} className="mt-0.5 shrink-0" />
            <p>
              We've sent the order details to{" "}
              {email ? <span className="font-semibold">{email}</span> : "your registered email"}.
              You can download the invoice from that email.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-full transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
