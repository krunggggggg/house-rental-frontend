import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// export const getTenants = async (params = {}) => {
//   try {
//     const response = await api.get("/tenants", {
//       params: {
//         search: params.search,
//         active: params.active,
//         sortBy: params.sortBy,
//         sortOrder: params.sortOrder,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching tenants:", error);
//     throw error;
//   }
// };
export const createTenant = (data) => api.post("/tenants", data);
export const deleteTenant = async (id) => {
  try {
    const response = await api.delete(`/tenants/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tenants:", error);
    throw error;
  }
};
export const getTenantById = async (id) => {
  try {
    const response = await api.get(`/tenants/${id}`);
    console.log("iresponsed", response);

    return response.data;
  } catch (error) {
    console.error("Error fetching tenants:", error);
    throw error;
  }
};

export const getPaymentsByTenant = async (tenantId) => {
  try {
    const response = await api.get(`/payments/${tenantId}`);
    console.log("iresponsed", response);

    return response.data;
  } catch (error) {
    console.error("Error fetching tenants:", error);
    throw error;
  }
};

export const getAllTenants = async (params) => {
  try {
    console.log("Sending request with params:", params);

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null && v !== "")
    );

    const response = await api.get("/tenants", { params: filteredParams });
    console.log("API response:", response.data);

    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getAllPayments = () => api.get("/payments");

export const updateTenant = (id, data) => api.put(`/tenants/${id}`, data);

export const getDashboardMetrics = () => api.get("/dashboard/metrics");

export const getPayments = (tenantId) => api.get(`/payments/${tenantId}`);

export const createPayment = (tenantId, paymentData) =>
  api.post(`/payments/${tenantId}`, paymentData);
