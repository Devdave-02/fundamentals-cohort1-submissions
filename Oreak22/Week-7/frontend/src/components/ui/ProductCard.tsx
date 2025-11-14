import React from "react";
import { type Product } from "../../types/product";
import { Card } from "./card";
import { Link } from "react-router-dom";
import { Button } from "./button";

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Card className="flex flex-col px-3">
      <div className="h-40 mb-3 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full object-cover"
          />
        ) : (
          <div className="text-sm text-gray-500">No image</div>
        )}
      </div>
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">
        {product.description}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <div className="font-semibold">${product.price.toFixed(2)}</div>
        <Link to={`/products/${product._id}`}>
          <Button variant="ghost">View</Button>
        </Link>
      </div>
    </Card>
  );
};
