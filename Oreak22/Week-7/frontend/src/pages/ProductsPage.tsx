import React, { useEffect, useState } from "react";
import { productsService } from "../services/products";
import { useApi } from "../hooks/useApi";
import { type Product } from "../types/product";
import { ProductCard } from "@/components/ui/ProductCard";
import { Loader } from "@/components/ui/Loader";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { exec, loading } = useApi(productsService.list);

  useEffect(() => {
    exec().then((res) => res && setProducts(res));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      {loading && <Loader />}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
};
export default ProductsPage;
