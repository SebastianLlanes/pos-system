// import { Outlet } from "react-router-dom"; 
// import Sidebar from "./Sidebar";
// import Header from "./Header";
// import styles from "./AdminLayout.module.css";

// function AdminLayout({ children }) {
//   return (
//     <div className={styles.container}>
//       <Sidebar />
//       <div className={styles.main}>
//         <Header />
//         <div className={styles.content}>
//           <Outlet />  {/* ← acá se renderizan las páginas hijas */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminLayout;
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styles from "./AdminLayout.module.css";

// Configuración de la barra
NProgress.configure({ speed: 400, showSpinner: false });

function AdminLayout() {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => NProgress.done(), 1000);
    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location.pathname]);

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;