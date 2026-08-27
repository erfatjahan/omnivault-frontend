// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { Truck, ShieldCheck, ArrowLeft, Loader2, Sparkles } from "lucide-react";
// import { axiosInstance } from "../lib/axios";
// import { toast } from "react-toastify";

// const Payment = () => {
//   const navigate = useNavigate();
//   const cartState = useSelector((state) => state.cart || {});
//   const { authUser } = useSelector((state) => state.auth || {});
//   const cartItems = cartState.cartItems || cartState.items || [];

//   const [loading, setLoading] = useState(false);
//   const [shippingData, setShippingData] = useState({
//     fullName: authUser?.name || "",
//     phone: authUser?.phone || "",
//     address: "",
//     city: "Chattogram",
//     state: "Chittagong",
//     country: "Bangladesh",
//     pincode: "4000",
//   });

//   const subtotal = cartItems.reduce(
//     (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
//     0
//   );
//   const deliveryFee = subtotal > 1500 || subtotal === 0 ? 0 : 60; // BDT 60
//   const totalAmount = subtotal + deliveryFee;

//   const handleInputChange = (e) => {
//     setShippingData({ ...shippingData, [e.target.name]: e.target.value });
//   };

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const payload = {
//         orderItems: cartItems,
//         totalPrice: totalAmount,
//         shippingInfo: shippingData,
//       };

//       const res = await axiosInstance.post("/payment/ssl-init", payload);

//       if (res.data.gatewayUrl) {
//         // সরাসরি SSLCommerz গেটওয়ে পেজে রিডাইরেক্ট করা
//         window.location.href = res.data.gatewayUrl;
//       } else {
//         toast.error("Failed to load payment gateway");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Payment initiation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#faf8f9] dark:bg-[#0f090c] py-8 sm:py-12">
//       <div className="max-w-4xl mx-auto px-4 space-y-6">
//         <button
//           onClick={() => navigate("/cart")}
//           className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-rose-200/70 hover:text-[#9c5b6f]"
//         >
//           <ArrowLeft className="w-4 h-4" /> Back to Cart
//         </button>

//         <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-12 gap-6">
//           {/* শিপিং ডিটেইলস */}
//           <div className="md:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 space-y-4">
//             <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
//               <Truck className="w-4 h-4 text-[#9c5b6f]" />
//               <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
//                 Delivery Details
//               </h3>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
//               <div className="space-y-1">
//                 <label className="font-semibold text-slate-600 dark:text-rose-100/70">Full Name</label>
//                 <input
//                   type="text"
//                   required
//                   name="fullName"
//                   value={shippingData.fullName}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10"
//                 />
//               </div>

//               <div className="space-y-1">
//                 <label className="font-semibold text-slate-600 dark:text-rose-100/70">Phone Number</label>
//                 <input
//                   type="tel"
//                   required
//                   name="phone"
//                   value={shippingData.phone}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10"
//                 />
//               </div>

//               <div className="space-y-1 sm:col-span-2">
//                 <label className="font-semibold text-slate-600 dark:text-rose-100/70">Full Address</label>
//                 <input
//                   type="text"
//                   required
//                   name="address"
//                   value={shippingData.address}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10"
//                 />
//               </div>

//               <div className="space-y-1">
//                 <label className="font-semibold text-slate-600 dark:text-rose-100/70">City</label>
//                 <input
//                   type="text"
//                   required
//                   name="city"
//                   value={shippingData.city}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10"
//                 />
//               </div>

//               <div className="space-y-1">
//                 <label className="font-semibold text-slate-600 dark:text-rose-100/70">Postal Code</label>
//                 <input
//                   type="text"
//                   required
//                   name="pincode"
//                   value={shippingData.pincode}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* অর্ডার সামারি ও পে বাটন */}
//           <div className="md:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 space-y-4">
//             <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-white/5">
//               Order Summary
//             </h3>

//             <div className="space-y-2 text-xs">
//               <div className="flex justify-between text-slate-500">
//                 <span>Subtotal</span>
//                 <span>৳{subtotal}</span>
//               </div>
//               <div className="flex justify-between text-slate-500">
//                 <span>Delivery</span>
//                 <span>৳{deliveryFee}</span>
//               </div>
//               <div className="flex justify-between font-black text-slate-900 dark:text-slate-100 pt-2 border-t text-sm">
//                 <span>Total Amount</span>
//                 <span className="text-[#9c5b6f]">৳{totalAmount}</span>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading || cartItems.length === 0}
//               className="w-full py-3.5 rounded-2xl bg-[#9c5b6f] hover:bg-[#854b5d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#9c5b6f]/30 transition-all cursor-pointer"
//             >
//               {loading ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : (
//                 <span>Pay ৳{totalAmount} (bKash / Nagad / Card)</span>
//               )}
//             </button>

//             <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
//               <ShieldCheck className="w-4 h-4 text-emerald-500" />
//               <span>SSLCommerz Secured Payment</span>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Payment;