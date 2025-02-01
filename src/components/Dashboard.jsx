import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { getDashboardMetrics } from "../services/api";
import DueAlerts from "./DueAlerts";

Chart.register(...registerables);

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalTenants: 0,
    monthlyProjection: 0,
    upcomingDueDates: [],
  });

  useEffect(() => {
    const loadMetrics = async () => {
      const { data } = await getDashboardMetrics();
      setMetrics(data);
    };
    loadMetrics();
  }, []);

  const chartData = {
    labels: ["Active Tenants", "Monthly Projection"],
    datasets: [
      {
        label: "Key Metrics",
        data: [metrics.totalTenants, metrics.monthlyProjection],
        backgroundColor: ["#3B82F6", "#10B981"],
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Total Active Tenants</h3>
          <p className="text-4xl text-blue-600">{metrics.totalTenants}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">
            Monthly Rent Projection
          </h3>
          <p className="text-4xl text-green-600">
            ₱{metrics.monthlyProjection?.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Metrics Overview</h3>
          <Bar data={chartData} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Upcoming Due Dates</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Tenant</th>
                  <th className="px-4 py-2 text-left">Due Date</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {metrics.upcomingDueDates?.map((tenant) => (
                  <tr key={tenant.tenantid} className="border-t">
                    <td className="px-4 py-2">{tenant.fullname}</td>
                    <td className="px-4 py-2">{tenant.duedate}</td>
                    <td className="px-4 py-2">₱{tenant.monthlyrent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <DueAlerts />
      </div>
    </div>
  );
};

export default Dashboard;
