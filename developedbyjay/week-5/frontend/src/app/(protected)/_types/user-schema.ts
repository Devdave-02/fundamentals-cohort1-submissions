// Represents a single user
export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin",
  createdAt: string; // ISO timestamp
  updatedAt: string;
}


export interface AuthData {
  user: User;
}

export interface AuthResponse {
  status: "success" | "error";
  data: AuthData;
}
