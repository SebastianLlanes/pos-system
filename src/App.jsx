import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./modules/auth/pages/LoginPage";
import PrivateRoute from "./app/routes/PrivateRoute";
import AdminLayout from "./app/layout/AdminLayout";
import ProductsPage from "./modules/products/pages/ProductsPage";
import SalesPage from "./modules/sales/pages/SalesPage";
import CashPage from "./modules/cash/pages/CashPage";
import BackupPage from "./modules/backup/pages/BackupPage";
// Páginas (las iremos creando por etapa)
// import DashboardPage from "./modules/dashboard/pages/DashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      
      <Route
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Navigate to="/sales" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/cash" element={<CashPage />} />
        <Route path="/backup" element={<BackupPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;