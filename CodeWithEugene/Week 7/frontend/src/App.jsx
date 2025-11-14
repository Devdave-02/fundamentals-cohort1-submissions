import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE_URL = 'http://localhost:3000/api'

function App() {
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'))
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', name: '' })

  useEffect(() => {
    if (authToken) {
      setIsAuthenticated(true)
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
      loadUserProfile()
    }
  }, [authToken])

  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts()
    } else if (activeTab === 'orders' && isAuthenticated) {
      loadOrders()
    }
  }, [activeTab, isAuthenticated])

  const loadProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API_BASE_URL}/products`)
      setProducts(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const loadOrders = async () => {
    if (!authToken) return
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`)
      setOrders(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const loadUserProfile = async () => {
    if (!authToken) return
    try {
      const response = await axios.get(`${API_BASE_URL}/users/profile`)
      setUser(response.data)
    } catch (err) {
      console.error('Failed to load user profile:', err)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, registerForm)
      const token = response.data.token
      setAuthToken(token)
      localStorage.setItem('authToken', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setIsAuthenticated(true)
      setUser(response.data.user)
      setSuccess('Registration successful!')
      setRegisterForm({ email: '', password: '', name: '' })
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, loginForm)
      const token = response.data.token
      setAuthToken(token)
      localStorage.setItem('authToken', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setIsAuthenticated(true)
      setUser(response.data.user)
      setSuccess('Login successful!')
      setLoginForm({ email: '', password: '' })
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setAuthToken(null)
    localStorage.removeItem('authToken')
    delete axios.defaults.headers.common['Authorization']
    setIsAuthenticated(false)
    setUser(null)
    setSuccess('Logged out successfully')
  }

  const handleCreateOrder = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      setError('Please login to create an order')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, {
        items: [{ productId, quantity }]
      })
      setSuccess(`Order created successfully! Order ID: ${response.data.id}`)
      loadOrders()
      loadProducts() // Refresh products to update stock
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`
  }

  return (
    <div className="container">
      <div className="header">
        <h1>CodePilot E-Commerce Platform</h1>
        {isAuthenticated && user && (
          <div>
            <p>Welcome, {user.name} ({user.email})</p>
            <button onClick={handleLogout} style={{ marginTop: '10px' }} className="danger">
              Logout
            </button>
          </div>
        )}
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {!isAuthenticated ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>

          <div className="card">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button
              className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              My Orders
            </button>
          </div>

          <div className={`tab-content ${activeTab === 'products' ? 'active' : ''}`}>
            <div className="card">
              <h2>Products</h2>
              {loading ? (
                <div className="loading">Loading products...</div>
              ) : (
                <div className="product-grid">
                  {products.map((product) => (
                    <div key={product.id} className="product-card">
                      <h3>{product.name}</h3>
                      <div className="price">{formatPrice(product.price)}</div>
                      <div className="stock">Stock: {product.stock}</div>
                      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                        Category: {product.category}
                      </div>
                      <button
                        onClick={() => handleCreateOrder(product.id, 1)}
                        disabled={product.stock === 0 || loading}
                        style={{ marginTop: '15px', width: '100%' }}
                      >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={`tab-content ${activeTab === 'orders' ? 'active' : ''}`}>
            <div className="card">
              <h2>My Orders</h2>
              {loading ? (
                <div className="loading">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="loading">No orders yet</div>
              ) : (
                <div>
                  {orders.map((order) => (
                    <div key={order.id} className="card" style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <h3>Order #{order.id}</h3>
                        <span className={`status ${order.status}`}>{order.status}</span>
                      </div>
                      <div>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-item">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>{item.productName} x {item.quantity}</span>
                              <span>{formatPrice(item.subtotal)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="order-total">Total: {formatPrice(order.total)}</div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                        Created: {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default App
