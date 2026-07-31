import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './components/pages/Home'
import Shop from './components/pages/Shop'
import Cart from './components/pages/Cart'
import Login from './components/pages/Login'
import Register from './components/pages/Register'
import ProductDetails from './components/pages/ProductDetails'
import Checkout from './components/pages/Checkout'
import OrderConfirmation from './components/pages/OrderConfirmation'
import WhatsAppButton from './components/common/WhatsAppButton'
import UserDashboard from './components/pages/UserDashboard'
import About from './components/pages/About'
import Wishlist from './components/pages/Wishlist'  // ← ADDED THIS IMPORT
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminProducts from './components/admin/AdminProducts'
import AdminOrders from './components/admin/AdminOrders'
import AdminCategories from './components/admin/AdminCategories'
import AdminProductForm from './components/admin/AdminProductForm'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="about" element={<About />} />
          <Route path="wishlist" element={<Wishlist />} />  {/* ← ADDED THIS ROUTE */}
        </Route>

        {/* Admin Routes - Protected */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/create" element={<AdminProductForm />} />
          <Route path="products/edit/:id" element={<AdminProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>
      </Routes>
      <WhatsAppButton />
    </Router>
  )
}

export default App