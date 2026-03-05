import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase/config";
import styles from "./Header.module.css";

function Header() {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className={styles.header}>
      <div>Sistema de Gestión</div>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Salir
      </button>
    </header>
  );
}

export default Header;