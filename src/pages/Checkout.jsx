import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, MapPin, Plus, AlertCircle, Lock, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useToast } from "../components/ui/Toast";
import { formatPrice } from "../utils/currency";
import { startRazorpayCheckout } from "../utils/razorpay";
import { API_BASE_URL } from "../utils/api";
import ProductImage from "../components/ui/ProductImage";
import OrderConfirmationModal from "../components/ui/OrderConfirmationModal";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

function InputField({ label, id, type = "text", value, onChange, error, placeholder, required, maxLength }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-3 border rounded-xl text-sm text-gray-800 placeholder-gray-400 bg-white transition-all focus:outline-none focus:ring-2 ${
          error ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-brand-400 focus:ring-brand-100"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} />{error}</p>}
    </div>
  );
}

function SelectField({ label, id, value, onChange, error, options, placeholder, required }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-xl text-sm text-gray-800 bg-white transition-all focus:outline-none focus:ring-2 ${
          error ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-brand-400 focus:ring-brand-100"
        }`}
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} />{error}</p>}
    </div>
  );
}

const EMPTY_ADDR = { fullName: "", email: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "" };

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartSavings, clearCart } = useCart();
  const { currentUser, addAddress } = useAuth();
  const { placeOrder } = useOrders();
  const { showToast } = useToast();

  const savedAddresses = currentUser?.addresses || [];
  const [selectedSaved, setSelectedSaved] = useState(savedAddresses.length > 0 ? savedAddresses[0].id : "new");
  const [showAddressOptions, setShowAddressOptions] = useState(savedAddresses.length === 0);
  const [newlySavedAddress, setNewlySavedAddress] = useState(null);
  const [addr, setAddr] = useState(EMPTY_ADDR);
  const [addrErrors, setAddrErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (cartItems.length === 0 && !completedOrder) {
    return (
      <main className="min-h-screen bg-[#faf8f5] pt-24 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-heading text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h1>
          <Link to="/shop" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-full transition-colors">
            Shop Now
          </Link>
        </div>
      </main>
    );
  }

  function setField(f, transform) {
    return (e) => {
      const value = transform ? transform(e.target.value) : e.target.value;
      setAddr((a) => ({ ...a, [f]: value }));
      setAddrErrors((er) => ({ ...er, [f]: "" }));
    };
  }

  function validateAddress() {
    if (selectedSaved !== "new") return {};
    const e = {};
    if (!addr.fullName.trim()) e.fullName = "Full name is required.";
    if (!addr.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr.email)) e.email = "Enter a valid email.";
    if (!addr.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^[6-9]\d{9}$/.test(addr.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit mobile number.";
    if (!addr.addressLine1.trim()) e.addressLine1 = "Address is required.";
    if (!addr.city.trim()) e.city = "City is required.";
    if (!addr.state.trim()) e.state = "State is required.";
    if (!addr.pincode.trim()) e.pincode = "Pincode is required.";
    else if (!/^\d{6}$/.test(addr.pincode)) e.pincode = "Enter a valid 6-digit pincode.";
    return e;
  }

  function finalizeOrder(deliveryAddress, paymentId) {
    const orderedItems = cartItems;
    const orderedTotal = grandTotal;
    const customerEmail = deliveryAddress?.email || currentUser?.email;
    const addressWithEmail = { ...deliveryAddress, email: customerEmail };

    const order = placeOrder({
      items: orderedItems,
      address: addressWithEmail,
      paymentMethod: "online",
      paymentId,
      total: cartTotal,
      savings: cartSavings,
      userId: currentUser?.id,
    });
    clearCart();
    setCompletedOrder({ id: order.id, items: orderedItems, address: addressWithEmail, total: orderedTotal, email: customerEmail });

    if (customerEmail) {
      fetch(`${API_BASE_URL}/order/send-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          items: orderedItems,
          address: addressWithEmail,
          total: orderedTotal,
          paymentId,
          placedAt: order.placedAt,
        }),
      }).catch(() => {
        showToast("Order placed, but the confirmation email failed to send.", "error");
      });
    }
  }

  async function handlePlaceOrder() {
    const errs = validateAddress();
    if (Object.keys(errs).length) { setAddrErrors(errs); return; }

    let deliveryAddress = selectedSaved !== "new"
      ? savedAddresses.find((a) => a.id === selectedSaved) || newlySavedAddress
      : addr;

    if (selectedSaved === "new" && currentUser) {
      const result = addAddress(addr);
      if (result.address) {
        deliveryAddress = result.address;
        setNewlySavedAddress(result.address);
        setSelectedSaved(result.address.id);
      }
      setShowAddressOptions(false);
    }

    setPlacing(true);
    try {
      await startRazorpayCheckout({
        amount: grandTotal,
        description: `Order · ${cartItems.length} item${cartItems.length > 1 ? "s" : ""}`,
        prefill: {
          name: deliveryAddress?.fullName || currentUser?.name,
          email: deliveryAddress?.email || currentUser?.email,
          contact: deliveryAddress?.phone || currentUser?.phone,
        },
        onSuccess: (response) => {
          finalizeOrder(deliveryAddress, response.razorpay_payment_id);
        },
        onDismiss: () => {
          showToast("Payment cancelled.", "info");
        },
      });
    } catch (error) {
      showToast(error.message || "Unable to start payment. Please try again.", "error");
    } finally {
      setPlacing(false);
    }
  }

  const shippingFree = cartTotal >= 299;
  const grandTotal = cartTotal + (shippingFree ? 0 : 49);
  const selectedAddress = savedAddresses.find((a) => a.id === selectedSaved) || newlySavedAddress;

  if (completedOrder) {
    return (
      <>
        <main className="min-h-screen bg-[#faf8f5]" />
        <OrderConfirmationModal
          isOpen
          order={completedOrder}
          onClose={() => { setCompletedOrder(null); navigate("/shop"); }}
        />
      </>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] pt-20">
      {/* Header */}
      <div className="bg-white border-b border-brand-100 py-6">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 text-xs text-gray-500">
            <Link to="/" className="hover:text-brand-600">Home</Link>
            <ChevronRight size={12} />
            <Link to="/cart" className="hover:text-brand-600">Cart</Link>
            <ChevronRight size={12} />
            <span className="text-gray-800 font-medium">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Steps */}
          <div className="lg:col-span-2 space-y-5">

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-brand-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-brand-50">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-brand-100 text-brand-700">
                    1
                  </div>
                  <h2 className="font-heading font-semibold text-gray-800">Delivery Address</h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                  {/* Saved addresses */}
                  {savedAddresses.length > 0 && !showAddressOptions && selectedSaved !== "new" && (
                    <div className="flex items-start gap-3 p-4 rounded-xl border border-brand-400 bg-brand-50">
                      <MapPin size={18} className="text-brand-600 mt-0.5 shrink-0" />
                      <div className="text-sm flex-1">
                        <p className="text-xs font-semibold text-brand-700 uppercase tracking-wide mb-1">Delivering to</p>
                        <p className="font-semibold text-gray-800">{selectedAddress?.fullName}</p>
                        <p className="text-gray-500">{selectedAddress?.addressLine1}, {selectedAddress?.city}</p>
                        <p className="text-gray-500">{selectedAddress?.state} — {selectedAddress?.pincode}</p>
                      </div>
                      <button onClick={() => setShowAddressOptions(true)} className="text-xs text-brand-600 font-semibold hover:text-brand-800">Change</button>
                    </div>
                  )}

                  {savedAddresses.length > 0 && showAddressOptions && (
                    <div className="space-y-2 mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Choose an address</p>
                      {savedAddresses.map((a) => (
                        <label key={a.id} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${selectedSaved === a.id ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:border-brand-200"}`}>
                          <input type="radio" name="savedAddr" value={a.id} checked={selectedSaved === a.id} onChange={() => { setSelectedSaved(a.id); setShowAddressOptions(false); }} className="mt-0.5 accent-brand-600" />
                          <div className="text-sm">
                            <p className="font-semibold text-gray-800">{a.fullName}</p>
                            <p className="text-gray-500">{a.addressLine1}{a.addressLine2 ? `, ${a.addressLine2}` : ""}</p>
                            <p className="text-gray-500">{a.city}, {a.state} — {a.pincode}</p>
                            <p className="text-gray-500">{a.phone}</p>
                          </div>
                        </label>
                      ))}
                      <button onClick={() => { setSelectedSaved("new"); setAddr(EMPTY_ADDR); }} className="w-full flex items-center gap-3 p-4 rounded-xl border border-dashed border-brand-300 text-left hover:bg-brand-50 transition-colors">
                        <Plus size={17} className="text-brand-600" />
                        <span className="text-sm font-medium text-brand-700">Add a new address</span>
                      </button>
                    </div>
                  )}

                  {/* New address form */}
                  {(selectedSaved === "new" || savedAddresses.length === 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <InputField label="Full Name" id="fullName" value={addr.fullName} onChange={setField("fullName")} error={addrErrors.fullName} placeholder="Recipient's full name" required />
                      </div>
                      <InputField label="Email Address" id="email" type="email" value={addr.email} onChange={setField("email")} error={addrErrors.email} placeholder="you@example.com" required />
                      <InputField label="Mobile Number" id="phone" type="tel" value={addr.phone} onChange={setField("phone", (v) => v.replace(/\D/g, "").slice(0, 10))} error={addrErrors.phone} placeholder="10-digit mobile" maxLength={10} required />
                      <div className="sm:col-span-2">
                        <InputField label="Address Line 1" id="addressLine1" value={addr.addressLine1} onChange={setField("addressLine1")} error={addrErrors.addressLine1} placeholder="House no., Street, Area" required />
                      </div>
                      <div className="sm:col-span-2">
                        <InputField label="Address Line 2" id="addressLine2" value={addr.addressLine2} onChange={setField("addressLine2")} placeholder="Landmark, Colony (optional)" />
                      </div>
                      <InputField label="City" id="city" value={addr.city} onChange={setField("city")} error={addrErrors.city} placeholder="City" required />
                      <SelectField label="State" id="state" value={addr.state} onChange={setField("state")} error={addrErrors.state} options={INDIAN_STATES} placeholder="Select state" required />
                      <InputField label="Pincode" id="pincode" value={addr.pincode} onChange={setField("pincode")} error={addrErrors.pincode} placeholder="6-digit pincode" required />
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-4 py-3 rounded-xl">
                    <Lock size={13} />
                    You'll enter your payment details securely via Razorpay.
                  </div>

                  <button onClick={handlePlaceOrder} disabled={placing} className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-full transition-colors mt-2">
                    {placing ? "Processing payment..." : `Pay Securely · ${formatPrice(grandTotal)}`}
                  </button>
              </div>
            </div>

          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-brand-50 p-6 sticky top-24">
              <h3 className="font-heading font-bold text-gray-800 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-50 shrink-0">
                      <ProductImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">×{item.quantity}</p>
                    </div>
                    <p className="text-xs font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-brand-50 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartItems.reduce((s, i) => s + (i.originalPrice || i.price) * i.quantity, 0))}</span>
                </div>
                {cartSavings > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span className="flex items-center gap-1"><Tag size={11} />Discount</span>
                    <span>−{formatPrice(cartSavings)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={shippingFree ? "text-emerald-600 font-medium" : "text-gray-800"}>{shippingFree ? "Free" : formatPrice(49)}</span>
                </div>
                <div className="flex justify-between font-heading font-bold text-gray-900 pt-2 border-t border-brand-50">
                  <span>Total</span>
                  <span className="text-brand-700">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
