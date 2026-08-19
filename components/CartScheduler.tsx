"use client";
import { useState } from "react";

export default function CartScheduler() {
  const [selectedDate, setSelectedDate] = useState("");

  // Helper to check if date is Friday (5) or Saturday (6)
  const isValidDeliveryDate = (dateString: string) => {
    const day = new Date(dateString).getDay();
    return day === 5 || day === 6;
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm mt-4">
      <h3 className="font-semibold text-gray-800 mb-2">Select Delivery Date</h3>
      <input
        type="date"
        className="w-full p-3 border border-gray-200 rounded-lg"
        onChange={(e) => {
          if (!isValidDeliveryDate(e.target.value)) {
            alert("Deliveries are only available on Fridays and Saturdays.");
            e.target.value = "";
          } else {
            setSelectedDate(e.target.value);
          }
        }}
      />
      <p className="text-xs text-gray-500 mt-2">
        Only upcoming Fridays & Saturdays are allowed.
      </p>

      <button className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl mt-6">
        Proceed to Checkout
      </button>
    </div>
  );
}
