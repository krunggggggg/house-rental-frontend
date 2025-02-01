// src/components/DueAlerts.jsx
import React from "react";
import useSWR from "swr";
import { getTenants } from "../services/api";

const DueAlerts = () => {
  const { data } = useSWR("/api/tenants/due", getTenants);

  console.log();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-2">Upcoming Due Dates</h3>
      <div className="space-y-2">
        {data?.map((tenant) => (
          <div
            key={tenant.tenant_id}
            className="flex justify-between items-center p-2 bg-orange-50 rounded"
          >
            <div>
              <p className="font-medium">{tenant.full_name}</p>
              <p className="text-sm">Due on {tenant.due_date}</p>
            </div>
            <span className="text-orange-600">₱{tenant.monthly_rent}</span>
          </div>
        ))}
        {data?.length === 0 && (
          <p className="text-gray-500">No upcoming due dates</p>
        )}
      </div>
    </div>
  );
};

export default DueAlerts;
