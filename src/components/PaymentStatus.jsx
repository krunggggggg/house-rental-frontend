import React from "react";
import useSWR from "swr";
import { getPayments } from "../services/api";

const PaymentStatus = ({ tenantId }) => {
  const { data } = useSWR(`${tenantId}`, getPayments);

  const totalPaid =
    data?.reduce((sum, payment) => sum + payment.amount_paid, 0) || 0;

  const monthlyRent = data?.[0]?.tenant?.monthly_rent || 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Payment Status</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Monthly Rent:</span>
          <span>₱{monthlyRent}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Paid:</span>
          <span>₱{totalPaid}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Remaining:</span>
          <span
            className={
              totalPaid >= monthlyRent ? "text-green-600" : "text-red-600"
            }
          >
            ₱{Math.max(monthlyRent - totalPaid, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
