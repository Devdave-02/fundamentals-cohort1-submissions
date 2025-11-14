export interface ApiErrorResponse {
  messages?: string[];
  message?: string;
  exception?: string;
  errorId?: string;
  supportMessage?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface ProductsType {
  data: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  }[];
}

export type ProductType = ProductsType["data"][number];