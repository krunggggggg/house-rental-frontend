import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useNavigate, useParams } from "react-router-dom";
import { createTenant, updateTenant } from "../services/api";
import { getTenantById } from "../services/api";

const TenantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, error } = useSWR(id ? `/api/tenants/${id}` : null, () =>
    getTenantById(id)
  );

  const [formData, setFormData] = useState({
    full_name: "",
    contact_number: "",
    email: "",
    unit_number: "",
    monthly_rent: "",
    due_date: "1",
    number_of_occupants: "1",
    contract_start_date: new Date().toISOString().split("T")[0],
    receive_notifications: true,
  });

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (data?.tenant) {
      setFormData({
        ...data.tenant,
        contract_start_date:
          data.tenant.contract_start_date?.split("T")[0] || "",
      });
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormError("");
      if (id) {
        await updateTenant(id, formData);
      } else {
        await createTenant(formData);
      }
      navigate("/tenants");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setFormError(error.response.data.error);
      } else {
        setFormError("An unexpected error occurred while saving the tenant.");
      }
    }
  };

  if (error) return <p className="text-red-500">Failed to load tenant</p>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {id ? "Edit Tenant" : "Add New Tenant"}
        </h2>
        {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number *
            </label>
            <input
              type="tel"
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.contact_number}
              onChange={(e) =>
                setFormData({ ...formData, contact_number: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Number *
            </label>
            <input
              type="number"
              required
              min="1"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.unit_number}
              onChange={(e) =>
                setFormData({ ...formData, unit_number: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Rent (₱) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.monthly_rent}
                onChange={(e) =>
                  setFormData({ ...formData, monthly_rent: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Occupants
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.number_of_occupants}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    number_of_occupants: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Start Date
              </label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.contract_start_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contract_start_date: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="notifications"
              className="w-5 h-5 text-blue-600"
              checked={formData.receive_notifications}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  receive_notifications: e.target.checked,
                })
              }
            />
            <label htmlFor="notifications" className="text-gray-700">
              Enable Payment Reminders
            </label>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
            >
              {id ? "Update Tenant" : "Add Tenant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantForm;
