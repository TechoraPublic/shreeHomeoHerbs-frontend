import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  User,
  MapPin,
  Heart,
  ShoppingBag,
  Edit2,
  Trash2,
  Plus,
  LogOut,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Package,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../components/ui/Toast";
import { formatPrice } from "../utils/currency";
import ProductImage from "../components/ui/ProductImage";
const TAB_INFO = {
  profile: {
    title: "My Profile",
    description: "Manage your personal information and account settings.",
    icon: User,
  },
  orders: {
    title: "My Orders",
    description: "View your orders and track your purchases.",
    icon: ShoppingBag,
  },
  addresses: {
    title: "My Addresses",
    description: "Manage your saved delivery addresses.",
    icon: MapPin,
  },
  wishlist: {
    title: "My Wishlist",
    description: "Products you've saved for later.",
    icon: Heart,
  },
};

function Field({ label, id, type = "text", value, onChange, error, placeholder, required, maxLength }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={type === "tel" ? "numeric" : undefined}
        className={`w-full px-4 py-3 border rounded-xl text-sm text-gray-800 placeholder-gray-400 bg-white transition-all focus:outline-none focus:ring-2 ${error ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-brand-400 focus:ring-brand-100"}`}
      />
      {error && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

function SelectField({ label, id, value, onChange, error, options, placeholder, required, disabled }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 border rounded-xl text-sm text-gray-800 bg-white transition-all focus:outline-none focus:ring-2 ${error ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-brand-400 focus:ring-brand-100"}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

const EMPTY_ADDRESS = { label: "", fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "" };

const INDIAN_CITIES = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat"],
  Assam: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat"],
  Bihar: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Korba"],
  Goa: ["Panaji", "Vasco da Gama", "Margao"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Hisar"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Mandi", "Solan"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  Manipur: ["Imphal", "Thoubal", "Bishnupur"],
  Meghalaya: ["Shillong", "Tura", "Jowai"],
  Mizoram: ["Aizawl", "Lunglei", "Champhai"],
  Nagaland: ["Kohima", "Dimapur", "Mokokchung"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri"],
  Punjab: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  Sikkim: ["Gangtok", "Namchi", "Gyalshing"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  Tripura: ["Agartala", "Udaipur", "Dharmanagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Noida"],
  Uttarakhand: ["Dehradun", "Haridwar", "Haldwani", "Rishikesh"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
  Delhi: ["New Delhi", "Delhi"],
};

const INDIAN_STATES = Object.keys(INDIAN_CITIES).sort();

function validateAddress(address) {
  const errors = {};

  // Address Label - optional, but if entered: 2-300 characters
  if (address.label.trim()) {
    if (address.label.trim().length < 2) {
      errors.label = "Address Label must be at least 2 characters.";
    } else if (address.label.trim().length > 300) {
      errors.label = "Address Label must not exceed 300 characters.";
    }
  }

  // Full Name - required, 2-30 characters
  if (!address.fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (address.fullName.trim().length < 2) {
    errors.fullName = "Full Name must be at least 2 characters.";
  } else if (address.fullName.trim().length > 30) {
    errors.fullName = "Full Name must not exceed 30 characters.";
  }

  // Mobile Number - required, exactly 10 digits
  const phone = address.phone.replace(/\s/g, "");

  if (!phone) {
    errors.phone = "Mobile number is required.";
  } else if (!/^[6-9]\d{9}$/.test(phone)) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }

  // Address Line 1 - required, 2-300 characters
  if (!address.addressLine1.trim()) {
    errors.addressLine1 = "Address Line 1 is required.";
  } else if (address.addressLine1.trim().length < 2) {
    errors.addressLine1 =
      "Address Line 1 must be at least 2 characters.";
  } else if (address.addressLine1.trim().length > 300) {
    errors.addressLine1 =
      "Address Line 1 must not exceed 300 characters.";
  }

  // Address Line 2 - optional, but if entered: 2-300 characters
  if (address.addressLine2.trim()) {
    if (address.addressLine2.trim().length < 2) {
      errors.addressLine2 =
        "Address Line 2 must be at least 2 characters.";
    } else if (address.addressLine2.trim().length > 300) {
      errors.addressLine2 =
        "Address Line 2 must not exceed 300 characters.";
    }
  }

  // State - required
  if (!address.state.trim() || !INDIAN_CITIES[address.state]) {
    errors.state = "State is required.";
  }

  // City - required
  if (!address.city.trim() || !INDIAN_CITIES[address.state]?.includes(address.city)) {
    errors.city = "City is required.";
  }

  // Pincode - required, exactly 6 digits
  if (!address.pincode) {
    errors.pincode = "Pincode is required.";
  } else if (!/^\d{6}$/.test(address.pincode)) {
    errors.pincode = "Pincode must contain exactly 6 digits.";
  }

  return errors;
}

function AddressForm({ initial = EMPTY_ADDRESS, onSave, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY_ADDRESS, ...initial });
  const [errors, setErrors] = useState({});

  function set(field) {
    return (event) => {
      const value = event.target.value;
      setForm((current) => ({
        ...current,
        [field]: value,
        ...(field === "state" && !INDIAN_CITIES[value]?.includes(current.city) ? { city: "" } : {}),
      }));
      setErrors((current) => ({ ...current, [field]: "" }));
      if (field === "state") setErrors((current) => ({ ...current, state: "", city: "" }));
    };
  }

  function handleSave() {
    const validationErrors = validateAddress(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    onSave(form);
  }

  return (
    <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 space-y-4">
      <Field label="Address Label" id="address-label" value={form.label} onChange={set("label")} placeholder="Home or Office (optional)" maxLength={300} error={errors.label} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" id="address-full-name" value={form.fullName} onChange={set("fullName")} error={errors.fullName} placeholder="Recipient name" required maxLength={30} />
        <Field label="Mobile Number" id="address-phone" type="tel" value={form.phone} onChange={(event) => set("phone")({ target: { value: event.target.value.replace(/\D/g, "").slice(0, 10) } })} error={errors.phone} placeholder="10-digit mobile" required maxLength={10} />
      </div>
      <Field label="Address Line 1" id="address-line-1" value={form.addressLine1} onChange={set("addressLine1")} error={errors.addressLine1} placeholder="House no., Street, Area" required maxLength={300} />
      <Field label="Address Line 2" id="address-line-2" value={form.addressLine2} onChange={set("addressLine2")} error={errors.addressLine2} placeholder="Landmark, Colony (optional)" maxLength={300} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SelectField label="City" id="address-city" value={form.city} onChange={set("city")} error={errors.city} options={INDIAN_CITIES[form.state] || []} placeholder="Select city" disabled={!form.state} required />
        <SelectField label="State" id="address-state" value={form.state} onChange={set("state")} error={errors.state} options={INDIAN_STATES} placeholder="Select state" required />
        <Field label="Pincode" id="address-pincode" value={form.pincode} onChange={(event) => set("pincode")({ target: { value: event.target.value.replace(/\D/g, "").slice(0, 6) } })} error={errors.pincode} placeholder="6-digit pincode" required maxLength={6} />
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={handleSave} className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-full text-sm">Save Address</button>
        <button type="button" onClick={onCancel} className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold px-5 py-2.5 rounded-full text-sm">Cancel</button>
      </div>
    </div>
  );
}
const TABS = [
  {
    id: "profile",
    label: "Profile",
    description: "Personal information",
    icon: User,
  },
  {
    id: "orders",
    label: "My Orders",
    description: "Track your purchases",
    icon: ShoppingBag,
  },
  {
    id: "addresses",
    label: "Addresses",
    description: "Manage delivery addresses",
    icon: MapPin,
  },
  {
    id: "wishlist",
    label: "Wishlist",
    description: "Your saved products",
    icon: Heart,
  },
];
function ProfileTab({
  user,
  updateProfile,
  deleteAccount,
  navigate,
}) {
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function set(field) {
    return (e) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    };
  }

  function validate() {
    const e = {};

    if (!form.name.trim()) {
      e.name = "Name is required.";
    } else if (form.name.trim().length < 2) {
      e.name = "Name must be at least 2 characters.";
    } else if (form.name.trim().length > 30) {
      e.name = "Name must not exceed 30 characters.";
    }

    if (
      form.phone &&
      !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))
    ) {
      e.phone = "Enter a valid 10-digit mobile number.";
    }

    return e;
  }

  function handleSave() {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    updateProfile({
      name: form.name.trim(),
      phone: form.phone,
    });

    setEditing(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  }

  return (
    <div className="space-y-5">

      {/* Personal Information */}
      <div className="bg-white rounded-2xl border border-brand-50 shadow-sm overflow-hidden">

        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-gray-900 text-lg">
              Personal Information
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Keep your account details up to date.
            </p>
          </div>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-sm text-brand-600 font-semibold hover:text-brand-800 transition-colors"
            >
              <Edit2 size={14} />
              Edit
            </button>
          )}
        </div>

        <div className="p-6">

          {success && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-5">
              <CheckCircle size={15} />
              Profile updated successfully!
            </div>
          )}

          {editing ? (
            <div className="space-y-4">

              <Field
                label="Full Name"
                id="edit-name"
                value={form.name}
                onChange={set("name")}
                error={errors.name}
                placeholder="Your full name"
                required
              />

              <Field
                label="Mobile Number"
                id="edit-phone"
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                error={errors.phone}
                placeholder="10-digit mobile number"
              />

              <div className="flex gap-3 pt-1">

                <button
                  onClick={handleSave}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => {
                    setEditing(false);

                    setForm({
                      name: user.name || "",
                      phone: user.phone || "",
                    });

                    setErrors({});
                  }}
                  className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
                >
                  Cancel
                </button>

              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {[
                {
                  label: "Full Name",
                  value: user.name || "Not added",
                  icon: User,
                },
                {
                  label: "Email Address",
                  value: user.email || "Not added",
                  icon: User,
                },
                {
                  label: "Mobile Number",
                  value: user.phone || "Not added",
                  icon: User,
                },
                {
                  label: "Member Since",
                  value: user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "N/A",
                  icon: Package,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-xl bg-gray-50 border border-gray-100 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      size={14}
                      className="text-brand-600"
                    />

                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {label}
                    </span>
                  </div>

                  <p className="text-sm text-gray-800 font-semibold break-words">
                    {value}
                  </p>
                </div>
              ))}

            </div>
          )}

        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">

        <div className="px-6 py-5 border-b border-red-50">
          <h2 className="font-heading font-bold text-gray-900 text-lg">
            Danger Zone
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Permanently delete your account and all associated data.
          </p>
        </div>

        <div className="p-6">

          {confirmDelete ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">

              <p className="text-sm font-semibold text-red-700 mb-3">
                Are you sure? This will permanently delete your account.
              </p>

              <div className="flex gap-3">

                <button
                  onClick={() => {
                    deleteAccount();
                    navigate("/");
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
                >
                  Yes, Delete Account
                </button>

                <button
                  onClick={() => setConfirmDelete(false)}
                  className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
                >
                  Cancel
                </button>

              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 text-sm text-red-600 font-semibold hover:text-red-800 border border-red-200 hover:border-red-400 px-4 py-2.5 rounded-full transition-colors"
            >
              <Trash2 size={14} />
              Delete Account
            </button>
          )}

        </div>
      </div>

    </div>
  );
}
function OrdersTab({ orders, TRACKING_STEPS, getTrackingStep }) {
  const [selected, setSelected] = useState(null);

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-brand-50 shadow-sm p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={30} className="text-brand-500" />
        </div>

        <h3 className="font-heading font-semibold text-gray-700 mb-2">
          No orders yet
        </h3>

        <p className="text-sm text-gray-500 mb-5">
          Your order history will appear here.
        </p>

        <Link
          to="/shop"
          className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  if (selected) {
    const step = getTrackingStep(selected.placedAt);

    return (
      <div className="space-y-5">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-sm text-brand-600 font-semibold hover:text-brand-800"
        >
          <ChevronRight size={14} className="rotate-180" />
          Back to Orders
        </button>

        <div className="bg-white rounded-2xl border border-brand-50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">
                  Order Details
                </span>

                <h2 className="font-heading font-bold text-gray-900 mt-1">
                  Order #{selected.id}
                </h2>

                <p className="text-sm text-gray-500 mt-0.5">
                  Placed on{" "}
                  {new Date(selected.placedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-0 mb-7 overflow-x-auto pb-2">
              {TRACKING_STEPS.map((s, i) => (
                <div key={s} className="flex items-center shrink-0">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        i <= step
                          ? "bg-brand-600 border-brand-600 text-white"
                          : "border-gray-200 text-gray-300"
                      }`}
                    >
                      {i < step ? <CheckCircle size={12} /> : i + 1}
                    </div>

                    <span
                      className={`text-[9px] font-medium text-center max-w-[52px] ${
                        i <= step ? "text-brand-700" : "text-gray-400"
                      }`}
                    >
                      {s}
                    </span>
                  </div>

                  {i < TRACKING_STEPS.length - 1 && (
                    <div
                      className={`w-8 sm:w-12 h-0.5 mx-1 mb-4 ${
                        i < step ? "bg-brand-400" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {selected.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-brand-50 shrink-0">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-bold text-brand-700">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-50 mt-5 pt-5 flex justify-between">
              <span className="font-heading font-bold text-gray-800">
                Total Paid
              </span>

              <span className="font-heading font-bold text-brand-700">
                {formatPrice(selected.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const step = getTrackingStep(order.placedAt);

        return (
          <button
            key={order.id}
            onClick={() => setSelected(order)}
            className="w-full bg-white rounded-2xl border border-brand-50 shadow-sm p-5 hover:border-brand-200 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-[10px] font-bold text-brand-600 uppercase">
                  Order
                </span>

                <p className="font-heading font-semibold text-gray-900">
                  #{order.id}
                </p>

                <p className="text-xs text-gray-500">
                  {new Date(order.placedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full">
                  {TRACKING_STEPS[step]}
                </span>

                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {order.items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="w-11 h-11 rounded-lg overflow-hidden bg-brand-50 border border-gray-100"
                >
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {order.items.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{order.items.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 pt-3">
              <span className="text-xs text-gray-500">
                {order.items.length} item
                {order.items.length > 1 ? "s" : ""}
              </span>

              <span className="text-sm font-bold text-brand-700">
                {formatPrice(order.total)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
function AddressesTab({
  addresses,
  addAddress,
  updateAddress,
  deleteAddress,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const { showToast } = useToast();

  function handleAdd(form) {
    addAddress(form);
    setShowForm(false);
    showToast("Address saved successfully", "success");
  }

  function handleEdit(form) {
    updateAddress(editId, form);
    setEditId(null);
    showToast("Address updated successfully", "success");
  }

  return (
    <div className="space-y-4">
      {addresses.map((addr) => (
        <div key={addr.id}>
          {editId === addr.id ? (
            <AddressForm
              initial={addr}
              onSave={handleEdit}
              onCancel={() => setEditId(null)}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-brand-50 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    <MapPin size={17} />
                  </div>

                  <div className="flex-1 min-w-0">
                    {addr.label && (
                      <span className="inline-block text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full mb-2">
                        {addr.label}
                      </span>
                    )}

                    <p className="font-semibold text-gray-800 text-sm">
                      {addr.fullName}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {addr.addressLine1}
                      {addr.addressLine2
                        ? `, ${addr.addressLine2}`
                        : ""}
                    </p>

                    <p className="text-sm text-gray-500">
                      {addr.city}, {addr.state} — {addr.pincode}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {addr.phone}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => setEditId(addr.id)}
                    className="p-2 rounded-full text-gray-400 hover:text-brand-600 hover:bg-brand-50"
                  >
                    <Edit2 size={14} />
                  </button>

                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {showForm ? (
        <AddressForm
          onSave={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-brand-200 hover:border-brand-400 text-brand-600 font-semibold py-4 rounded-2xl text-sm"
        >
          <Plus size={16} />
          Add New Address
        </button>
      )}

      {addresses.length === 0 && !showForm && (
        <div className="bg-white rounded-2xl border border-brand-50 shadow-sm text-center py-10">
          <MapPin size={25} className="text-brand-500 mx-auto mb-3" />

          <p className="text-sm font-semibold text-gray-700">
            No saved addresses
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Add an address for faster checkout.
          </p>
        </div>
      )}
    </div>
  );
}
function WishlistTab({
  wishlistItems,
  removeFromWishlist,
  addToCart,
  navigate,
}) {
  const { showToast } = useToast();

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-brand-50 shadow-sm p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
          <Heart size={30} className="text-rose-400" />
        </div>

        <h3 className="font-heading font-semibold text-gray-700 mb-2">
          Your wishlist is empty
        </h3>

        <p className="text-sm text-gray-500 mb-5">
          Save products you love and find them here.
        </p>

        <Link
          to="/shop"
          className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    if (!product) return;

    // Make sure the cart receives a normal product object
    const cartProduct = {
      ...product,
      quantity: 1,
    };

    addToCart(cartProduct);
    showToast(`${product.name} added to cart`, "cart");
  };

  const handleBuyNow = (product) => {
    if (!product) return;

    const cartProduct = {
      ...product,
      quantity: 1,
    };

    addToCart(cartProduct);
    showToast(`${product.name} added to cart`, "cart");
    navigate("/checkout");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {wishlistItems.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-2xl border border-brand-50 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-brand-100 transition-all"
        >
          {/* Product Image */}
          <div className="relative">
            <Link to={`/product/${product.slug}`}>
              <div className="h-48 bg-brand-50 overflow-hidden">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            {/* Remove Wishlist */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeFromWishlist(product.id);
                showToast(`${product.name} removed from wishlist`, "wishlist");
              }}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Remove from wishlist"
            >
              <X size={15} />
            </button>
          </div>

          {/* Product Information */}
          <div className="p-4 flex flex-col flex-1">
            <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-1">
              {product.category || "Natural Care"}
            </span>

            <Link
              to={`/product/${product.slug}`}
              className="font-heading font-semibold text-gray-800 text-sm mb-3 hover:text-brand-700 transition-colors line-clamp-2"
            >
              {product.name}
            </Link>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4 mt-auto">
              <span className="font-heading text-lg font-bold text-brand-700">
                {formatPrice(product.price)}
              </span>

              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                className="flex-1 text-xs font-semibold py-2.5 rounded-full border border-brand-600 text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer"
              >
                Add to Cart
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleBuyNow(product);
                }}
                className="flex-1 text-xs font-semibold py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white transition-colors cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();

  const {
    currentUser,
    isLoggedIn,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    deleteAccount,
  } = useAuth();

  const {
    orders,
    TRACKING_STEPS,
    getTrackingStep,
  } = useOrders();

  const {
    wishlistItems,
    removeFromWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState("profile");

  // =========================
  // NOT LOGGED IN
  // =========================
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#faf8f5] pt-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-3xl border border-brand-100 shadow-sm p-8">
            <div className="w-20 h-20 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-5">
              <User size={36} className="text-brand-600" />
            </div>

            <h1 className="font-heading text-2xl font-bold text-gray-900 mb-2">
              Sign in to your account
            </h1>

            <p className="text-gray-500 mb-6 text-sm">
              Access your orders, wishlist, and profile.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/login"
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className="border border-brand-200 text-brand-700 hover:bg-brand-50 font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const userOrders = orders.filter(
    (o) => !o.userId || o.userId === currentUser.id
  );

  const activeInfo = TAB_INFO[activeTab];
  const ActiveIcon = activeInfo.icon;

  return (
    <main className="min-h-screen bg-[#faf8f5] pt-16 lg:pt-20">
      <div className="flex min-h-[calc(100vh-5rem)]">

        {/* =====================================================
            LEFT SIDEBAR - FULL HEIGHT
        ====================================================== */}
        <aside
          className="
            hidden lg:flex
            w-[320px] xl:w-[350px]
            shrink-0
            bg-white
            border-r border-brand-100
            flex-col
            sticky
            top-20
            h-[calc(100vh-5rem)]
          "
        >
          {/* ================= PROFILE HEADER ================= */}
          <div className="px-5 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">

              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                <span className="font-heading text-lg font-bold text-white">
                  {currentUser.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>

              {/* User info */}
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">
                  My Account
                </p>

                <h1 className="font-heading text-base font-bold text-gray-900 truncate mt-0.5">
                  {currentUser.name}
                </h1>

                <p className="text-xs text-gray-500 truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>
          </div>

          {/* ================= SEARCH / ACCOUNT TITLE ================= */}
          <div className="px-4 py-4">
            <div className="bg-[#faf8f5] border border-brand-50 rounded-xl px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Account
              </p>

              <p className="text-sm font-semibold text-gray-700 mt-0.5">
                Manage your account
              </p>
            </div>
          </div>

          {/* ================= NAVIGATION ================= */}
          <nav className="px-3 flex-1 overflow-y-auto">

            {TABS.map(
              ({ id, label, description, icon: Icon }) => {
                const isActive = activeTab === id;

                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-3.5
                      rounded-xl
                      text-left
                      transition-all
                      duration-200
                      mb-1

                      ${
                        isActive
                          ? "bg-brand-50 text-brand-700 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-brand-700"
                      }
                    `}
                  >

                    {/* Icon */}
                    <div
                      className={`
                        w-10
                        h-10
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        shrink-0
                        transition-all

                        ${
                          isActive
                            ? "bg-brand-600 text-white shadow-sm"
                            : "bg-gray-100 text-gray-500"
                        }
                      `}
                    >
                      <Icon size={18} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`
                          text-sm
                          ${
                            isActive
                              ? "font-bold text-brand-700"
                              : "font-semibold text-gray-700"
                          }
                        `}
                      >
                        {label}
                      </p>

                      <p className="text-[10px] text-gray-400 truncate mt-0.5">
                        {description}
                      </p>
                    </div>

                    {/* Orders count */}
                    {id === "orders" && userOrders.length > 0 && (
                      <span className="min-w-6 h-6 px-1.5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold flex items-center justify-center">
                        {userOrders.length > 9
                          ? "9+"
                          : userOrders.length}
                      </span>
                    )}

                    {/* Wishlist count */}
                    {id === "wishlist" && wishlistItems.length > 0 && (
                      <span className="min-w-6 h-6 px-1.5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-bold flex items-center justify-center">
                        {wishlistItems.length > 9
                          ? "9+"
                          : wishlistItems.length}
                      </span>
                    )}

                    <ChevronRight
                      size={15}
                      className={`
                        shrink-0
                        transition-transform

                        ${
                          isActive
                            ? "text-brand-600 translate-x-0.5"
                            : "text-gray-300"
                        }
                      `}
                    />
                  </button>
                );
              }
            )}
          </nav>

          {/* ================= SIDEBAR FOOTER ================= */}
          <div className="p-4 border-t border-gray-100">

            {/* Wishlist summary */}
            <div className="rounded-xl bg-[#faf8f5] border border-brand-50 p-3 mb-3">
              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-brand-100 flex items-center justify-center">
                  <Heart
                    size={15}
                    className="text-brand-600"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">
                    Saved Products
                  </p>

                  <p className="text-xs font-semibold text-gray-700 truncate">
                    {wishlistItems.length} item
                    {wishlistItems.length !== 1 ? "s" : ""} in wishlist
                  </p>
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2
                px-4
                py-2.5
                rounded-xl
                border
                border-gray-200
                text-sm
                font-semibold
                text-gray-500
                hover:text-red-600
                hover:border-red-200
                hover:bg-red-50
                transition-all
              "
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* =====================================================
            MOBILE SIDEBAR / TOP MENU
        ====================================================== */}
        <div className="lg:hidden w-full">

          {/* Mobile account header */}
          <div className="bg-white border-b border-brand-100 px-4 py-4">
            <div className="flex items-center justify-between gap-3">

              <div className="flex items-center gap-3 min-w-0">

                <div className="w-11 h-11 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                  <span className="font-heading text-lg font-bold text-white">
                    {currentUser.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-600">
                    My Account
                  </p>

                  <h1 className="font-heading text-base font-bold text-gray-900 truncate">
                    {currentUser.name}
                  </h1>

                  <p className="text-xs text-gray-500 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="p-2.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                aria-label="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          {/* Mobile navigation */}
          <div className="bg-white border-b border-brand-100 px-3 py-2 overflow-x-auto">
            <div className="flex gap-2 min-w-max">

              {TABS.map(
                ({ id, label, icon: Icon }) => {
                  const isActive = activeTab === id;

                  return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2.5
                        rounded-full
                        text-sm
                        font-semibold
                        whitespace-nowrap
                        transition-all

                        ${
                          isActive
                            ? "bg-brand-600 text-white"
                            : "bg-gray-50 text-gray-600 hover:bg-brand-50 hover:text-brand-700"
                        }
                      `}
                    >
                      <Icon size={15} />
                      {label}

                      {id === "orders" && userOrders.length > 0 && (
                        <span
                          className={`
                            text-[10px]
                            min-w-5
                            h-5
                            px-1
                            rounded-full
                            flex
                            items-center
                            justify-center

                            ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-brand-100 text-brand-700"
                            }
                          `}
                        >
                          {userOrders.length > 9
                            ? "9+"
                            : userOrders.length}
                        </span>
                      )}

                      {id === "wishlist" &&
                        wishlistItems.length > 0 && (
                          <span
                            className={`
                              text-[10px]
                              min-w-5
                              h-5
                              px-1
                              rounded-full
                              flex
                              items-center
                              justify-center

                              ${
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-rose-100 text-rose-600"
                              }
                            `}
                          >
                            {wishlistItems.length > 9
                              ? "9+"
                              : wishlistItems.length}
                          </span>
                        )}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Mobile content */}
          <section className="px-4 py-5">

            {/* Section header */}
            <div className="bg-white rounded-2xl border border-brand-50 shadow-sm px-5 py-4 mb-5">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <ActiveIcon size={18} />
                </div>

                <div className="min-w-0">
                  <h2 className="font-heading font-bold text-gray-900 text-lg">
                    {activeInfo.title}
                  </h2>

                  <p className="text-xs text-gray-500 mt-0.5">
                    {activeInfo.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Tab content */}
            {activeTab === "profile" && (
              <ProfileTab
                user={currentUser}
                updateProfile={updateProfile}
                deleteAccount={deleteAccount}
                logout={logout}
                navigate={navigate}
              />
            )}

            {activeTab === "orders" && (
              <OrdersTab
                orders={userOrders}
                TRACKING_STEPS={TRACKING_STEPS}
                getTrackingStep={getTrackingStep}
              />
            )}

            {activeTab === "addresses" && (
              <AddressesTab
                addresses={currentUser.addresses || []}
                addAddress={addAddress}
                updateAddress={updateAddress}
                deleteAddress={deleteAddress}
              />
            )}

            {activeTab === "wishlist" && (
              <WishlistTab
                wishlistItems={wishlistItems}
                removeFromWishlist={removeFromWishlist}
                addToCart={addToCart}
                navigate={navigate}
              />
            )}
          </section>
        </div>

        {/* =====================================================
            DESKTOP RIGHT CONTENT
        ====================================================== */}
        <section className="hidden lg:block flex-1 min-w-0">

          {/* Content wrapper */}
          <div className="max-w-5xl mx-auto px-8 xl:px-12 py-8">

            {/* Section Header */}
            <div className="bg-white rounded-2xl border border-brand-50 shadow-sm px-6 py-5 mb-6">

              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <ActiveIcon size={19} />
                  </div>

                  <div>
                    <h2 className="font-heading font-bold text-gray-900 text-xl">
                      {activeInfo.title}
                    </h2>

                    <p className="text-sm text-gray-500 mt-0.5">
                      {activeInfo.description}
                    </p>
                  </div>

                </div>

                {/* Current section indicator */}
                <div className="hidden xl:flex items-center gap-2 text-xs text-gray-400">
                  <span>My Account</span>
                  <ChevronRight size={13} />
                  <span className="font-semibold text-brand-600">
                    {activeInfo.title}
                  </span>
                </div>
              </div>
            </div>

            {/* ================= TAB CONTENT ================= */}

            {activeTab === "profile" && (
              <ProfileTab
                user={currentUser}
                updateProfile={updateProfile}
                deleteAccount={deleteAccount}
                logout={logout}
                navigate={navigate}
              />
            )}

            {activeTab === "orders" && (
              <OrdersTab
                orders={userOrders}
                TRACKING_STEPS={TRACKING_STEPS}
                getTrackingStep={getTrackingStep}
              />
            )}

            {activeTab === "addresses" && (
              <AddressesTab
                addresses={currentUser.addresses || []}
                addAddress={addAddress}
                updateAddress={updateAddress}
                deleteAddress={deleteAddress}
              />
            )}

            {activeTab === "wishlist" && (
              <WishlistTab
                wishlistItems={wishlistItems}
                removeFromWishlist={removeFromWishlist}
                addToCart={addToCart}
                navigate={navigate}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}