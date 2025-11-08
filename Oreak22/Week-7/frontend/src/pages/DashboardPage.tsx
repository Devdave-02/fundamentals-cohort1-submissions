import { Link } from "react-router-dom";

const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/products"
          className="p-4 bg-white rounded shadow hover:shadow-md"
        >
          <h3 className="text-lg font-semibold">Products</h3>
          <p className="text-sm text-gray-600">Browse available products</p>
        </Link>
        <Link
          to="/orders"
          className="p-4 bg-white rounded shadow hover:shadow-md"
        >
          <h3 className="text-lg font-semibold">Orders</h3>
          <p className="text-sm text-gray-600">Your orders</p>
        </Link>
        <div className="p-4 bg-white rounded shadow hover:shadow-md">
          <h3 className="text-lg font-semibold">Profile</h3>
          <p className="text-sm text-gray-600">Manage account</p>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
