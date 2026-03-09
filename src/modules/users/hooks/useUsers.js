import { useState, useEffect, useCallback } from "react";
import {
  getUsers, createUser,
  updateUserRole, toggleUserActive, resetUserPassword,
} from "../services/userService";
import { deleteUser } from "../services/userService";

export function useUsers() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleCreate = async (data) => {
    await createUser(data);
    await fetchUsers();
  };

  const handleUpdateRole = async (uid, role) => {
    await updateUserRole(uid, role);
    await fetchUsers();
  };

  const handleToggleActive = async (uid, currentValue) => {
    await toggleUserActive(uid, currentValue);
    await fetchUsers();
  };

  const handleResetPassword = async (email) => {
    await resetUserPassword(email);
  };

  const handleDelete = async (uid) => {
  await deleteUser(uid);
  await fetchUsers();
};

  return {
    users, loading, error,
    handleCreate, handleUpdateRole,
    handleToggleActive, handleResetPassword,
    handleDelete,
  };
}