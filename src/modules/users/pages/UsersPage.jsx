import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { useNavigate } from "react-router-dom";
import UserForm from "../components/UserForm";
import Button from "../../../components/ui/Button";
import Spinner from "../../../components/ui/Spinner";
import { useMinLoading } from "../../../hooks/useMinLoading";
import Toast from "../../../components/ui/Toast";
import styles from "./UsersPage.module.css";

const ROLE_LABELS = {
  owner: { label: "Dueño",    bg: "#fef3c7", color: "#92400e" },
  staff: { label: "Empleado", bg: "#eff6ff", color: "#1d4ed8" },
};

function UsersPage() {
  const {
    users, loading, error,
    handleCreate, handleUpdateRole,
    handleToggleActive, handleResetPassword,
    handleDelete,
  } = useUsers();

  const [showForm, setShowForm] = useState(false);
  const [toast, setToast]       = useState(null);
  const showLoader = useMinLoading(loading);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

 const onCreateUser = async (data) => {
  try {
    await handleCreate(data);
    setShowForm(false);
    setToast({ message: "Usuario creado correctamente", type: "success" });
  } catch (err) {
    console.error(err);
    if (err.code === "auth/email-already-in-use") {
      setToast({ message: "Ese email ya está registrado en el sistema", type: "error" });
    } else if (err.code === "auth/weak-password") {
      setToast({ message: "La contraseña debe tener al menos 6 caracteres", type: "error" });
    } else {
      setToast({ message: "Error al crear el usuario", type: "error" });
    }
    setShowForm(false);
  }
};

  const onResetPassword = async (email) => {
    try {
      await handleResetPassword(email);
      setToast({ message: `Email de reseteo enviado a ${email}`, type: "success" });
    } catch {
      setToast({ message: "Error al enviar el email", type: "error" });
    }
  };

      if (showLoader) return <Spinner fullscreen />;
      if (error)   return <p>{error}</p>;

  return (
    <div  className={`${styles.page} pageEnter`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Usuarios</h1>
        <Button onClick={() => setShowForm(true)}>+ Nuevo usuario</Button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const roleConfig = ROLE_LABELS[u.role] ?? ROLE_LABELS.staff;
              return (
                <tr key={u.id} className={!u.active ? styles.rowInactive : ""}>
                  <td className={styles.name}>{u.name}</td>
                  <td className={styles.email}>{u.email}</td>
                  <td>
                    <span
                      className={styles.roleBadge}
                      style={{
                        background: roleConfig.bg,
                        color: roleConfig.color,
                      }}
                    >
                      {roleConfig.label}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`${styles.statusBtn} ${u.active ? styles.statusActive : styles.statusInactive}`}
                      onClick={() => handleToggleActive(u.id, u.active)}
                    >
                      {u.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className={styles.actions}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleUpdateRole(
                          u.id,
                          u.role === "owner" ? "staff" : "owner",
                        )
                      }
                    >
                      {u.role === "owner" ? "→ Empleado" : "→ Dueño"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onResetPassword(u.email)}
                    >
                      Reset contraseña
                    </Button>
                    {deletingId === u.id ? (
                      <div className={styles.confirmDelete}>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={async () => {
                            try {
                              await handleDelete(u.id);
                              setDeletingId(null);
                              setToast({
                                message: "Usuario eliminado",
                                type: "success",
                              });
                            } catch {
                              setToast({
                                message: "Error al eliminar el usuario",
                                type: "error",
                              });
                            }
                          }}
                        >
                          Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeletingId(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDeletingId(u.id)}
                      >
                        Eliminar
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards — solo mobile */}
<div className={styles.cardList}>
  {users.map((u) => {
    const roleConfig = ROLE_LABELS[u.role] ?? ROLE_LABELS.staff;
    return (
      <div
        key={u.id}
        className={`${styles.userCard} ${!u.active ? styles.cardInactive : ""}`}
      >
        <div className={styles.cardHeader}>
          <div>
            <span className={styles.cardName}>{u.name}</span>
            <span className={styles.cardEmail}>{u.email}</span>
          </div>
          <div className={styles.cardBadges}>
            <span
              className={styles.roleBadge}
              style={{ background: roleConfig.bg, color: roleConfig.color }}
            >
              {roleConfig.label}
            </span>
            <button
              className={`${styles.statusBtn} ${u.active ? styles.statusActive : styles.statusInactive}`}
              onClick={() => handleToggleActive(u.id, u.active)}
            >
              {u.active ? "Activo" : "Inactivo"}
            </button>
          </div>
        </div>

        <div className={styles.cardActions}>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              handleUpdateRole(u.id, u.role === "owner" ? "staff" : "owner")
            }
          >
            {u.role === "owner" ? "→ Empleado" : "→ Dueño"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onResetPassword(u.email)}
          >
            Reset contraseña
          </Button>
          {deletingId === u.id ? (
            <div className={styles.confirmDelete}>
              <Button
                size="sm"
                variant="danger"
                onClick={async () => {
                  try {
                    await handleDelete(u.id);
                    setDeletingId(null);
                    setToast({ message: "Usuario eliminado", type: "success" });
                  } catch {
                    setToast({
                      message: "Error al eliminar el usuario",
                      type: "error",
                    });
                  }
                }}
              >
                Confirmar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setDeletingId(null)}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="danger"
              onClick={() => setDeletingId(u.id)}
            >
              Eliminar
            </Button>
          )}
        </div>
      </div>
    );
  })}
</div>

      {showForm && (
        <UserForm
          onSubmit={onCreateUser}
          onCancel={() => setShowForm(false)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default UsersPage;