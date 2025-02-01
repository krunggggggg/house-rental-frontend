import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TenantList from "./components/TenantList";
import TenantForm from "./components/TenantForm";
import Dashboard from "./components/Dashboard";
import PaymentTable from "./components/PaymentTable";
import PaymentForm from "./components/PaymentForm";
import TenantDetails from "./components/TenantDetails";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tenants" element={<TenantList />} />
          <Route path="/add" element={<TenantForm />} />
          <Route path="/edit/:id" element={<TenantForm />} />
          <Route path="/payments" element={<PaymentTable />} />
          <Route path="/tenants/:tenantId/payments" element={<PaymentForm />} />
          <Route path="/tenants/:tenantId" element={<TenantDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
