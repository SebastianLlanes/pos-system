import { useState } from "react";
import { generateBackup, downloadBackup } from "../services/backupService";

export function useBackup() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [lastBackup, setLastBackup] = useState(
    localStorage.getItem("lastBackupDate") || null
  );

  const handleBackup = async () => {
    setLoading(true);
    setError(null);
    try {
      const backup = await generateBackup();
      downloadBackup(backup);
      const now = new Date().toISOString();
      localStorage.setItem("lastBackupDate", now);
      setLastBackup(now);
      return true;
    } catch (err) {
      console.error(err);
      setError("Error al generar el backup");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleBackup, loading, error, lastBackup };
}