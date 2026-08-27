import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastContainer } from "react-toastify";

// Layout Components
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import SearchOverlay from "./components/Layout/SearchOverlay";
import CartSidebar from "./components/Layout/CartSidebar";
import ProfilePanel from "./components/Layout/ProfilePanel";
import LoginModal from "./components/Layout/LoginModal";
import Footer from "./components/Layout/Footer";

// Pages
import Index from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Redux Actions
import { getuser } from "./store/slices/authSlice";
import { fetchAllProducts } from "./store/slices/productSlice";

const App = () => {
  const dispatch = useDispatch();
  const { authUser,isCheckingAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getuser());
  }, [getuser]);
  
  useEffect(() => {
    dispatch(getuser());
    dispatch(fetchAllProducts());
  }, [dispatch]);
const {products}=useSelector(state=>state.product)
  if ((isCheckingAuth&&!authUser)||!products) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#120b0e]">
        <div className="w-10 h-10 border-4 border-[#9c5b6f]/30 border-t-[#9c5b6f] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white dark:bg-[#120b0e] text-[#2b141d] dark:text-[#f7eef1] transition-colors duration-300 flex flex-col justify-between">
          <div>
            <Navbar />
            <Sidebar />
            <SearchOverlay />
            <CartSidebar />
            <ProfilePanel />
            <LoginModal />

            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/password/reset/:token" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          <Footer />
        </div>
        <ToastContainer position="bottom-right" theme="colored" autoClose={3000} />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;