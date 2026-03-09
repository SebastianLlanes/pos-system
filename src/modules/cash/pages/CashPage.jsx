import { useState } from "react";
import { useCashClosing } from "../hooks/useCashClosing";
import ClosingForm from "../components/ClosingForm";
import ClosingHistory from "../components/ClosingHistory";
import Toast from "../../../components/ui/Toast";
import Spinner from "../../../components/ui/Spinner";
import { useMinLoading } from "../../../hooks/useMinLoading";
import styles from "./CashPage.module.css";

const TABS = [
  { id: "closing", label: "Cierre de caja" },
  { id: "history", label: "Historial"      },
];

function CashPage() {
  const {
    salesCount, systemTotal, paymentBreakdown,
    history, loading, error, handleClose,
  } = useCashClosing();

  const [activeTab, setActiveTab] = useState("closing");
  const [toast, setToast]         = useState(null);
  const showLoader = useMinLoading(loading);

  const onConfirmClose = async (data) => {
    try {
      await handleClose(data);
      setToast({ message: "Caja cerrada correctamente", type: "success" });
      setActiveTab("history");
    } catch {
      setToast({ message: "Error al cerrar la caja", type: "error" });
    }
  };

  if (showLoader) return <Spinner fullscreen />;
  if (error)   return <p>{error}</p>;

  return (
    <div  className={`${styles.page} pageEnter`}>
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeTab === "closing" && (
          <ClosingForm
            salesCount={salesCount}
            systemTotal={systemTotal}
            paymentBreakdown={paymentBreakdown}
            onConfirm={onConfirmClose}
          />
        )}
        {activeTab === "history" && (
          <ClosingHistory history={history} />
        )}
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

export default CashPage;