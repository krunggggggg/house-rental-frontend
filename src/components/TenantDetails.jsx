import React from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { getTenantById, getPaymentsByTenant } from "../services/api";
import PaymentForm from "./PaymentForm";
import isEmpty from "lodash/isEmpty";

const TenantDetails = () => {
  const { tenantId } = useParams();

  const { data: tenantData } = useSWR(`/api/tenants/${tenantId}`, () =>
    getTenantById(tenantId)
  );

  const { data: payments, mutate } = useSWR(`/api/payments/${tenantId}`, () =>
    getPaymentsByTenant(tenantId)
  );

  console.log("a", process.env.REACT_APP_DB_HOST, process.env);
  const handlePaymentAdded = async (newPayment) => {
    mutate([...payments, newPayment]);
  };

  if (!tenantData && isEmpty(payments?.data))
    return <div>Loading tenant details...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-2xl font-bold mb-2">
          {tenantData.tenant.full_name}
        </h2>
        {/* Other tenant details */}
      </div>

      <PaymentForm tenantId={tenantId} onPaymentAdded={handlePaymentAdded} />

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Payment History</h3>
        {payments?.length === 0 ? (
          <p className="text-gray-500">No payments recorded yet</p>
        ) : (
          <table className="min-w-full bg-white border">
            {/* Payment table headers */}
            <tbody>
              {payments?.data.map((payment) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TenantDetails;
