import { useState, type FormEvent } from "react";
import { api } from "../api/axiosClient";

type ProductFormProps = {
  onCreated: () => void;
};

export default function ProductForm({ onCreated }: ProductFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a product");
      return;
    }

    setLoading(true);
    try {
      await api.post(
        "/products",
        { name, price, stock },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setName("");
      setPrice(0);
      setStock(0);
      onCreated();
    } catch (error) {
      console.error(error);
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded mb-6">
      <h3 className="text-lg font-semibold mb-2">Add New Product</h3>

      <div className="mb-2">
        <label className="block mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border px-2 py-1 w-full rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          min={0}
          className="border px-2 py-1 w-full rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1">Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          required
          min={0}
          className="border px-2 py-1 w-full rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        {loading ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}
