const Product = require('../models/Product');

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 199.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    stock: 50,
    isActive: true
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking watch with heart rate monitor, GPS, and water resistance.',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    stock: 30,
    isActive: true
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt in various colors.',
    price: 29.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    stock: 100,
    isActive: true
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Premium genuine leather crossbody bag with multiple compartments.',
    price: 89.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    stock: 25,
    isActive: true
  },
  {
    name: 'Coffee Maker Pro',
    description: 'Professional-grade coffee maker with programmable settings and thermal carafe.',
    price: 149.99,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
    stock: 40,
    isActive: true
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with extra cushioning and carrying strap.',
    price: 49.99,
    category: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
    stock: 75,
    isActive: true
  },
  {
    name: 'Wireless Phone Charger',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 39.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
    stock: 60,
    isActive: true
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with advanced cushioning and breathable mesh.',
    price: 129.99,
    category: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    stock: 45,
    isActive: true
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with 360-degree sound and waterproof design.',
    price: 79.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    stock: 35,
    isActive: true
  },
  {
    name: 'Denim Jeans',
    description: 'Classic fit denim jeans made from sustainable materials.',
    price: 69.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    stock: 80,
    isActive: true
  }
];

const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Seeded ${products.length} products successfully`);

    return products;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
};

module.exports = { seedProducts, sampleProducts };
