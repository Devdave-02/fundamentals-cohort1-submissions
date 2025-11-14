"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { ProductType } from "@/_lib/server/types";
import { addToCart } from "@/_lib/actions";
import React from "react";
import { toast } from "react-toastify";

export default function ProductCard({ product }: { product: ProductType }) {
  const [loading, setIsLoading] = React.useState(false);

  function handleAddToCart(id: string) {
    setIsLoading(true);
    addToCart(id).finally(() => {
      setIsLoading(false);
      toast.success("Product added to cart");
    });
  }

  return (
    <div className="shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-[2/3]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-all duration-300"
        />
      </div>

      <div className="flex flex-col gap-4 p-4 bg-gray-100 ">
        <h1 className="text-sm font-medium">{product.name}</h1>

        <div className="flex items-center justify-between">
          <span className="font-medium">${product.price.toFixed(2)}</span>
          <button
            onClick={() => handleAddToCart(product._id)}
            className={`cursor-pointer hover:text-white hover:bg-black transition-all  ring-1 ring-gray-200
             shadow-lg rounded-md px-2 py-1 text-sm justify-center flex items-center  gap-2 `}
          >
            <ShoppingCart className="w-4 h-4" />
            {loading ? "Adding..." : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
