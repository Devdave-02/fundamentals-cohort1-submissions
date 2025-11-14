
type ValueLabel = {
  value: string | number;
  label: string;
};

type ApiErrorResponse = {
  messages?: string[];
  message?: string;
  exception?: string;
  errorId?: string;
  supportMessage?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
  status?: number;
};

// User Response type
export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin" | string; 
  createdAt: string; 
  updatedAt: string; 
  bio?: string;
  displayName?: string;
}

export interface SignInResponseData {
  user: User;
}

export interface SignInResponse {
  status: "success" | "error";
  data: SignInResponseData;
  accessToken: string;
}



export { type ApiErrorResponse,  type ValueLabel };
