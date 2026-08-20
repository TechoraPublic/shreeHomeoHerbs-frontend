import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, MapPin, Plus, CreditCard, Smartphone, Banknote, CheckCircle, AlertCircle, Lock, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useToast } from "../components/ui/Toast";
import { formatPrice } from "../utils/currency";
import ProductImage from "../components/ui/ProductImage";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI / QR Code", icon: Smartphone, desc: "Pay via any UPI app" },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, RuPay" },
  { id: "cod", label: "Cash on Delivery", icon: Banknote, desc: "Pay when your order arrives" },
];

function InputField({ label, id, type = "text", value, onChange, error, placeholder, required }) {
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
        className={`w-full px-4 py-3 border rounded-xl text-sm text-gray-800 placeholder-gray-400 bg-white transition-all focus:outline-none focus:ring-2 ${
          error ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-brand-400 focus:ring-brand-100"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} />{error}</p>}
    </div>
  );
}

const EMPTY_ADDR = { fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "" };

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
  const [payment, setPayment] = useState("upi");
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState(1); // 1=address, 2=payment

  if (cartItems.length === 0) {
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

  function setField(f) { return (e) => { setAddr((a) => ({ ...a, [f]: e.target.value })); setAddrErrors((er) => ({ ...er, [f]: "" })); }; }

  function validateAddress() {
    if (selectedSaved !== "new") return {};
    const e = {};
    if (!addr.fullName.trim()) e.fullName = "Full name is required.";
    if (!addr.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^[6-9]\d{9}$/.test(addr.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit mobile number.";
    if (!addr.addressLine1.trim()) e.addressLine1 = "Address is required.";
    if (!addr.city.trim()) e.city = "City is required.";
    if (!addr.state.trim()) e.state = "State is required.";
    if (!addr.pincode.trim()) e.pincode = "Pincode is required.";
    else if (!/^\d{6}$/.test(addr.pincode)) e.pincode = "Enter a valid 6-digit pincode.";
    return e;
  }

  function handleNextStep() {
    if (step === 1) {
      const errs = validateAddress();
      if (Object.keys(errs).length) { setAddrErrors(errs); return; }
      if (selectedSaved === "new" && currentUser) {
        const result = addAddress(addr);
        if (result.address) {
          setNewlySavedAddress(result.address);
          setSelectedSaved(result.address.id);
        }
        setShowAddressOptions(false);
      }
    }
    setStep((s) => s + 1);
  }

  async function handlePlaceOrder() {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 800));
    const deliveryAddress = selectedSaved !== "new"
      ? savedAddresses.find((a) => a.id === selectedSaved) || newlySavedAddress
      : addr;
    const order = placeOrder({
      items: cartItems,
      address: deliveryAddress,
      paymentMethod: payment,
      total: cartTotal,
      savings: cartSavings,
      userId: currentUser?.id,
    });
    clearCart();
    setPlacing(false);
    showToast("Order placed successfully!", "success");
    navigate(`/order/${order.id}`);
  }

  const shippingFree = cartTotal >= 299;
  const grandTotal = cartTotal + (shippingFree ? 0 : 49);
  const selectedAddress = savedAddresses.find((a) => a.id === selectedSaved) || newlySavedAddress;

  const STEPS = ["Delivery", "Payment"];

  return (
    <main className="min-h-screen bg-[#faf8f5] pt-20">
      {/* Header */}
      <div className="bg-white border-b border-brand-100 py-6">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 text-xs text-gray-500 mb-4">
            <Link to="/" className="hover:text-brand-600">Home</Link>
            <ChevronRight size={12} />
            <Link to="/cart" className="hover:text-brand-600">Cart</Link>
            <ChevronRight size={12} />
            <span className="text-gray-800 font-medium">Checkout</span>
          </nav>
          {/* Step indicator */}
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 ${i + 1 <= step ? "text-brand-700" : "text-gray-400"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                    i + 1 < step ? "bg-brand-600 border-brand-600 text-white" :
                    i + 1 === step ? "border-brand-600 text-brand-700" :
                    "border-gray-200 text-gray-400"
                  }`}>
                    {i + 1 < step ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`w-8 sm:w-16 h-0.5 mx-2 ${i + 1 < step ? "bg-brand-400" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Steps */}
          <div className="lg:col-span-2 space-y-5">

            {/* Step 1: Delivery Address */}
            <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${step === 1 ? "border-brand-200" : "border-brand-50"}`}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-brand-50">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step > 1 ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-700"}`}>
                    {step > 1 ? <CheckCircle size={14} /> : "1"}
                  </div>
                  <h2 className="font-heading font-semibold text-gray-800">Delivery Address</h2>
                </div>
                {step > 1 && <button onClick={() => setStep(1)} className="text-xs text-brand-600 font-semibold hover:text-brand-800">Change</button>}
              </div>

              {step === 1 && (
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
                      <InputField label="Mobile Number" id="phone" type="tel" value={addr.phone} onChange={setField("phone")} error={addrErrors.phone} placeholder="10-digit mobile" required />
                      <div className="sm:col-span-2">
                        <InputField label="Address Line 1" id="addressLine1" value={addr.addressLine1} onChange={setField("addressLine1")} error={addrErrors.addressLine1} placeholder="House no., Street, Area" required />
                      </div>
                      <div className="sm:col-span-2">
                        <InputField label="Address Line 2" id="addressLine2" value={addr.addressLine2} onChange={setField("addressLine2")} placeholder="Landmark, Colony (optional)" />
                      </div>
                      <InputField label="City" id="city" value={addr.city} onChange={setField("city")} error={addrErrors.city} placeholder="City" required />
                      <InputField label="State" id="state" value={addr.state} onChange={setField("state")} error={addrErrors.state} placeholder="State" required />
                      <InputField label="Pincode" id="pincode" value={addr.pincode} onChange={setField("pincode")} error={addrErrors.pincode} placeholder="6-digit pincode" required />
                    </div>
                  )}

                  <button onClick={handleNextStep} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 rounded-full transition-colors mt-2">
                    Continue to Payment
                  </button>
                </div>
              )}

              {step > 1 && selectedSaved !== "new" && (
                <div className="px-6 py-4 text-sm text-gray-600">
                  <p className="font-semibold text-gray-800">{savedAddresses.find((a) => a.id === selectedSaved)?.fullName}</p>
                  <p>{savedAddresses.find((a) => a.id === selectedSaved)?.addressLine1}, {savedAddresses.find((a) => a.id === selectedSaved)?.city}</p>
                </div>
              )}
            </div>

            {/* Step 2: Payment */}
            {step >= 2 && (
              <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${step === 2 ? "border-brand-200" : "border-brand-50"}`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-brand-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step > 2 ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-700"}`}>
                      {step > 2 ? <CheckCircle size={14} /> : "2"}
                    </div>
                    <h2 className="font-heading font-semibold text-gray-800">Payment Method</h2>
                  </div>
                  {step > 2 && <button onClick={() => setStep(2)} className="text-xs text-brand-600 font-semibold hover:text-brand-800">Change</button>}
                </div>

                {step === 2 && (
                  <div className="p-6 space-y-3">
                    {PAYMENT_METHODS.map(({ id, label, icon: Icon, desc }) => (
                      <label key={id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${payment === id ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:border-brand-200"}`}>
                        <input type="radio" name="payment" value={id} checked={payment === id} onChange={() => setPayment(id)} className="accent-brand-600" />
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${payment === id ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{label}</p>
                          <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                      </label>
                    ))}

                    <div className="mt-4 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-4 py-3 rounded-xl">
                      <Lock size={13} />
                      This is a secure demo payment screen. No real money will be charged.
                    </div>

                    {/* Static payment UI */}
                    {payment === "card" && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                        <InputField label="Card Number" id="cardNumber" placeholder="1234 5678 9012 3456" />
                        <div className="grid grid-cols-2 gap-3">
                          <InputField label="Expiry" id="expiry" placeholder="MM / YY" />
                          <InputField label="CVV" id="cvv" placeholder="•••" />
                        </div>
                        <InputField label="Name on Card" id="cardName" placeholder="As printed on card" />
                      </div>
                    )}
                    {payment === "upi" && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <InputField label="UPI ID" id="upiId" placeholder="yourname@upi" />
                      </div>
                    )}

                    <button onClick={handlePlaceOrder} disabled={placing} className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-full transition-colors mt-2">
                      {placing ? "Processing payment..." : payment === "cod" ? `Confirm Order · ${formatPrice(grandTotal)}` : `Pay Securely · ${formatPrice(grandTotal)}`}
                    </button>
                  </div>
                )}
              </div>
            )}

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
