import { CartProductType } from "@/_lib/actions";
import Image from "next/image";

export default function CartList({ product }: { product: CartProductType }) {
  return (
    <div className="max-w-sm overflow-hidden rounded-lg shadow-lg">
      <div className="relative aspect-[3/2]">
        <Image
          src={product.productId.image}
          alt={product.productId.name}
          fill
          sizes="20"
          className="object-cover hover:scale-105 transition-all duration-300"
        />
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{product.productId.name}</h2>
        <p className="text-gray-700 mb-4">
          <b>Price:</b> ${product.productId.price}
        </p>
        <p className="text-gray-700 mb-4">
          <b>Description:</b> {product.productId.description}
        </p>
        <p className="text-gray-700">
          <b>Quantity:</b> {product.quantity}
        </p>
      </div>
    </div>
  );
}
