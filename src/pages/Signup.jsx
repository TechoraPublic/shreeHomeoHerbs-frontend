import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Leaf,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";

function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  icon: Icon,
  rightEl,
  hint,
  maxLength,
  inputMode,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={id}
          maxLength={maxLength}
          inputMode={inputMode}
          className={`w-full ${
            Icon ? "pl-10" : "pl-4"
          } ${rightEl ? "pr-10" : "pr-4"} py-3 border rounded-xl text-sm text-gray-800 placeholder-gray-400 bg-white transition-all focus:outline-none focus:ring-2 ${
            error
              ? "border-red-400 focus:ring-red-100"
              : "border-gray-200 focus:border-brand-400 focus:ring-brand-100"
          }`}
        />

        {rightEl && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightEl}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={11} />
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="mt-1.5 text-xs text-gray-400">{hint}</p>
      )}
    </div>
  );
}

function PasswordStrength({ password }) {
  const checks = [
    { label: "8 characters", ok: password.length === 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="flex gap-3 mt-2">
      {checks.map(({ label, ok }) => (
        <div
          key={label}
          className={`flex items-center gap-1 text-[10px] font-medium ${
            ok ? "text-emerald-600" : "text-gray-400"
          }`}
        >
          <CheckCircle
            size={10}
            className={ok ? "text-emerald-500" : "text-gray-300"}
          />
          {label}
        </div>
      ))}
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};

    // Full Name: min 2, max 30
    const name = form.name.trim();

    if (!name) {
      e.name = "Full name is required.";
    } else if (name.length < 2) {
      e.name = "Name must be at least 2 characters.";
    } else if (name.length > 30) {
      e.name = "Name must not exceed 30 characters.";
    } else if (!/^[A-Za-z ]+$/.test(name)) {
      e.name = "Name can contain only letters and spaces.";
    }

    // Email: lowercase only, min 2, max 50
    const email = form.email.trim();

    if (!email) {
      e.email = "Email is required.";
    } else if (email.length < 2) {
      e.email = "Email must be at least 2 characters.";
    } else if (email.length > 50) {
      e.email = "Email must not exceed 50 characters.";
    } else if (email !== email.toLowerCase()) {
      e.email = "Email must contain only lowercase letters.";
    } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
      e.email = "Enter a valid email address.";
    }

    // Mobile: optional, but if entered exactly 10 digits
    const phone = form.phone.replace(/\s/g, "");

    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      e.phone = "Mobile number must be exactly 10 digits.";
    }

    // Password: exactly 8 characters
    if (!form.password) {
      e.password = "Password is required.";
    } else if (form.password.length !== 8) {
      e.password = "Password must be exactly 8 characters.";
    }

    // Confirm Password: exactly 8 + must match
    if (!form.confirm) {
      e.confirm = "Please confirm your password.";
    } else if (form.confirm.length !== 8) {
      e.confirm = "Confirm password must be exactly 8 characters.";
    } else if (form.confirm !== form.password) {
      e.confirm = "Passwords do not match.";
    }

    return e;
  }

  function handleChange(field) {
    return (e) => {
      let value = e.target.value;

      // Full Name: only letters and spaces
      if (field === "name") {
        value = value.replace(/[^A-Za-z ]/g, "").slice(0, 30);
      }

      // Email: lowercase only + max 50
      if (field === "email") {
        value = value.toLowerCase().slice(0, 50);
      }

      // Mobile: numbers only + max 10
      if (field === "phone") {
        value = value.replace(/\D/g, "").slice(0, 10);
      }

      // Password: max 8 characters
      if (field === "password") {
        value = value.slice(0, 8);
      }

      // Confirm Password: max 8 characters
      if (field === "confirm") {
        value = value.slice(0, 8);
      }

      setForm((f) => ({
        ...f,
        [field]: value,
      }));

      if (errors[field]) {
        setErrors((er) => ({
          ...er,
          [field]: "",
        }));
      }

      setServerError("");
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    await new Promise((r) => setTimeout(r, 400));

    const result = signup({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone,
    });

    setLoading(false);

    if (!result.ok) {
      setServerError(result.error);
      showToast(result.error, "error");
      return;
    }

    showToast("Account created successfully", "success");
    navigate("/profile");
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 justify-center">
            <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>

            <span className="font-heading text-xl font-bold text-brand-800">
              HerboNature
            </span>
          </Link>

          <h1 className="font-heading text-2xl font-bold text-gray-900 mt-5 mb-1">
            Create your account
          </h1>

          <p className="text-sm text-gray-500">
            Join HerboNature for a natural care experience
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-brand-100 p-8">
          {serverError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              <AlertCircle size={15} className="shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Full Name */}
            <Field
              label="Full Name"
              id="name"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Your full name"
              error={errors.name}
              icon={User}
              maxLength={30}
            />

            {/* Email */}
            <Field
              label="Email Address"
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
              error={errors.email}
              icon={Mail}
              maxLength={50}
            />

            {/* Mobile Number */}
            <Field
              label="Mobile Number"
              id="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="10-digit mobile number"
              error={errors.phone}
              icon={Phone}
              hint="Optional — used for order updates"
              maxLength={10}
              inputMode="numeric"
            />

            {/* Password */}
            <div>
              <Field
                label="Password"
                id="password"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={handleChange("password")}
                placeholder="Create a strong password"
                error={errors.password}
                icon={Lock}
                maxLength={8}
                rightEl={
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm Password */}
            <Field
              label="Confirm Password"
              id="confirm"
              type={showPw ? "text" : "password"}
              value={form.confirm}
              onChange={handleChange("confirm")}
              placeholder="Re-enter your password"
              error={errors.confirm}
              icon={Lock}
              maxLength={8}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-brand-200 mt-2"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-600 font-semibold hover:text-brand-800 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}