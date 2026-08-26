import { API_BASE_URL } from "./api";

let scriptPromise = null;

function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout script."));
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export async function startRazorpayCheckout({ amount, name, description, prefill = {}, onSuccess, onDismiss }) {
  await loadRazorpayScript();

  const res = await fetch(`${API_BASE_URL}/payment/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to create payment order.");
  }

  const rzp = new window.Razorpay({
    key: data.keyId,
    amount: data.order.amount,
    currency: data.order.currency,
    order_id: data.order.id,
    name: "HerboNature",
    description: description || "Order Payment",
    prefill,
    theme: { color: "#3f6d3f" },
    handler: (response) => onSuccess?.(response),
    modal: { ondismiss: () => onDismiss?.() },
  });

  rzp.open();
}
