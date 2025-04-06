import React, { useState } from "react";
import useSWR from "swr";
import { createPayment, getPayments } from "../services/api";
import { saveAs } from "file-saver";

const PaymentHistory = ({ tenantId }) => {
  // State for new payment form
  const [newPayment, setNewPayment] = useState({
    payment_start_date: new Date().toISOString().split("T")[0],
    payment_end_date: new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toISOString()
      .split("T")[0],
    amount_paid: "",
    is_paid: false,
  });

  // Fetch payments using SWR
  const {
    data: paymentsData,
    error,
    mutate,
  } = useSWR(
    tenantId ? `/api/payments/${tenantId}` : null, // Only fetch if tenantId exists
    () => getPayments(tenantId) // Use the getPayments function as the fetcher
  );

  console.log("paymentsData", paymentsData);

  // Extract payments from the API response
  const payments = paymentsData?.data || []; // Extract the "payments" key

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new payment
      await createPayment({ ...newPayment, tenant_id: tenantId });

      // Revalidate the SWR cache to fetch updated payments
      await mutate();

      // Reset the form
      setNewPayment({
        payment_start_date: new Date().toISOString().split("T")[0],
        payment_end_date: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        )
          .toISOString()
          .split("T")[0],
        amount_paid: "",
        is_paid: false,
      });
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  // Handle receipt download
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

  // Loading state
  if (!paymentsData) return <div className="p-4">Loading payments...</div>;

  // Error state
  if (error)
    return <div className="text-red-500 p-4">Error loading payments</div>;

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Payment History</h3>

      {/* Payment Table */}
      <div className="overflow-x-auto">
        {Array.isArray(payments) && payments.length > 0 ? (
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Date Range</th>
                <th className="py-2 px-4 border">Amount</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.payment_id}>
                  <td className="py-2 px-4 border">
                    {`${new Date(
                      payment.payment_start_date
                    ).toLocaleDateString()} - ${new Date(
                      payment.payment_end_date
                    ).toLocaleDateString()}`}
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
        ) : (
          <div className="text-center text-gray-500 p-4">
            No payment history available.
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
