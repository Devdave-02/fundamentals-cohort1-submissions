import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../services/api";

interface Product {
  id: number;
  name: string;
  price: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await apiGet("/products");
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost("/products", {
        name: newProduct.name,
        price: Number(newProduct.price),
      });
      setNewProduct({ name: "", price: "" });
      loadProducts();
    } catch (err) {
      console.error("Error creating product:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Products</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="border p-2 rounded w-40"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
          className="border p-2 rounded w-32"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {products.map((p) => (
          <li
            key={p.id}
            className="p-3 bg-gray-50 border rounded shadow-sm flex justify-between"
          >
            <span>{p.name}</span>
            <span className="font-semibold">${p.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
