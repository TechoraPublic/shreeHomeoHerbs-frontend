import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, Truck, MapPin, Clock, ArrowLeft, ShoppingBag } from "lucide-react";
import { useOrders } from "../context/OrderContext";
import { formatPrice } from "../utils/currency";
import ProductImage from "../components/ui/ProductImage";

const STEP_ICONS = [ShoppingBag, CheckCircle, Package, Truck, MapPin, CheckCircle];

export default function OrderTracking() {
  const { orderId } = useParams();
  const { getOrder, TRACKING_STEPS, getTrackingStep } = useOrders();
  const order = getOrder(orderId);

  if (!order) {
    return (
      <main className="min-h-screen bg-[#faf8f5] pt-24 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-5xl mb-4">📦</div>
          <h1 className="font-heading text-2xl font-bold text-gray-800 mb-2">Order not found</h1>
          <p className="text-gray-500 mb-6">We couldn't find order #{orderId}</p>
          <Link to="/profile" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-full transition-colors">
            View My Orders
          </Link>
        </div>
      </main>
    );
  }

  const currentStep = getTrackingStep(order.placedAt);
  const addr = order.address;

  return (
    <main className="min-h-screen bg-[#faf8f5] pt-20">
      <div className="bg-white border-b border-brand-100 py-6">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-800 font-medium mb-3 transition-colors">
            <ArrowLeft size={15} />
            Back to Orders
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">Order #{order.id}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Placed on {new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 text-sm font-semibold px-4 py-2 rounded-full">
              <Clock size={14} />
              {TRACKING_STEPS[currentStep]}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Tracker */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-50 p-6">
          <h2 className="font-heading font-semibold text-gray-800 mb-6">Order Status</h2>

          {/* Estimated delivery */}
          <div className="bg-brand-50 border border-brand-100 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
            <Truck size={18} className="text-brand-600 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Estimated Delivery</p>
              <p className="text-sm font-semibold text-brand-700">
                {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />
            <div
              className="absolute left-5 top-5 w-0.5 bg-brand-400 transition-all duration-700"
              style={{ height: `${(currentStep / (TRACKING_STEPS.length - 1)) * 100}%` }}
            />

            <div className="space-y-6">
              {TRACKING_STEPS.map((step, i) => {
                const Icon = STEP_ICONS[i];
                const done = i <= currentStep;
                const active = i === currentStep;
                return (
                  <div key={step} className="flex items-start gap-4 relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                      done ? "bg-brand-600 text-white shadow-md shadow-brand-200" :
                      "bg-white border-2 border-gray-200 text-gray-300"
                    } ${active ? "ring-4 ring-brand-100" : ""}`}>
                      <Icon size={16} />
                    </div>
                    <div className="pt-1.5">
                      <p className={`text-sm font-semibold ${done ? "text-gray-800" : "text-gray-400"}`}>{step}</p>
                      {active && (
                        <p className="text-xs text-brand-600 font-medium mt-0.5">Current status</p>
                      )}
                      {i === 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.placedAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-50 p-6">
          <h2 className="font-heading font-semibold text-gray-800 mb-4">Items Ordered</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-50 shrink-0">
                  <ProductImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.slug}`} className="text-sm font-semibold text-gray-800 hover:text-brand-700 transition-colors line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5">{item.category} · Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-brand-700 shrink-0">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-brand-50 mt-4 pt-4 flex justify-between">
            <span className="font-heading font-bold text-gray-800">Total Paid</span>
            <span className="font-heading font-bold text-brand-700">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Delivery Address + Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl shadow-sm border border-brand-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={15} className="text-brand-600" />
              <h3 className="font-heading font-semibold text-gray-800 text-sm">Delivery Address</h3>
            </div>
            {addr ? (
              <div className="text-sm text-gray-600 space-y-0.5">
                <p className="font-semibold text-gray-800">{addr.fullName}</p>
                <p>{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}</p>
                <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                <p className="text-gray-500">{addr.phone}</p>
              </div>
            ) : <p className="text-sm text-gray-400">Address not available</p>}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-brand-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={15} className="text-brand-600" />
              <h3 className="font-heading font-semibold text-gray-800 text-sm">Payment</h3>
            </div>
            <p className="text-sm text-gray-600 capitalize">{order.paymentMethod?.replace("_", " ")}</p>
            <p className="text-sm font-semibold text-emerald-600 mt-1">Payment Confirmed</p>
            {order.savings > 0 && (
              <p className="text-xs text-emerald-600 mt-1">You saved {formatPrice(order.savings)}!</p>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
