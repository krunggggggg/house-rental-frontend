import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { getAllTenants, deleteTenant } from "../services/api";
import PaymentHistory from "./PaymentHistory";
import SearchFilters from "./SearchFilter";
import { useDebounce } from "../hooks/useDebounce"; // Ensure this is implemented
import isUndefined from "lodash/isUndefined";
import { PlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

const TenantList = () => {
  const navigate = useNavigate();
  const [expandedTenant, setExpandedTenant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data, error, mutate } = useSWR(
    () => {
      const params = {};
      if (debouncedSearchTerm) params.search = debouncedSearchTerm;
      if (isActiveFilter) params.active = isActiveFilter;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;
      return params;
    },
    getAllTenants,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  console.log("SWR data:", data, "Error:", error);

  const handleDelete = async (id) => {
    try {
      await deleteTenant(id);
      mutate(
        (prevData) => ({
          ...prevData,
          tenants: prevData.tenants.filter((tenant) => tenant.tenant_id !== id),
        }),
        false
      );
      mutate();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handlePaymentHistoryClick = (tenantId) => {
    setExpandedTenant(expandedTenant === tenantId ? null : tenantId);
  };

  const handleEditClick = (tenantId) => navigate(`edit/${tenantId}`);

  const handleTenantRowClick = (tenantId) => {
    navigate(`/tenants/${tenantId}`);
  };

  const stopPropagationAndCall = (callback) => (e) => {
    e.stopPropagation();
    callback();
  };

  if (error)
    return <div className="text-red-500 p-4">Error loading tenants</div>;
  if (isUndefined(data)) return <div className="p-4">Loading tenants...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tenant List</h2>
        <button
          onClick={() => navigate("add")}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Add New Tenant
        </button>
      </div>
      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isActiveFilter={isActiveFilter}
        setIsActiveFilter={setIsActiveFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Monthly Rent</th>
              <th className="py-2 px-4 border">Due Date</th>
              <th className="py-2 px-4 border">Occupants</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.tenants?.map((tenant) => (
              <React.Fragment key={tenant.tenant_id}>
                <tr onClick={() => handleTenantRowClick(tenant.tenant_id)}>
                  <td className="py-2 px-4 border">{tenant.full_name}</td>
                  <td className="py-2 px-4 border">₱{tenant.monthly_rent}</td>
                  <td className="py-2 px-4 border">{tenant.due_date}</td>
                  <td className="py-2 px-4 border">
                    {tenant.number_of_occupants}
                  </td>
                  <td className="py-2 px-4 border">
                    <div className="flex gap-2">
                      <button
                        onClick={stopPropagationAndCall(() =>
                          navigate("/payments")
                        )}
                        className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                      >
                        View All Payments
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      {/* Edit Button */}
                      <button
                        className="flex items-center gap-2"
                        onClick={stopPropagationAndCall(() =>
                          handleEditClick(tenant.tenant_id)
                        )}
                      >
                        <PencilSquareIcon className="size-6 text-blue-500" />
                      </button>

                      {/* Toggle Payment History Button */}
                      <button
                        onClick={stopPropagationAndCall(() =>
                          handlePaymentHistoryClick(tenant.tenant_id)
                        )}
                        className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                      >
                        {expandedTenant === tenant.tenant_id ? "Hide" : "Show"}{" "}
                        Payments
                      </button>

                      <button
                        className="flex items-center gap-2"
                        onClick={stopPropagationAndCall(() =>
                          navigate(`/tenants/${tenant.tenant_id}/payments`)
                        )}
                      >
                        <PlusIcon className="size-6 text-blue-500" />
                      </button>

                      <button
                        onClick={stopPropagationAndCall(() =>
                          handleDelete(tenant.tenant_id)
                        )}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedTenant === tenant.tenant_id && (
                  <tr>
                    <td colSpan="5" className="p-4 bg-gray-50">
                      <PaymentHistory tenantId={tenant.tenant_id} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <Outlet />
    </div>
  );
};

export default TenantList;
