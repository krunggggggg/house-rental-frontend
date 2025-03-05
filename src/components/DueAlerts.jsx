import React from "react";

const DueAlerts = ({ upcomingDueDates }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "overdue":
        return "bg-red-100 text-red-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100";
    }
  };

  const getStatusText = (status, days) => {
    switch (status) {
      case "overdue":
        return `${days} days overdue`;
      case "upcoming":
        return `${days} days until due`;
      default:
        return `Due in ${days} days`;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Payment Status</h3>
      <div className="space-y-2">
        {upcomingDueDates.map((tenant) => (
          <div
            key={tenant.tenant_id}
            className={`p-3 rounded-lg ${getStatusStyle(tenant.status)}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{tenant.full_name}</p>
                <p className="text-sm">
                  Due:{" "}
                  {new Date(tenant.due_date).toLocaleDateString("en-PH", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ₱{tenant.monthly_rent?.toLocaleString()}
                </p>
                <p className="text-sm">
                  {getStatusText(tenant.status, tenant.days_diff)}
                </p>
              </div>
            </div>
          </div>
        ))}
        {upcomingDueDates.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No upcoming payments in the next 5 days
          </p>
        )}
      </div>
    </div>
  );
};

export default DueAlerts;
