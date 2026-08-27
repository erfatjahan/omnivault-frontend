import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  Loader2, 
  CreditCard, 
  Banknote, 
  CheckCircle2 
} from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { clearCart } from "../store/slices/cartSlice";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

 
  const cartState = useSelector((state) => state.cart || {});
  const { authUser } = useSelector((state) => state.auth || {});

  const localSavedCart = (() => {
    try {
      return JSON.parse(localStorage.getItem("cartItems") || "[]");
    } catch {
      return [];
    }
  })();

  const rawItems = 
    cartState.cartItems || 
    cartState.items || 
    cartState.cart || 
    (Array.isArray(cartState) ? cartState : []) || 
    localSavedCart;

  const cartItems = Array.isArray(rawItems) && rawItems.length > 0 ? rawItems : localSavedCart;

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("sslcommerz");

  const [shippingData, setShippingData] = useState({
    fullName: authUser?.name || authUser?.fullName || "",
    phone: authUser?.phone || "",
    address: "",
    city: "Chattogram",
    state: "Chittagong",
    country: "Bangladesh",
    pincode: "4000",
  });


  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.price ?? item.unit_price ?? 0);
    const qty = Number(item.quantity ?? item.qty ?? 1);
    return acc + price * qty;
  }, 0);

  const deliveryFee = subtotal >= 1500 || subtotal === 0 ? 0 : 60;
  const tax = Number((subtotal * 0.05).toFixed(2));
  const totalAmount = Math.round(subtotal + deliveryFee + tax);

  const handleInputChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleProcessOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty! Please add products.");
      return;
    }

    setLoading(true);

    try {
     
      const orderPayload = {
        full_name: shippingData.fullName,
        phone: shippingData.phone,
        address: shippingData.address,
        city: shippingData.city,
        state: shippingData.state,
        country: shippingData.country,
        pincode: shippingData.pincode,
        payment_method: paymentMethod === "cod" ? "COD" : "SSLCommerz",
        orderedItems: cartItems.map((item) => ({
          product: {
            id: item.id || item.productId || item._id,
            name: item.name || item.title || "Product",
            price: Number(item.price ?? item.unit_price ?? 0),
            images: [{ url: item.image || (Array.isArray(item.images) ? item.images[0] : "") }],
          },
          quantity: Number(item.quantity ?? item.qty ?? 1),
        })),
      };

     
      const orderRes = await axiosInstance.post("/order/new", orderPayload);
      const orderId = orderRes.data.orderId || orderRes.data.order?.id;

     
      if (paymentMethod === "cod") {
        dispatch(clearCart());
        localStorage.removeItem("cartItems");
        toast.success("Order placed successfully with Cash on Delivery!");
        navigate("/orders");
        return;
      }

      const sslRes = await axiosInstance.post("/payment/ssl-init", {
        orderId,
        totalPrice: totalAmount,
        shippingInfo: {
          fullName: shippingData.fullName,
          phone: shippingData.phone,
          address: shippingData.address,
          city: shippingData.city,
          state: shippingData.state,
          pincode: shippingData.pincode,
        },
      });

      if (sslRes.data?.gatewayUrl) {
        dispatch(clearCart());
        localStorage.removeItem("cartItems");
        
        window.location.href = sslRes.data.gatewayUrl;
      } else {
        toast.error("Failed to connect to SSLCommerz gateway.");
      }
    } catch (error) {
      console.error("Order processing error:", error);
      toast.error(error.response?.data?.message || "Failed to process order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f9] dark:bg-[#0f090c] py-8 sm:py-12 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-rose-200/70 hover:text-[#9c5b6f]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </button>

        <form onSubmit={handleProcessOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
       
          <div className="lg:col-span-7 space-y-6">
            
            {/* ১. শিপিং ইনফরমেশন */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-white/5">
                <Truck className="w-4 h-4 text-[#9c5b6f]" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  Delivery Address
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-rose-100/80">Full Name</label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={shippingData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#9c5b6f]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-rose-100/80">Phone Number</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={shippingData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#9c5b6f]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-rose-100/80">Full Address</label>
                  <input
                    type="text"
                    required
                    name="address"
                    value={shippingData.address}
                    onChange={handleInputChange}
                    placeholder="House, Road, Area"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#9c5b6f]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-rose-100/80">City</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={shippingData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#9c5b6f]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-rose-100/80">Postal Code</label>
                  <input
                    type="text"
                    required
                    name="pincode"
                    value={shippingData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#9c5b6f]"
                  />
                </div>
              </div>
            </div>

           
            <div className="p-6 rounded-[32px] bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-white/5">
                Select Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* SSLCommerz Online */}
                <div
                  onClick={() => setPaymentMethod("sslcommerz")}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    paymentMethod === "sslcommerz"
                      ? "border-[#9c5b6f] bg-[#9c5b6f]/5"
                      : "border-slate-200/80 dark:border-white/10 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-[#9c5b6f]/10 text-[#9c5b6f]">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    {paymentMethod === "sslcommerz" && (
                      <CheckCircle2 className="w-4 h-4 text-[#9c5b6f]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Online Payment
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      bKash, Nagad, Rocket, Cards
                    </p>
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    paymentMethod === "cod"
                      ? "border-[#9c5b6f] bg-[#9c5b6f]/5"
                      : "border-slate-200/80 dark:border-white/10 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                      <Banknote className="w-5 h-5" />
                    </div>
                    {paymentMethod === "cod" && (
                      <CheckCircle2 className="w-4 h-4 text-[#9c5b6f]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      Cash on Delivery
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Pay with cash when delivered
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

         
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-6 sticky top-24">
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight pb-3 border-b border-slate-100 dark:border-white/10">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {deliveryFee === 0 ? "Free" : deliveryFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Vat (5%)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{tax.toFixed(2)}</span>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex justify-between items-baseline">
                  <span className="font-extrabold text-slate-900 dark:text-slate-100">Total Payable</span>
                  <span className="text-2xl font-black text-[#9c5b6f] dark:text-[#e4a8b8]">
                    {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#9c5b6f] to-[#b36b81] hover:from-[#854b5d] hover:to-[#9c5b6f] shadow-lg shadow-[#9c5b6f]/30 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : paymentMethod === "cod" ? (
                  <span>Place Order (Cash on Delivery)</span>
                ) : (
                  <span>Proceed to Pay {totalAmount.toFixed(2)} (bKash/Cards)</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Secure Checkout</span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Payment;