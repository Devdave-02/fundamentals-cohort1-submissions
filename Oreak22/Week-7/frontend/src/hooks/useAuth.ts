import { useState, useEffect } from "react";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("auth_token")
  );

  useEffect(() => {
    const handler = () => setToken(localStorage.getItem("auth_token"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const saveToken = (t: string) => {
    localStorage.setItem("auth_token", t);
    setToken(t);
  };

  const clearToken = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
  };

  return { token, saveToken, clearToken };
};
