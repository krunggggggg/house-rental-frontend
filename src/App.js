import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TenantList from "./components/TenantList";
import TenantForm from "./components/TenantForm";
import Dashboard from "./components/Dashboard";
import PaymentTable from "./components/PaymentTable";
import PaymentForm from "./components/PaymentForm";
import TenantDetails from "./components/TenantDetails";
import Sidebar from "./components/Sidebar";
import { Menu } from "lucide-react";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(false)}
        />
        <div className="flex-1 p-4 md:ml-64">
          <button
            className="md:hidden mb-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          {/* prettier-ignore */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tenants">
              <Route index element={<TenantList />} />
              <Route path="add" element={<TenantForm />} />
              <Route path="edit/:id" element={<TenantForm />} />
            </Route>
            <Route path="/payments" element={<PaymentTable />} />
            <Route
              path="/tenants/:tenantId/payments"
              element={<PaymentForm />}
            />
            <Route path="/tenants/:tenantId" element={<TenantDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
