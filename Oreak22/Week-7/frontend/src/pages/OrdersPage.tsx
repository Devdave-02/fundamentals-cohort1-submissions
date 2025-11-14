import React, { useEffect, useState } from "react";
import { ordersService } from "../services/orders";
import { useApi } from "../hooks/useApi";
import { type Order } from "../types/order";
import { Card } from "../components/ui/card";
import { Loader } from "@/components/ui/Loader";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { exec, loading } = useApi(ordersService.listForUser);

  useEffect(() => {
    exec().then((res) => res && setOrders(res));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {loading && <Loader />}
      <div className="space-y-4">
        {orders.map((o) => (
          <Card key={o._id} className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{o.product.name}</div>
              <div className="text-sm text-gray-600">Qty: {o.quantity}</div>
            </div>
            <div className="text-right">
              <div>${o.total}</div>
              <div className="text-sm text-gray-600">
                {o.status || "Pending"}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
