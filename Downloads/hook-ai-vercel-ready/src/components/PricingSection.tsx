import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useSubscription } from "../hooks/useSubscription";
import { PRICING_PLANS } from "../constants";
import { CheckIcon } from "./icons";

export const PricingSection: React.FC = () => {
  const { user } = useAuth();
  const { plan } = useSubscription();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (priceId: string) => {
    if (!user) {
      alert("Please sign in to continue.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Unable to start checkout. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("An error occurred. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
          Choose a plan that’s right for you
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          Start for free, upgrade anytime.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border-2 p-8 bg-gray-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
              plan.name === "Pro"
                ? "border-cyan-500 shadow-cyan-500/20"
                : "border-gray-700"
            }`}
          >
            <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
            <p className="mt-2 text-gray-400">{plan.bestFor}</p>
            <div className="mt-6">
              <span className="text-5xl font-extrabold text-white">
                ${plan.price}
              </span>
              <span className="text-base font-medium text-gray-400">
                /month
              </span>
            </div>

            <ul className="mt-8 space-y-4 flex-grow">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start text-gray-300">
                  <CheckIcon />
                  <span className="ml-3">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(plan.priceId)}
              disabled={loading}
              className="w-full mt-10 py-3 px-6 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-transform transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Choose Plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
