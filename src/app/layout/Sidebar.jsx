import { NavLink } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";
import styles from "./Sidebar.module.css";

function Sidebar() {
  const { profile } = useAuth();
  const isOwner = profile?.role === "owner";

  const allLinks = [
    { to: "/sales",    label: "Ventas",    icon: "🛒" },
    { to: "/products", label: "Productos", icon: "📦" },
    { to: "/cash",     label: "Caja",      icon: "💰" },
    ...(isOwner ? [
      { to: "/backup", label: "Backup",    icon: "💾" },
      { to: "/users",  label: "Usuarios",  icon: "👤" },
    ] : []),
  ];

  // En mobile solo mostramos las secciones relevantes para el dueño
  const mobileLinks = [
    { to: "/cash",     label: "Caja",      icon: "💰" },
    { to: "/products", label: "Productos", icon: "📦" },
    ...(isOwner ? [
      { to: "/backup", label: "Backup",    icon: "💾" },
      { to: "/users",  label: "Usuarios",  icon: "👤" },
    ] : []),
  ];

  return (
    <>
      {/* Sidebar desktop */}
      <aside className={styles.sidebar}>
        <div className={styles.logoWrapper}>
          <img src="/logo-icon.png" alt="Querer-T" className={styles.logoImg} />
        </div>
        <nav className={styles.nav}>
          {allLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Bottom nav mobile */}
      <nav className={styles.bottomNav}>
        {mobileLinks.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `${styles.bottomNavLink} ${isActive ? styles.bottomNavActive : ""}`
            }
          >
            <span className={styles.bottomNavIcon}>{icon}</span>
            <span className={styles.bottomNavLabel}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export default Sidebar;