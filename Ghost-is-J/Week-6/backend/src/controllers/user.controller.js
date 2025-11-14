import {PrismaClient} from "@prisma/client";
import {z} from "zod";

const prisma = new PrismaClient();

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email format"),
  balance: z.number().nonnegative().optional()
});

export const createUser = async (req, res, next) => {
  try {
    const {name, email, balance} = userSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({where: {email}});
    if (existingUser) {
      return res.status(409).json({
        status: "fail",
        message: "Email already exists"
      });
    }

    const user = await prisma.user.create({
      data: {name, email, balance: balance || 0}
    });

    res.status(201).json({
      status: "success",
      data: user
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalUsers = await prisma.user.count();

        const users = await prisma.user.findMany({
            skip,
            take: limit,
            orderBy: {createdAt: "desc"}
        });

        res.status(200).json({
            status: "success",
            page,
            limit,
            total: totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            data: users
        });
    }   catch (err) {
        next(err);
    }
};

export const getUserById = async (req, res, next) => {
  try {
    const {id} = req.params;

    const user = await prisma.user.findUnique({
      where: {id: parseInt(id)}
    });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found"
      });
    }

    res.status(200).json({
      status: "success",
      data: user
    });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const {id} = req.params;

    const updateUserSchema = z.object({
      name: z.string().min(2, "Name must be at least 2 characters").optional(),
      email: z.string().email("Invalid email format").optional(),
      balance: z.number().nonnegative("Balance must be positive").optional()
    });

    const validatedData = updateUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: {id: parseInt(id)}
    });

    if (!existingUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found"
      });
    }

    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailInUse = await prisma.user.findUnique({
        where: {email: validatedData.email}
      });

      if (emailInUse) {
        return res.status(409).json({
          status: "fail",
          message: "Email already in use"
        });
      }
    }

    // Perform update
    const updatedUser = await prisma.user.update({
      where: {id: parseInt(id)},
      data: validatedData
    });

    res.status(200).json({
      status: "success",
      data: updatedUser
    });
  } catch (err) {
    next(err);
  }
};
