import React, { useEffect, useState } from "react";
import { getPayments, createPayment } from "../services/api";
import { saveAs } from "file-saver";

const PaymentHistory = ({ tenantId }) => {
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({
    payment_date: new Date().toISOString().split("T")[0],
    amount_paid: "",
    is_paid: false,
  });

  useEffect(() => {
    const loadPayments = async () => {
      const { data } = await getPayments(tenantId);
      setPayments(data);
    };
    loadPayments();
  }, [tenantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPayment({ ...newPayment, tenant_id: tenantId });
      const { data } = await getPayments(tenantId);
      setPayments(data);
      setNewPayment({
        payment_date: new Date().toISOString().split("T")[0],
        amount_paid: "",
        is_paid: false,
      });
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  // Add receipt download handler
  const handleDownloadReceipt = async (paymentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/receipts/${paymentId}`
      );
      const blob = await response.blob();
      saveAs(blob, `receipt-${paymentId}.pdf`);
    } catch (error) {
      console.error("Receipt download error:", error);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Payment History</h3>

      <form
        onSubmit={handleSubmit}
        className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-2"
      >
        {/* Existing form inputs remain the same */}
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Receipt</th> {/* New column */}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.payment_id}>
                <td className="py-2 px-4 border">
                  {new Date(payment.payment_date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border">₱{payment.amount_paid}</td>
                <td className="py-2 px-4 border">
                  <span
                    className={`px-2 py-1 rounded ${
                      payment.is_paid
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payment.is_paid ? "Paid" : "Pending"}
                  </span>
                </td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => handleDownloadReceipt(payment.payment_id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
