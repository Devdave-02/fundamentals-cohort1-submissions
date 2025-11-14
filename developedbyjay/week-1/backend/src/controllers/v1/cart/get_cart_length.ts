import { NextFunction, Request, Response } from "express";
import { catchAsync } from "@/_lib/appError";
import { Cart } from "@/models/cart";

const getCartLength = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const cartItems = await Cart.find({ userId });
    const cartLength = cartItems.reduce((total, item) => {
      return total + item.products.length;
    }, 0);

    res.status(200).json({
      success: true,
      itemCount: cartLength,
    });
  }
);
export { getCartLength };

// async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const product = await Cart.findOne({ userId }).exec();
//     const itemCount = product ? product.products.length : 0;

//     res.status(200).json({
//       success: true,
//       itemCount,
//     });
//   } catch (error) {
//     console.error("Error fetching cart item count:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
