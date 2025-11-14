type PaginatedResult<T> = {
  tasks: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
  };
};

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

export { type ApiErrorResponse, type PaginatedResult, type ValueLabel };
