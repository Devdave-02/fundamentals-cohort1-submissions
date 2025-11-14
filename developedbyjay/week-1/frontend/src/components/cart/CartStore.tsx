import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CartIcon({
  cartLength,
  userId,
}: {
  cartLength: number;
  userId: string;
}) {
  return (
    <Link
      href={cartLength === 0 ? "/products" : `/cart/${userId}`}
      className="relative mr-4"
    >
      <ShoppingCart className="h-5 w-5 text-gray-500" />
      <span className="absolute flex items-center justify-center text-[10px] font-medium -top-3 -right-3 bg-amber-400 text-gray-600 rounded-full w-4 h-4">
        {cartLength}
      </span>
    </Link>
  );
}
