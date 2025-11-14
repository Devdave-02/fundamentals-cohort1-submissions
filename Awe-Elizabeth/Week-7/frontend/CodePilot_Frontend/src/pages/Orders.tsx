import { useEffect, useState } from 'react';
import api from '../api/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Orders</h2>
      <ul>
        {orders.map((o: any) => (
          <li key={o.id}>Order #{o.id} - Total: ${o.total}</li>
        ))}
      </ul>
    </div>
  );
}
