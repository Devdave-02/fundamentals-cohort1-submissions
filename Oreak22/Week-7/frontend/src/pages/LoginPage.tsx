import React, { useState } from "react";
import { authService } from "../services/auth";
import { useApi } from "../hooks/useApi";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { exec, loading } = useApi(authService.login);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await exec(form);
    if (res?.token) {
      localStorage.setItem("auth_token", res.token);
      toast.success("Logged in");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form
          onSubmit={submit}
          className="space-y-3 bg-white p-6 rounded shadow"
        >
          <label className="text-sm">Email</label>
          <Input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <label className="text-sm">Password</label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div className="flex items-center justify-between">
            <Button type="submit" disabled={loading}>
              {loading ? "Logging..." : "Login"}
            </Button>
            <Link to="/auth/register" className="text-sm text-sky-600">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
