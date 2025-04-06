import React, { useState } from "react";
import { createPayment } from "../services/api";
import { useParams } from "react-router-dom";

const PaymentForm = ({ id, onPaymentAdded = () => {} }) => {
  const { tenantId } = useParams();
  const test = id ? id : tenantId;

  console.log("tenantId", tenantId);
  const [formData, setFormData] = useState({
    amount_paid: "",
    payment_start_date: new Date().toISOString().split("T")[0],
    payment_end_date: new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toISOString()
      .split("T")[0],
    is_paid: false,
  });

  const [isLoading, setIsLoading] = useState(false); // For loading state
  const [error, setError] = useState(""); // For error handling

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate form data
      if (
        !formData.amount_paid ||
        !formData.payment_start_date ||
        !formData.payment_end_date
      ) {
        setError("Please fill in all required fields.");
        setIsLoading(false);
        return;
      }

      // Create the payment
      const newPayment = await createPayment(test, formData);
      console.log("a", newPayment.data);
      onPaymentAdded(newPayment.data);

      // Reset form data
      setFormData({
        amount_paid: "",
        payment_start_date: new Date().toISOString().split("T")[0],
        payment_end_date: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        )
          .toISOString()
          .split("T")[0],
        is_paid: false,
      });
    } catch (error) {
      console.error("Payment error:", error);
      setError("Failed to record payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Record New Payment
      </h3>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Paid */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount Paid
          </label>
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={formData.amount_paid}
            onChange={(e) =>
              setFormData({ ...formData, amount_paid: e.target.value })
            }
            required
          />
        </div>

        {/* Payment Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Start Date
          </label>
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={formData.payment_start_date}
            onChange={(e) =>
              setFormData({ ...formData, payment_start_date: e.target.value })
            }
            required
          />
        </div>

        {/* Payment End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment End Date
          </label>
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={formData.payment_end_date}
            onChange={(e) =>
              setFormData({ ...formData, payment_end_date: e.target.value })
            }
            required
          />
        </div>

        {/* Mark as Paid Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_paid}
            onChange={(e) =>
              setFormData({ ...formData, is_paid: e.target.checked })
            }
            className="h-5 w-5 text-blue-500 rounded"
          />
          <label className="text-sm text-gray-700">Mark as fully paid</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 text-white rounded-md ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Recording Payment..." : "Record Payment"}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
