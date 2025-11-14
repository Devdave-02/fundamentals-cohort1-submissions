
export type ApiErrorResponse = {
  messages?: string[];
  message?: string;
  exception?: string;
  errorId?: string;
  supportMessage?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
  status?: number;
};

export interface PaginatedResponse<T> {
  status: "success" | "error";
  total: number;
  page: number;
  pages: number;
  data: T[];
}