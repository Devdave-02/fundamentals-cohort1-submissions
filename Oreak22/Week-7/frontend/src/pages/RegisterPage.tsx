import React, { useState } from "react";
import { authService } from "../services/auth";
import { useApi } from "../hooks/useApi";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { exec, loading } = useApi(authService.register);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await exec(form);
    if (res?.token) {
      localStorage.setItem("auth_token", res.token);
      toast.success("Account created");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form
          onSubmit={submit}
          className="space-y-3 bg-white p-6 rounded shadow"
        >
          <label className="text-sm">Name</label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
              {loading ? "Creating..." : "Create account"}
            </Button>
            <Link to="/auth/login" className="text-sm text-sky-600">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
