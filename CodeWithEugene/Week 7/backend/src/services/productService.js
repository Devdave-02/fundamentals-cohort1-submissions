// In-memory product store (replace with database in production)
const products = [
  { id: 1, name: 'Laptop', price: 999.99, stock: 10, category: 'Electronics' },
  { id: 2, name: 'Mouse', price: 29.99, stock: 50, category: 'Electronics' },
  { id: 3, name: 'Keyboard', price: 79.99, stock: 30, category: 'Electronics' }
];

let nextId = 4;

const getAllProducts = (filters = {}) => {
  let filtered = [...products];

  if (filters.category) {
    filtered = filtered.filter(p => p.category === filters.category);
  }

  if (filters.minPrice) {
    filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
  }

  if (filters.maxPrice) {
    filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
  }

  return filtered;
};

const getProductById = (id) => {
  return products.find(p => p.id === parseInt(id));
};

const createProduct = (productData) => {
  const newProduct = {
    id: nextId++,
    name: productData.name,
    price: parseFloat(productData.price),
    stock: parseInt(productData.stock) || 0,
    category: productData.category,
    createdAt: new Date().toISOString()
  };

  products.push(newProduct);
  return newProduct;
};

const updateProduct = (id, productData) => {
  const index = products.findIndex(p => p.id === parseInt(id));
  if (index === -1) {
    throw new Error('Product not found');
  }

  products[index] = {
    ...products[index],
    ...productData,
    id: parseInt(id),
    updatedAt: new Date().toISOString()
  };

  return products[index];
};

const deleteProduct = (id) => {
  const index = products.findIndex(p => p.id === parseInt(id));
  if (index === -1) {
    throw new Error('Product not found');
  }

  products.splice(index, 1);
  return true;
};

const updateStock = (id, quantity) => {
  const product = getProductById(id);
  if (!product) {
    throw new Error('Product not found');
  }

  if (product.stock + quantity < 0) {
    throw new Error('Insufficient stock');
  }

  product.stock += quantity;
  return product;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
};
