"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { apiClient } from "../server/client";
import { ProductsType } from "../server/types";
import { getUserIdFromHeaders, getAccessTokenFromHeaders } from "../auth";
import { revalidatePath } from "next/cache";

export const loginAction = async (prevState: unknown, formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  const response = await apiClient.post<{ accessToken: string }>(
    "/auth/login",
    {
      email,
      password,
    }
  );
  if (!response.accessToken) {
    throw new Error("Login failed");
  }

  const cookieStore = await cookies();

  cookieStore.set("accessToken", response.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60,
  });

  redirect("/products");
};

export const getProducts = async () => {
  const accessToken = await getAccessTokenFromHeaders();

  try {
    const products = await apiClient.get<ProductsType>(
      "/products/get-all-products",
      accessToken
    );
    return products.data;
  } catch (error) {
    console.error("Get products error:", error);
    throw error;
  }
};

export const getCartItemsLength = async () => {
  const accessToken = await getAccessTokenFromHeaders();
  const userId = await getUserIdFromHeaders();

  try {
    const response = await apiClient.get<{ itemCount: number }>(
      `/cart/get-cart-item-length/${userId}`,
      accessToken
    );
    return {
      itemCount: response.itemCount,
      userId,
    };
  } catch (error) {
    console.error("Get cart items length error:", error);
    throw error;
  }
};

export const addToCart = async (productId: string, quantity: number = 1) => {
  const accessToken = await getAccessTokenFromHeaders();
  const userId = await getUserIdFromHeaders();

  try {
    await apiClient.post(
      "/cart/add-to-cart",
      {
        userId,
        productId,
        quantity,
      },
      accessToken
    );
  } catch (error) {
    console.error("Add to cart error:", error);
    throw error;
  }

  revalidatePath("/products");
};

interface CartProducts {
  data: {
    products: {
      productId: {
        _id: string;
        name: string;
        price: number;
        image: string;
        description: string;
      };
      quantity: number;
    }[];
  }[];
}

export type CartProductType = CartProducts["data"][number]["products"][number];

export const getCartItems = async ({ id }: { id: string }) => {
  // I could have added the userId from headers directly in the getCart Endpoint but i choose the follow the same pattern as the backend for consistency

  // Just to make sure the frontend has the "http://localhost:3000/cart/68d5e5e4722d5657335c5d576" route and not "http://localhost:3000/cart"


  const accessToken = await getAccessTokenFromHeaders();

  let response;
  try {
    response = await apiClient.get<CartProducts>(
      `/cart/get-cart/${id}`,
      accessToken
    );
  } catch (error) {
    console.error("Get cart items error:", error);
    throw error;
  }

  return response.data[0].products;
};
