import React from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { getTenantById, getPaymentsByTenant } from "../services/api";
import PaymentForm from "./PaymentForm";
// import isEmpty from "lodash/isEmpty";

const TenantDetails = () => {
  const { tenantId } = useParams();
  const { data: tenantData, error: tenantError } = useSWR(
    `/api/tenants/${tenantId}`,
    () => getTenantById(tenantId)
  );
  const { data: payments, mutate } = useSWR(`/api/payments/${tenantId}`, () =>
    getPaymentsByTenant(tenantId)
  );

  const handlePaymentAdded = async (newPayment) => {
    mutate([...(payments?.data || []), newPayment]);
  };

  if (tenantError)
    return <div className="text-red-500">Failed to load tenant details.</div>;
  if (!tenantData)
    return <div className="text-gray-500">Loading tenant details...</div>;

  const tenant = tenantData.tenant;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Tenant Information Card */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Tenant Details
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Full Name</p>
            <p className="text-lg text-gray-800">{tenant.full_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Contact Number</p>
            <p className="text-lg text-gray-800">{tenant.contact_number}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Email</p>
            <p className="text-lg text-gray-800">{tenant.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Unit Number</p>
            <p className="text-lg text-gray-800">{tenant.unit_number}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Monthly Rent</p>
            <p className="text-lg text-gray-800">₱{tenant.monthly_rent}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Due Date</p>
            <p className="text-lg text-gray-800">{tenant.due_date}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">
              Number of Occupants
            </p>
            <p className="text-lg text-gray-800">
              {tenant.number_of_occupants}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">
              Contract Start Date
            </p>
            <p className="text-lg text-gray-800">
              {new Date(tenant.contract_start_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">
              Receive Notifications
            </p>
            <p className="text-lg text-gray-800">
              {tenant.receive_notifications ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>

      {/* Payment History Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Payment History
        </h2>
        {payments?.data.length === 0 ? (
          <p className="text-gray-500">No payments recorded yet</p>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="py-2 text-sm font-medium text-gray-600">Date</th>
                <th className="py-2 text-sm font-medium text-gray-600">
                  Amount Paid
                </th>
                <th className="py-2 text-sm font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {payments?.data.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-200">
                  <td className="py-2 text-gray-800">
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </td>
                  <td className="py-2 text-gray-800">₱{payment.amount_paid}</td>
                  <td className="py-2 text-gray-800">
                    {payment.is_paid ? (
                      <span className="text-green-600 font-medium">Paid</span>
                    ) : (
                      <span className="text-red-600 font-medium">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Payment Form */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Add New Payment
        </h3>
        <PaymentForm id={tenantId} onPaymentAdded={handlePaymentAdded} />
      </div>
    </div>
  );
};

export default TenantDetails;
