import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth_token");
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen flex min-w-full p-0 m-0">
      <aside className="w-61 border-r p-4">
        <h2 className="text-xl font-semibold mb-6">MyStore</h2>
        <nav className="space-y-2">
          <Link to="/" className="block py-2 px-3 rounded hover:bg-gray-100">
            Dashboard
          </Link>
          <Link
            to="/products"
            className="block py-2 px-3 rounded hover:bg-gray-100"
          >
            Products
          </Link>
          <Link
            to="/orders"
            className="block py-2 px-3 rounded hover:bg-gray-100"
          >
            Orders
          </Link>
        </nav>
        <div className="mt-6">
          <Button onClick={logout} variant="ghost">
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6 ">{children}</main>
    </div>
  );
};
export default AppLayout;
