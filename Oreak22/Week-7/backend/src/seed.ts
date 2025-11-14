import Product from "./models/product.model";
import User from "./models/user.model";
import bcrypt from "bcryptjs";

export const seedSampleData = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.create([
      { name: "Keyboard", price: 29.99 },
      { name: "Mouse", price: 19.99 },
      { name: "Monitor", price: 129.99 },
    ]);
    console.log("Seeded products");
  }

  const users = await User.countDocuments();
  if (users === 0) {
    const password = await bcrypt.hash("password123", 10);
    await User.create({ email: "test@codepilot.local", password });
    console.log("Seeded user");
  }
};
