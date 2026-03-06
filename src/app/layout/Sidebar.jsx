import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const links = [
  { to: "/sales",   label: "Ventas"    },
  { to: "/products",label: "Productos" },
  { to: "/cash",     label: "Caja"      },
];

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoWrapper}>
        <img src="/logo-icon.png" alt="Querer-T" className={styles.logoImg} />
      </div>

      <nav className={styles.nav}>
        {links.map(({ to, label }) => (
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
  );
}

export default Sidebar;