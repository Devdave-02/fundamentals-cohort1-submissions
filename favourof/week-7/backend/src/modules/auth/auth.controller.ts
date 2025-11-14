import { Request, Response } from "express";

const users: { email: string; password: string }[] = [];

export function register(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ message: "email amd password is required" });
  }
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ email, password });
  return res.status(201).json({ email });
}

export function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({ message: "email amd password is required" });
  }
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const token = `token-${email}`;
  res.json({ token });
}
