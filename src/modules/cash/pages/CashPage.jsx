import { useState } from "react";
import { useCashClosing } from "../hooks/useCashClosing";
import { printCashClosing } from "../../../modules/sales/services/printerService";
import ClosingForm from "../components/ClosingForm";
import ClosingHistory from "../components/ClosingHistory";
import Button from "../../../components/ui/Button";
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
    sales,
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

  const onPrintClosing = async () => {
  try {
    await printCashClosing({ salesCount, systemTotal, paymentBreakdown, sales });
    setToast({ message: "Ticket impreso correctamente", type: "success" });
  } catch (err) {
    console.error("Error al imprimir cierre:", err);
    setToast({ message: "Error al imprimir el ticket", type: "error" });
  }
};

  return (
    <div className={`${styles.page} pageEnter`}>
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
        {activeTab === "history" && <ClosingHistory history={history} />}
      </div>

      <div className={styles.headerRow}>
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
        <Button variant="ghost" onClick={onPrintClosing}>
          🖨️ Imprimir cierre
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

export default CashPage;