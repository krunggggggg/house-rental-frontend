import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useNavigate, useParams } from "react-router-dom";
import { createTenant, updateTenant } from "../services/api";
import { getTenantById } from "../services/api"; // Ensure API instance is imported

const TenantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch tenant data using SWR if `id` exists
  const { data, error } = useSWR(id ? `/api/tenants/${id}` : null, () =>
    getTenantById(id)
  );

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    contact_number: "",
    email: "",
    monthly_rent: "",
    due_date: "1",
    number_of_occupants: "1",
    contract_start_date: new Date().toISOString().split("T")[0],
    receive_notifications: true,
  });

  console.log("data", data, id);

  // Update form data when SWR fetches the tenant data
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
      if (id) {
        await updateTenant(id, formData);
      } else {
        await createTenant(formData);
      }
      navigate("/tenants");
    } catch (error) {
      alert("Error saving tenant");
    }
  };

  if (error) return <p className="text-red-500">Failed to load tenant</p>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">
        {id ? "Edit Tenant" : "Add New Tenant"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="notifications"
            className="w-4 h-4"
            checked={formData.receive_notifications}
            onChange={(e) =>
              setFormData({
                ...formData,
                receive_notifications: e.target.checked,
              })
            }
          />
          <label htmlFor="notifications">Enable Payment Reminders</label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Monthly Rent (₱) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="w-full p-2 border rounded"
              value={formData.monthly_rent}
              onChange={(e) =>
                setFormData({ ...formData, monthly_rent: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Due Date *</label>
            <select
              className="w-full p-2 border rounded"
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
            <label className="block text-sm font-medium mb-1">
              Number of Occupants
            </label>
            <input
              type="number"
              min="1"
              className="w-full p-2 border rounded"
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
            <label className="block text-sm font-medium mb-1">
              Contract Start Date
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded"
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

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {id ? "Update Tenant" : "Add Tenant"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TenantForm;
