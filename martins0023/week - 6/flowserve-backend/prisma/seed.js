import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define the users you want to add
const usersToSeed = [
  {
    email: 'alice@flowserve.com',
    name: 'Alice Smith',
    password: 'password123',
    walletBalance: 1500.00,
  },
  {
    email: 'bob@flowserve.com',
    name: 'Bob Johnson',
    password: 'password456',
    walletBalance: 750.50,
  },
  {
    email: 'charlie@flowserve.com',
    name: 'Charlie Brown',
    password: 'password789',
    walletBalance: 200.00,
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  for (const userData of usersToSeed) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Using "upsert" is safe. 
    // It finds a user by email. If the user exists, it does nothing.
    // If the user doesn't exist, it creates them.
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {}, // Don't update anything if they already exist
      create: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        walletBalance: userData.walletBalance,
      },
    });

    console.log(`👤 Created or found user: ${user.name} (${user.email})`);
  }

  console.log('✅ Seeding finished.');
}

// --- Run the seed script ---
main()
  .catch((e) => {
    console.error('❌ Error during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Always disconnect from the database
    await prisma.$disconnect();
    console.log('👋 Disconnected from database.');
  });