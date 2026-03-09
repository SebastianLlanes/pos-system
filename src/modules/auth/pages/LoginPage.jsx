import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../services/firebase/config";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import SplashScreen from "../../../components/ui/SplashScreen";
import styles from "./LoginPage.module.css";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [error, setError]           = useState("");
  const [showSplash, setShowSplash] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const isMobile = window.innerWidth <= 768;
      navigate(isMobile ? "/cash" : "/sales");
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas");
    }
  };

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.logoWrapper}>
          <img src="/logo.png" alt="Querer-T" className={styles.logo} />
        </div>
        <div className={styles.fields}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" variant="primary" size="lg">
            Ingresar
          </Button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;