import { useEffect, useState } from "react";
import { api } from "../api/axiosClient";
import ProductForm from "../components/ProductForm";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
};

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setProducts(res.data.data || res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Product Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* Product Form */}
      <ProductForm onCreated={fetchProducts} />

      {/* Product List */}
      <h2 className="text-lg font-semibold mt-6 mb-2">All Products</h2>
      <ul className="space-y-2">
        {products.map((p) => (
          <li
            key={p.id}
            className="border p-3 flex justify-between items-center rounded"
          >
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-600">Stock: {p.stock}</p>
              <p className="font-bold">${p.price}</p>
            </div>
            <button
              onClick={() => handleDelete(p.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
