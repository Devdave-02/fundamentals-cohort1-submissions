import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productsService } from "../services/products";
import { useApi } from "../hooks/useApi";
import { type Product } from "../types/product";
import { Card } from "../components/ui/card";
import { Loader } from "@/components/ui/Loader";
import { ordersService } from "../services/orders";
import { Button } from "../components/ui/button";
import toast from "react-hot-toast";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { exec, loading } = useApi((id: string) => productsService.getById(id));
  const { exec: createOrder, loading: creating } = useApi((payload: any) =>
    ordersService.create(payload)
  );

  useEffect(() => {
    if (!id) return;
    exec(id).then((res) => res && setProduct(res));
  }, [id]);

  const handleBuy = async () => {
    if (!product) return;
    const res = await createOrder({ productId: product._id, quantity: 1 });
    if (res) {
      toast.success("Order placed");
    }
  };

  if (loading || !product) return <Loader />;

  return (
    <Card>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-80 bg-gray-100 rounded flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full"
            />
          ) : (
            "No image"
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="mt-2 text-gray-700">{product.description}</p>
          <div className="mt-4 text-xl font-semibold">
            ${product.price.toFixed(2)}
          </div>
          <div className="mt-6">
            <Button onClick={handleBuy} disabled={creating}>
              {creating ? "Ordering..." : "Buy Now"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductDetailsPage;
