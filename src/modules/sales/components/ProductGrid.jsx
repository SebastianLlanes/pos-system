import { useState } from "react";
import { CATEGORIES, CATEGORY_COLORS } from "../../../constants/categories";
import styles from "./ProductGrid.module.css";

function ProductGrid({ products, onSelectProduct }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const activeProducts = products.filter((p) => p.active);

  const filtered =
    activeCategory === "all"
      ? [...activeProducts].sort(
          (a, b) =>
            CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category)
        )
      : activeProducts.filter((p) => p.category === activeCategory);

  const usedCategories = CATEGORIES.filter((cat) =>
    activeProducts.some((p) => p.category === cat)
  );

  return (
    <div className={styles.wrapper}>
      {/* Filtros */}
      <div className={styles.categories}>
        <button
          className={`${styles.catBtn} ${activeCategory === "all" ? styles.catActive : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          Todos
        </button>
        {usedCategories.map((cat) => {
          const colors = CATEGORY_COLORS[cat];
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              className={styles.catBtn}
              onClick={() => setActiveCategory(cat)}
              style={{
                background:   isActive ? colors.border : colors.bg,
                borderColor:  colors.border,
                color:        isActive ? "#fff" : colors.text,
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grilla */}
      <div className={styles.grid}>
        {filtered.map((product) => {
          const colors = CATEGORY_COLORS[product.category] ?? {
            bg: "#f9fafb", border: "#e5e7eb", text: "#374151",
          };
          return (
            <button
              key={product.id}
              className={styles.productBtn}
              onClick={() => onSelectProduct(product)}
              style={{
                background:  colors.bg,
                borderColor: colors.border,
                "--hover-shadow": colors.border,
              }}
            >
              <span className={styles.productName}>{product.name}</span>
              <span
                className={styles.productPrice}
                style={{ background: colors.border + "25", color: colors.text }}
              >
                {product.type === "weight"
                  ? `$${product.price.toLocaleString()}/kg`
                  : product.type === "variants"
                  ? product.variants.map((v) => v.name).join(" · ")
                  : `$${product.price.toLocaleString()}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProductGrid;