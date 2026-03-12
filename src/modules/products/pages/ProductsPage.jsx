import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductForm from "../components/ProductForm";
import Button from "../../../components/ui/Button";
import Spinner from "../../../components/ui/Spinner";
import { useMinLoading } from "../../../hooks/useMinLoading";
import { CATEGORIES, CATEGORY_COLORS } from "../../../constants/categories";
import Toast from "../../../components/ui/Toast";
import styles from "./ProductsPage.module.css";

function ProductsPage() {
  const {
    products,
    loading,
    error,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleToggleActive,
  } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [toast, setToast] = useState(null);
  const showLoader = useMinLoading(loading);
  const [search, setSearch] = useState("");

  const openAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };
  const openEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (data) => {
    if (editingProduct) {
      await handleUpdate(editingProduct.id, data);
    } else {
      await handleAdd(data);
    }
    closeForm();
    setToast({ message: editingProduct ? "Producto actualizado" : "Producto agregado", type: "success" }); // ← después muestra el toast
  };

  const filtered = (() => {
    let result =
      filterCategory === "all"
        ? [...products].sort(
            (a, b) =>
              CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category)
          )
        : products.filter((p) => p.category === filterCategory);

    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase().trim())
      );
    }
    return result;
  })();

  const formatPrice = (product) => {
    if (product.type === "weight")
      return `$${product.price.toLocaleString()} / kg`;
    if (product.type === "variants")
      return product.variants
        .map((v) => `${v.name}: $${v.price.toLocaleString()}`)
        .join(" · ");
    return `$${product.price.toLocaleString()}`;
  };

  if (showLoader) return <Spinner fullscreen />;
  if (error) return <p>{error}</p>;

  return (
    <div className={`${styles.page} pageEnter`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Productos</h1>
        <Button onClick={openAdd}>+ Nuevo producto</Button>
      </div>

      {/* Filtro por categoría */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filterCategory === "all" ? styles.filterActive : ""}`}
          onClick={() => setFilterCategory("all")}
        >
          Todos ({products.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = products.filter((p) => p.category === cat).length;
          if (count === 0) return null;
          const colors = CATEGORY_COLORS[cat];
          const isActive = filterCategory === cat;
          return (
            <button
              key={cat}
              className={styles.filterBtn}
              onClick={() => setFilterCategory(cat)}
              style={{
                background: isActive ? colors.border : colors.bg,
                borderColor: colors.border,
                color: isActive ? "#fff" : colors.text,
              }}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      <div className={styles.searchWrapper}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className={styles.searchClear} onClick={() => setSearch("")}>
            ✕
          </button>
        )}
      </div>

      {/* Tabla */}
      {filtered.length === 0 ? (
  <div className={styles.empty}>
    <p>No hay productos en esta categoría.</p>
    <Button variant="ghost" onClick={openAdd}>
      Agregar el primero
    </Button>
  </div>
) : (
  <>
    {/* Tabla — solo desktop */}
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Tipo</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((product) => (
            <tr
              key={product.id}
              className={!product.active ? styles.rowInactive : ""}
            >
              <td className={styles.productName}>{product.name}</td>
              <td>
                <span
                  className={styles.badge}
                  style={{
                    background: CATEGORY_COLORS[product.category]?.bg,
                    color: CATEGORY_COLORS[product.category]?.text,
                    border: `1px solid ${CATEGORY_COLORS[product.category]?.border}`,
                  }}
                >
                  {product.category}
                </span>
              </td>
              <td className={styles.typeLabel}>
                {product.type === "unit" && "Unidad"}
                {product.type === "weight" && "Por peso"}
                {product.type === "variants" && "Variantes"}
              </td>
              <td className={styles.price}>{formatPrice(product)}</td>
              <td>
                <button
                  className={`${styles.statusBtn} ${product.active ? styles.statusActive : styles.statusInactive}`}
                  onClick={() => handleToggleActive(product.id, product.active)}
                >
                  {product.active ? "Activo" : "Inactivo"}
                </button>
              </td>
              <td className={styles.actions}>
                <Button size="sm" variant="ghost" onClick={() => openEdit(product)}>
                  Editar
                </Button>
                {deletingId === product.id ? (
                  <div className={styles.confirmDelete}>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={async () => {
                        await handleDelete(product.id);
                        setDeletingId(null);
                        setToast({ message: "Producto eliminado", type: "success" });
                      }}
                    >
                      Confirmar
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeletingId(null)}>
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="danger" onClick={() => setDeletingId(product.id)}>
                    Eliminar
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Cards — solo mobile */}
    <div className={styles.cardList}>
      {filtered.map((product) => {
        const colors = CATEGORY_COLORS[product.category] ?? {
          bg: "#f9fafb", border: "#e5e7eb", text: "#374151",
        };
        return (
          <div
            key={product.id}
            className={`${styles.productCard} ${!product.active ? styles.cardInactive : ""}`}
            style={{ borderLeft: `4px solid ${colors.border}` }}
          >
            <div className={styles.cardHeader}>
              <div>
                <span className={styles.cardName}>{product.name}</span>
                <span
                  className={styles.cardBadge}
                  style={{ background: colors.bg, color: colors.text }}
                >
                  {product.category}
                </span>
              </div>
              <button
                className={`${styles.statusBtn} ${product.active ? styles.statusActive : styles.statusInactive}`}
                onClick={() => handleToggleActive(product.id, product.active)}
              >
                {product.active ? "Activo" : "Inactivo"}
              </button>
            </div>

            <div className={styles.cardBody}>
              <span className={styles.cardType}>
                {product.type === "unit"     && "Unidad"}
                {product.type === "weight"   && "Por peso"}
                {product.type === "variants" && "Variantes"}
              </span>
              <span className={styles.cardPrice}>{formatPrice(product)}</span>
            </div>

            <div className={styles.cardActions}>
              <Button size="sm" variant="ghost" onClick={() => openEdit(product)}>
                Editar
              </Button>
              {deletingId === product.id ? (
                <div className={styles.confirmDelete}>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={async () => {
                      await handleDelete(product.id);
                      setDeletingId(null);
                      setToast({ message: "Producto eliminado", type: "success" });
                    }}
                  >
                    Confirmar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeletingId(null)}>
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="danger" onClick={() => setDeletingId(product.id)}>
                  Eliminar
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </>
)}

      {showForm && (
        <ProductForm
          onSubmit={handleSubmit}
          onCancel={closeForm}
          initialData={editingProduct}
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

export default ProductsPage;
