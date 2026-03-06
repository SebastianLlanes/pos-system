import { useState } from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import styles from "./UserForm.module.css";

const EMPTY_FORM = { name: "", email: "", password: "", role: "staff" };

function UserForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = form.name.trim() && form.email.trim() && form.password.length >= 6;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Nuevo usuario</h3>

        <div className={styles.fields}>
          <Input
            label="Nombre"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ej: María"
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="correo@ejemplo.com"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
          />

          <div className={styles.field}>
            <label className={styles.label}>Rol</label>
            <div className={styles.roleGroup}>
              {[
                { value: "owner", label: "👑 Dueño"    },
                { value: "staff", label: "👤 Empleado" },
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  className={`${styles.roleBtn} ${form.role === r.value ? styles.roleBtnActive : ""}`}
                  onClick={() => handleChange("role", r.value)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button variant="primary" onClick={() => onSubmit(form)} disabled={!isValid}>
            Crear usuario
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserForm;