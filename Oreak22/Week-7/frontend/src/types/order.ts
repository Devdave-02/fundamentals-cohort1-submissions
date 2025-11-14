export type OrderCreateInput = {
  productId: string;
  quantity: number;
};

export type Order = {
  _id: string;
  userId: string;
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  total: number;
  status?: string;
  createdAt?: string;
};
