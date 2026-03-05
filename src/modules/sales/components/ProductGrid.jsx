import { useState } from "react";
import { CATEGORIES } from "../../../constants/categories";
import styles from "./ProductGrid.module.css";

function ProductGrid({ products, onSelectProduct }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const activeProducts = products.filter((p) => p.active);

  const filtered =
    activeCategory === "all"
      ? activeProducts
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
        {usedCategories.map((cat) => (
          <button
            key={cat}
            className={`${styles.catBtn} ${activeCategory === cat ? styles.catActive : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grilla */}
      <div className={styles.grid}>
        {filtered.map((product) => (
          <button
            key={product.id}
            className={styles.productBtn}
            onClick={() => onSelectProduct(product)}
          >
            <span className={styles.productName}>{product.name}</span>
            <span className={styles.productPrice}>
              {product.type === "weight"
                ? `$${product.price.toLocaleString()}/kg`
                : product.type === "variants"
                ? product.variants.map((v) => v.name).join(" · ")
                : `$${product.price.toLocaleString()}`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;