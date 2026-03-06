import { useState } from "react";
import { useProducts } from "../../products/hooks/useProducts";
import { useCart } from "../../products/hooks/useCart";
import { useSale } from "../hooks/useSale";
import ProductGrid from "../components/ProductGrid";
import CartPanel from "../components/CartPanel";
import WeightModal from "../components/WeightModal";
import VariantModal from "../components/VariantModal";
import PaymentModal from "../components/PaymentModal";
import Spinner from "../../../components/ui/Spinner";
import { useMinLoading } from "../../../hooks/useMinLoading";
import Toast from "../../../components/ui/Toast";
import styles from "./SalesPage.module.css";

const MODAL = { NONE: "none", WEIGHT: "weight", VARIANT: "variant", PAYMENT: "payment" };

function SalesPage() {
  const { products, loading } = useProducts();
  const showLoader = useMinLoading(loading);
  const {
    items, itemsSubtotal,
    addUnitItem, addWeightItem, addVariantItem,
    updateQuantity, applyItemDiscount, removeItem, clearCart,
  } = useCart();
  const { confirmSale, loading: saleLoading } = useSale();

  const [activeModal, setActiveModal] = useState(MODAL.NONE);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  // ── Selección de producto desde la botonera ──────────────────
  const handleSelectProduct = (product) => {
    if (product.type === "unit") {
      addUnitItem(product);
      return;
    }
    setSelectedProduct(product);
    if (product.type === "weight")   setActiveModal(MODAL.WEIGHT);
    if (product.type === "variants") setActiveModal(MODAL.VARIANT);
  };

  const handleCloseModal = () => {
    setActiveModal(MODAL.NONE);
    setSelectedProduct(null);
  };

  // ── Confirmar peso ───────────────────────────────────────────
  const handleConfirmWeight = (product, grams) => {
    addWeightItem(product, grams);
    handleCloseModal();
  };

  // ── Confirmar variante ───────────────────────────────────────
  const handleConfirmVariant = (product, variant) => {
    addVariantItem(product, variant);
    handleCloseModal();
  };

  // ── Confirmar venta ──────────────────────────────────────────
const handleConfirmSale = async ({ customerName, totalDiscount, total, payments }) => {
  const success = await confirmSale({
    items,
    itemsSubtotal,
    totalDiscount,
    total,
    payments,
    customerName,
  });
  if (success) {
    clearCart();
    handleCloseModal();
    setToast({ message: "¡Venta registrada con éxito!", type: "success" });
  } else {
    setToast({ message: "Error al registrar la venta", type: "error" });
  }
};

  if (showLoader) return <Spinner fullscreen />;

  return (
    <div className={styles.page}>
      {/* Botonera izquierda */}
      <div className={styles.gridSection}>
        <ProductGrid
          products={products}
          onSelectProduct={handleSelectProduct}
        />
      </div>

      {/* Carrito derecho */}
      <div className={styles.cartSection}>
        <CartPanel
          items={items}
          itemsSubtotal={itemsSubtotal}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
          onApplyDiscount={applyItemDiscount}
          onCharge={() => setActiveModal(MODAL.PAYMENT)}
        />
      </div>

      {/* Modales */}
      {activeModal === MODAL.WEIGHT && selectedProduct && (
        <WeightModal
          product={selectedProduct}
          onConfirm={handleConfirmWeight}
          onCancel={handleCloseModal}
        />
      )}

      {activeModal === MODAL.VARIANT && selectedProduct && (
        <VariantModal
          product={selectedProduct}
          onConfirm={handleConfirmVariant}
          onCancel={handleCloseModal}
        />
      )}

      {activeModal === MODAL.PAYMENT && (
        <PaymentModal
          itemsSubtotal={itemsSubtotal}
          onConfirm={handleConfirmSale}
          onCancel={handleCloseModal}
          loading={saleLoading}
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

export default SalesPage;