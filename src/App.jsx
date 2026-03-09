import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./modules/auth/pages/LoginPage";
import PrivateRoute from "./app/routes/PrivateRoute";
import AdminLayout from "./app/layout/AdminLayout";
import ProductsPage from "./modules/products/pages/ProductsPage";
import SalesPage from "./modules/sales/pages/SalesPage";
import CashPage from "./modules/cash/pages/CashPage";
import BackupPage from "./modules/backup/pages/BackupPage";
import RoleRoute from "./app/routes/RoleRoute";
import UsersPage from "./modules/users/pages/UsersPage";

function App() {
  const isMobile = window.innerWidth <= 768;

  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas */}
      <Route
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route
          path="/"
          element={<Navigate to={isMobile ? "/cash" : "/sales"} replace />}
        />
        <Route path="/sales"    element={<SalesPage />}    />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cash"     element={<CashPage />}     />
        <Route
          path="/backup"
          element={
            <RoleRoute allowedRoles={["owner"]}>
              <BackupPage />
            </RoleRoute>
          }
        />
        <Route
          path="/users"
          element={
            <RoleRoute allowedRoles={["owner"]}>
              <UsersPage />
            </RoleRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;