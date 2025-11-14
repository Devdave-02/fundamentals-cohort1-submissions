import { getCartItemsLength, getProducts } from "@/_lib/actions";
import CartStore from "@/components/cart/CartStore";
import ProductList from "@/components/product/ProductList";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our collection of products",
};

export default async function ProductsPage() {
  const products = await getProducts();
  const { itemCount,userId } = await getCartItemsLength();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="p-3 bg-gray-300 mb-10 flex items-center justify-between">
        <h2 className="text-base font-semibold">Product List</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <CartStore cartLength={itemCount} userId={userId} />
        </Suspense>
      </div>
      <ProductList products={products} />
    </div>
  );
}
