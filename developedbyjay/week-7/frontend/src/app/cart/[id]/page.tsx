import { getCartItems } from "@/_lib/actions";
import CartList from "@/components/cart/CartList";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cart Page",
  description: "View items in your cart",
};


export default async function CartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cartItems = await getCartItems({ id });
  return (
    <div>
      <Link href={`/products`}>
        <button className="cursor-pointer mt-4 bg-blue-500 text-white py-2 px-4 rounded">
          Go to product
        </button>
      </Link>
      <h2 className="mt-5 text-center font-medium text-lg">Cart Items</h2>
      <div className="container grid grid-cols-1 sm:grid-cols-2 gap-6 mx-auto py-10 px-">
        {cartItems?.map((product) => (
          <CartList key={product.productId._id} product={product} />
        ))}
      </div>
    </div>
  );
}

       

