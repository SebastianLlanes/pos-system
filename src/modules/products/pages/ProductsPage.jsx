import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductForm from "../components/ProductForm";
import Button from "../../../components/ui/Button";
import Spinner from "../../../components/ui/Spinner";
import { CATEGORIES } from "../../../constants/categories";
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
  const [filterCategory, setFilterCategory] = useState("all");

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
  };

  const filtered =
    filterCategory === "all"
      ? products
      : products.filter((p) => p.category === filterCategory);

  const formatPrice = (product) => {
    if (product.type === "weight")
      return `$${product.price.toLocaleString()} / kg`;
    if (product.type === "variants")
      return product.variants
        .map((v) => `${v.name}: $${v.price.toLocaleString()}`)
        .join(" · ");
    return `$${product.price.toLocaleString()}`;
  };

  if (loading) return <Spinner fullscreen />;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.page}>
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
          return (
            <button
              key={cat}
              className={`${styles.filterBtn} ${filterCategory === cat ? styles.filterActive : ""}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat} ({count})
            </button>
          );
        })}
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
                    <span className={styles.badge}>{product.category}</span>
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
                      onClick={() =>
                        handleToggleActive(product.id, product.active)
                      }
                    >
                      {product.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className={styles.actions}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEdit(product)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductForm
          onSubmit={handleSubmit}
          onCancel={closeForm}
          initialData={editingProduct}
        />
      )}
    </div>
  );
}

export default ProductsPage;
