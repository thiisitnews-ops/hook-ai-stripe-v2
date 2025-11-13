import React, { useState } from "react";
import { PRICING_PLANS } from "../constants";
import { CheckIcon } from "./icons";

export const PricingSection: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (priceId: string) => {
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
        alert("Checkout failed. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Error starting checkout. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
          Choose Your Plan
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          Start free, then upgrade anytime.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.name}
            className="rounded-2xl border-2 border-gray-700 bg-gray-800 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
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
              className="w-full mt-10 py-3 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-transform transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Choose Plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
