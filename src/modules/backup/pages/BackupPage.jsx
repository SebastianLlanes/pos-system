import { useBackup } from "../hooks/useBackup";
import Button from "../../../components/ui/Button";
import Toast from "../../../components/ui/Toast";
import { useState } from "react";
import styles from "./BackupPage.module.css";

const INCLUDED = [
  { icon: "📦", label: "Productos",        desc: "Nombre, categoría, tipo y precios" },
  { icon: "🛒", label: "Ventas",           desc: "Detalle de ítems, pagos y totales"  },
  { icon: "💰", label: "Cierres de caja",  desc: "Balance y desglose por medio de pago" },
];

function BackupPage() {
  const { handleBackup, loading, error, lastBackup } = useBackup();
  const [toast, setToast] = useState(null);

  const onBackup = async () => {
    const success = await handleBackup();
    if (success) {
      setToast({ message: "Backup descargado correctamente", type: "success" });
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return null;
    return new Date(isoString).toLocaleString("es-AR", {
      day:    "2-digit",
      month:  "2-digit",
      year:   "numeric",
      hour:   "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Backup de datos</h1>
            <p className={styles.subtitle}>
              Descargá una copia completa de todos los datos del sistema en formato JSON.
            </p>
          </div>
        </div>

        {/* Último backup */}
        {lastBackup && (
          <div className={styles.lastBackup}>
            <span className={styles.lastBackupIcon}>✓</span>
            <span>Último backup: <strong>{formatDate(lastBackup)}</strong></span>
          </div>
        )}

        {/* Qué incluye */}
        <div className={styles.included}>
          <h3 className={styles.includedTitle}>¿Qué incluye el backup?</h3>
          <div className={styles.includedList}>
            {INCLUDED.map((item) => (
              <div key={item.label} className={styles.includedItem}>
                <span className={styles.includedIcon}>{item.icon}</span>
                <div>
                  <span className={styles.includedLabel}>{item.label}</span>
                  <span className={styles.includedDesc}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instrucciones */}
        <div className={styles.info}>
          <p>📁 El archivo se descarga como <code>querert-backup-FECHA.json</code> en tu carpeta de descargas.</p>
          <p>💡 Se recomienda hacer backup al menos una vez por semana y guardar el archivo en Google Drive o un pendrive.</p>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <Button
          variant="primary"
          size="lg"
          onClick={onBackup}
          disabled={loading}
        >
          {loading ? "Generando backup..." : "Descargar backup ahora"}
        </Button>

      </div>

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

export default BackupPage;