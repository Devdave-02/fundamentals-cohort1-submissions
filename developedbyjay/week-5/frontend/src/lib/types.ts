export type ValueLabel = {
  value: string;
  label: string;
};

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
