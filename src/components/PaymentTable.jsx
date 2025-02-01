import React, { useState } from "react";
import useSWR from "swr";
import { saveAs } from "file-saver";
import { getPayments } from "../services/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PaymentTable = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, error } = useSWR(
    `?start=${startDate?.toISOString()}&end=${endDate?.toISOString()}&status=${statusFilter}`,
    getPayments
  );
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

  if (error)
    return <div className="text-red-500 p-4">Error loading payments</div>;
  if (!data) return <div className="p-4">Loading payments...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Payments</h2>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Start Date"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="End Date"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <select
            className="w-full p-2 border rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Tenant</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {data.payments?.map((payment) => (
              <tr key={payment.payment_id}>
                <td className="py-2 px-4 border">
                  {new Date(payment.payment_date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border">
                  {payment.tenant?.full_name}
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

export default PaymentTable;
