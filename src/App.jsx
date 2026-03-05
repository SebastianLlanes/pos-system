import { Routes, Route } from "react-router-dom";
import LoginPage from "./modules/auth/pages/LoginPage";
import PrivateRoute from "./app/routes/PrivateRoute";
import AdminLayout from "./app/layout/AdminLayout";
import ProductsPage from "./modules/products/pages/ProductsPage";
import SalesPage from "./modules/sales/pages/SalesPage";

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
        <Route path="/" element={<div>Dashboard</div>} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/sales" element={<SalesPage />} />
        {/* Acá iremos agregando rutas sin tocar el layout:
        
        <Route path="/cash" element={<CashPage />} />
        */}
      </Route>

      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default App;