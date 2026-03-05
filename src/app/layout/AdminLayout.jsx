import { Outlet } from "react-router-dom"; 
import Sidebar from "./Sidebar";
import Header from "./Header";
import styles from "./AdminLayout.module.css";

function AdminLayout({ children }) {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <div className={styles.content}>
          <Outlet />  {/* ← acá se renderizan las páginas hijas */}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;