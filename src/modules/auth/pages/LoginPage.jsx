import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../services/firebase/config";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import styles from "./LoginPage.module.css";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log("login ok", userCredential);

    navigate("/sales");

  } catch (err) {
    console.log("error login", err);
    setError("Credenciales inválidas");
  }
};

return (
  <div className={styles.container}>
    <form className={styles.form} onSubmit={handleSubmit}>

      <div className={styles.logoWrapper}>
        <img src="/logo.png" alt="Querer-T" className={styles.logo} />
      </div>

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

    </form>
  </div>
);
}

export default LoginPage;