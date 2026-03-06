import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase/config";
import { useAuth } from "../providers/AuthProvider";
import styles from "./Header.module.css";

function Header() {
   const { profile } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className={styles.header}>
      <div>Sistema de Gestión</div>
      <div className={styles.right}>
        {profile && (
          <span className={styles.username}>
            Hola, <strong>{profile.name}</strong>
          </span>
        )}
        <button onClick={handleLogout} className={styles.logoutButton}>
          Salir
        </button>
      </div>
    </header>
  );
}

export default Header;