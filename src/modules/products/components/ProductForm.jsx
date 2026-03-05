import { useState, useEffect } from "react";
import { CATEGORIES, PRODUCT_TYPES } from "../../../constants/categories";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import styles from "./ProductForm.module.css";

const EMPTY_FORM = {
  name: "",
  category: "",
  type: "unit",
  price: "",
  variants: [{ name: "", price: "" }],
};

function ProductForm({ onSubmit, onCancel, initialData = null }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        price: initialData.price ?? "",
        variants: initialData.variants?.length
          ? initialData.variants
          : [{ name: "", price: "" }],
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = form.variants.map((v, i) =>
      i === index ? { ...v, [field]: value } : v,
    );
    setForm((prev) => ({ ...prev, variants: updated }));
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", price: "" }],
    }));
  };

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    const payload = {
      name: form.name.trim(),
      category: form.category,
      type: form.type,
      price: form.type !== "variants" ? parseFloat(form.price) : null,
      variants:
        form.type === "variants"
          ? form.variants.map((v) => ({
              name: v.name.trim(),
              price: parseFloat(v.price),
            }))
          : [],
    };
    onSubmit(payload);
  };

  const isValid =
    form.name.trim() &&
    form.category &&
    (form.type !== "variants"
      ? form.price > 0
      : form.variants.every((v) => v.name.trim() && v.price > 0));

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>
          {initialData ? "Editar producto" : "Nuevo producto"}
        </h3>

        <div className={styles.fields}>
          <Input
            label="Nombre"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ej: Medialuna de manteca"
            required
          />

          <div className={styles.field}>
            <label className={styles.label}>Categoría</label>
            <select
              className={styles.select}
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="">Seleccionar...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Tipo de venta</label>
            <div className={styles.typeGroup}>
              {PRODUCT_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className={`${styles.typeBtn} ${form.type === t.value ? styles.typeBtnActive : ""}`}
                  onClick={() => handleChange("type", t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {form.type !== "variants" && (
            <Input
              label={
                form.type === "weight"
                  ? "Precio por kg ($)"
                  : "Precio unitario ($)"
              }
              type="number"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="0.00"
              required
            />
          )}

          {form.type === "variants" && (
            <div className={styles.variants}>
              <label className={styles.label}>Variantes</label>
              {form.variants.map((v, i) => (
                <div key={i} className={styles.variantRow}>
                  <Input
                    placeholder="Nombre (ej: Grande)"
                    value={v.name}
                    onChange={(e) =>
                      handleVariantChange(i, "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Precio ($)"
                    type="number"
                    value={v.price}
                    onChange={(e) =>
                      handleVariantChange(i, "price", e.target.value)
                    }
                  />
                  {form.variants.length > 1 && (
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeVariant(i)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={addVariant}>
                + Agregar variante
              </Button>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!isValid}>
            {initialData ? "Guardar cambios" : "Agregar producto"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
