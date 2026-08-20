import { useState } from "react";

import { Link, useNavigate, useLocation } from "react-router-dom";

import { Eye, EyeOff, Leaf, Mail, Lock, AlertCircle } from "lucide-react";

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
  maxLength,
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
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const from = location.state?.from || "/profile";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};

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
    } else if (
      !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)
    ) {
      e.email = "Enter a valid email address.";
    }

    // Password: exactly 8 characters
    if (!form.password) {
      e.password = "Password is required.";
    } else if (form.password.length !== 8) {
      e.password = "Password must be exactly 8 characters.";
    }

    return e;
  }

  function handleChange(field) {
    return (e) => {
      let value = e.target.value;

      // Email: lowercase + maximum 50 characters
      if (field === "email") {
        value = value.toLowerCase().slice(0, 50);
      }

      // Password: maximum 8 characters
      if (field === "password") {
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

    const result = login(form);

    setLoading(false);

    if (!result.ok) {
      setServerError(result.error);
      showToast(result.error, "error");
      return;
    }

    showToast("Signed in successfully", "success");
    navigate(from, { replace: true });
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 justify-center"
          >
            <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>

            <span className="font-heading text-xl font-bold text-brand-800">
              HerboNature
            </span>
          </Link>

          <h1 className="font-heading text-2xl font-bold text-gray-900 mt-5 mb-1">
            Welcome back
          </h1>

          <p className="text-sm text-gray-500">
            Sign in to your account to continue
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

            {/* Password */}
            <Field
              label="Password"
              id="password"
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={handleChange("password")}
              placeholder="Enter your password"
              error={errors.password}
              icon={Lock}
              maxLength={8}
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={
                    showPw ? "Hide password" : "Show password"
                  }
                >
                  {showPw ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              }
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-brand-200 mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-brand-600 font-semibold hover:text-brand-800 transition-colors"
            >
              Create one
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}