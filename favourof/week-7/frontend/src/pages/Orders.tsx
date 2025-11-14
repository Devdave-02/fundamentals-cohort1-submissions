import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../services/api";

interface Order {
  id: number;
  product: string;
  quantity: number;
  total: number;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState({ product: "", quantity: "", price: "" });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await apiGet("/orders");
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiPost("/orders", {
        product: form.product,
        quantity: Number(form.quantity),
        price: Number(form.price),
      });
      setForm({ product: "", quantity: "", price: "" });
      loadOrders();
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Product"
          value={form.product}
          onChange={(e) => setForm({ ...form, product: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          className="border p-2 rounded w-24"
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 rounded w-24"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {orders.map((o) => (
          <li
            key={o.id}
            className="p-3 bg-gray-50 border rounded shadow-sm flex justify-between"
          >
            <span>
              {o.product} × {o.quantity}
            </span>
            <span className="font-semibold">${o.total}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
