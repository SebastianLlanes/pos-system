import { useState, useCallback } from "react";

const generateItemId = () => Math.random().toString(36).substr(2, 9);

export function useCart() {
  const [items, setItems] = useState([]);

  // ── Agregar producto por unidad ──────────────────────────────
  const addUnitItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === product.id && i.type === "unit"
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id
            ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.unitPrice - i.discountAmount }
            : i
        );
      }
      return [
        ...prev,
        {
          id: generateItemId(),
          productId: product.id,
          name: product.name,
          type: "unit",
          quantity: 1,
          unitPrice: product.price,
          discountAmount: 0,
          discountPercent: 0,
          subtotal: product.price,
        },
      ];
    });
  }, []);

  // ── Agregar producto por peso ────────────────────────────────
  const addWeightItem = useCallback((product, grams) => {
    const subtotal = (grams / 1000) * product.price;
    setItems((prev) => [
      ...prev,
      {
        id: generateItemId(),
        productId: product.id,
        name: product.name,
        type: "weight",
        grams,
        pricePerKg: product.price,
        discountAmount: 0,
        discountPercent: 0,
        subtotal: parseFloat(subtotal.toFixed(2)),
      },
    ]);
  }, []);

  // ── Agregar producto con variante ────────────────────────────
  const addVariantItem = useCallback((product, variant) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === product.id && i.variantName === variant.name
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id
            ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.unitPrice - i.discountAmount }
            : i
        );
      }
      return [
        ...prev,
        {
          id: generateItemId(),
          productId: product.id,
          name: product.name,
          type: "variants",
          variantName: variant.name,
          quantity: 1,
          unitPrice: variant.price,
          discountAmount: 0,
          discountPercent: 0,
          subtotal: variant.price,
        },
      ];
    });
  }, []);

  // ── Cambiar cantidad ─────────────────────────────────────────
  const updateQuantity = useCallback((itemId, delta) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id !== itemId) return i;
          const newQty = i.quantity + delta;
          if (newQty <= 0) return null;
          const base = newQty * i.unitPrice;
          const subtotal = parseFloat((base - i.discountAmount).toFixed(2));
          return { ...i, quantity: newQty, subtotal: Math.max(subtotal, 0) };
        })
        .filter(Boolean)
    );
  }, []);

  // ── Aplicar descuento por ítem ───────────────────────────────
  const applyItemDiscount = useCallback((itemId, value, mode) => {
    // mode: "percent" | "amount"
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== itemId) return i;
        const base = i.type === "unit"
          ? i.quantity * i.unitPrice
          : i.type === "variants"
          ? i.quantity * i.unitPrice
          : i.subtotal + i.discountAmount; // base original para weight

        const discountAmount =
          mode === "percent"
            ? parseFloat(((base * value) / 100).toFixed(2))
            : parseFloat(value);

        const discountPercent =
          mode === "percent"
            ? value
            : parseFloat(((value / base) * 100).toFixed(2));

        const subtotal = parseFloat(Math.max(base - discountAmount, 0).toFixed(2));

        return { ...i, discountAmount, discountPercent, subtotal };
      })
    );
  }, []);

  // ── Eliminar ítem ────────────────────────────────────────────
  const removeItem = useCallback((itemId) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  // ── Limpiar carrito ──────────────────────────────────────────
  const clearCart = useCallback(() => setItems([]), []);

  // ── Totales calculados ───────────────────────────────────────
  const itemsSubtotal = parseFloat(
    items.reduce((acc, i) => acc + i.subtotal, 0).toFixed(2)
  );

  return {
    items,
    itemsSubtotal,
    addUnitItem,
    addWeightItem,
    addVariantItem,
    updateQuantity,
    applyItemDiscount,
    removeItem,
    clearCart,
  };
}