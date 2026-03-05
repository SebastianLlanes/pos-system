import { useState, useEffect, useCallback } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../../services/productService";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("Error al cargar los productos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAdd = async (data) => {
    await addProduct(data);
    await fetchProducts();
  };

  const handleUpdate = async (id, data) => {
    await updateProduct(id, data);
    await fetchProducts();
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    await fetchProducts();
  };

  const handleToggleActive = async (id, currentValue) => {
    await updateProduct(id, { active: !currentValue });
    await fetchProducts();
  };

  return {
    products,
    loading,
    error,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleToggleActive,
    fetchProducts,
  };
}