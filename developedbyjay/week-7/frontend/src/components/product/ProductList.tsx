import { ProductsType } from "@/_lib/server/types";
import ProductCard from "@/components/product/ProductCard";

export default function ProductList({
  products,
}: {
  products: ProductsType["data"];
}) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
