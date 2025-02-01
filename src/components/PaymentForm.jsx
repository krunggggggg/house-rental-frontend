import React, { useState } from "react";
import { createPayment } from "../services/api";

const PaymentForm = ({ tenantId, onPaymentAdded }) => {
  const [formData, setFormData] = useState({
    amount_paid: "",
    payment_date: new Date().toISOString().split("T")[0],
    is_paid: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPayment = await createPayment(tenantId, formData);
      onPaymentAdded(newPayment.data);
      setFormData({
        amount_paid: "",
        payment_date: new Date().toISOString().split("T")[0],
        is_paid: false,
      });
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="text-lg font-semibold mb-2">Record New Payment</h3>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="number"
          placeholder="Amount"
          className="w-full p-2 border rounded"
          value={formData.amount_paid}
          onChange={(e) =>
            setFormData({ ...formData, amount_paid: e.target.value })
          }
          required
        />
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={formData.payment_date}
          onChange={(e) =>
            setFormData({ ...formData, payment_date: e.target.value })
          }
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_paid}
            onChange={(e) =>
              setFormData({ ...formData, is_paid: e.target.checked })
            }
          />
          <label>Mark as fully paid</label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Record Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
