import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, Sparkles, Gift, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  decreaseQuantity,
  clearCart,
} from "../store/slices/cartSlice";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = () => {
  const dispatch = useDispatch();

  const cartState = useSelector((state) => state.cart || {});
  
  const rawItems =
    cartState.cartItems ||
    cartState.items ||
    cartState.cart ||
    (Array.isArray(cartState) ? cartState : []);

  const cartItems = Array.isArray(rawItems) ? rawItems : [];

  // Pay-For-Me & Shipping Modal States
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [payForMeLoading, setPayForMeLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    country: "Bangladesh",
    state: "",
  });

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(item.price ?? item.unit_price ?? item.cost ?? 0);
    const qty = Number(item.quantity ?? item.qty ?? 1);
    return acc + price * qty;
  }, 0);

  const shippingFee = subtotal >= 1500 || subtotal === 0 ? 0 : 60.0;
  const estimatedTax = subtotal * 0.05;
  const totalAmount = subtotal + shippingFee + estimatedTax;

  const handleIncrease = (item) => {
    const currentQty = Number(item.quantity ?? item.qty ?? 1);
    const stock = Number(item.stock ?? 10);
    if (currentQty >= stock) return;

    dispatch(
      addToCart({
        ...item,
        quantity: 1,
      })
    );
  };

  const handleDecrease = (item) => {
    const currentQty = Number(item.quantity ?? item.qty ?? 1);
    const itemId = item.id || item.productId || item._id;

    if (currentQty <= 1) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(decreaseQuantity ? decreaseQuantity(itemId) : removeFromCart(itemId));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleGeneratePayForMeLink = async (e) => {
    e.preventDefault();

    const { full_name, phone, address, city, pincode } = shippingInfo;
    if (!full_name || !phone || !address || !city || !pincode) {
      toast.error("Please fill in all required shipping details.");
      return;
    }

    try {
      setPayForMeLoading(true);

      const payload = {
        orderedItems: cartItems,
        shipping_info: shippingInfo,
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/v1/orders/pay-for-me/create",
        payload,
        { withCredentials: true }
      );

      if (data.success) {
        setPaymentUrl(data.paymentUrl);
        setShowAddressModal(false);
        setShowShareModal(true);
        toast.success("Pay-For-Me link generated successfully!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate payment link."
      );
    } finally {
      setPayForMeLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentUrl);
    toast.info("Payment link copied to clipboard!");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 select-none">
        <div className="text-center max-w-md p-8 sm:p-10 rounded-[32px] bg-white/70 dark:bg-[#150d11]/80 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-5">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#9c5b6f]/10 dark:bg-[#9c5b6f]/20 flex items-center justify-center text-[#9c5b6f] dark:text-[#e4a8b8]">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Your Cart is Empty
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-rose-200/60 leading-relaxed">
              Looks like you haven't added anything to your cart yet. Explore our products to find what you need.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#9c5b6f] to-[#b36b81] hover:from-[#854b5d] hover:to-[#9c5b6f] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#9c5b6f]/30 active:scale-95 transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f9] dark:bg-[#0f090c] py-8 sm:py-12 select-none transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9c5b6f]/10 dark:bg-[#9c5b6f]/20 text-[#9c5b6f] dark:text-[#e4a8b8] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Shopping Bag</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Review Your Cart ({cartItems.reduce((total, item) => total + (Number(item.quantity ?? item.qty) || 1), 0)})
            </h1>
          </div>

          {clearCart && (
            <button
              type="button"
              onClick={() => dispatch(clearCart())}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 self-start sm:self-auto cursor-pointer transition-colors"
            >
              Clear Entire Bag
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item, idx) => {
              const itemId = item.id || item.productId || item._id || idx;
              const itemPrice = Number(item.price ?? item.unit_price ?? 0);
              const itemQty = Number(item.quantity ?? item.qty ?? 1);
              const itemTotal = itemPrice * itemQty;
              const itemImage = item.image || (Array.isArray(item.images) ? item.images[0] : "https://placehold.co/600x600?text=Product");

              return (
                <div
                  key={itemId}
                  className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-6 group transition-all"
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 flex-shrink-0 border border-slate-100 dark:border-white/5">
                    <img
                      src={typeof itemImage === "string" ? itemImage : itemImage?.url}
                      alt={item.name || "Product"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 min-w-0 w-full space-y-1">
                    <Link
                      to={`/product/${item.productId || item.id || item._id}`}
                      className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 hover:text-[#9c5b6f] dark:hover:text-[#e4a8b8] transition-colors truncate block"
                    >
                      {item.name || item.title || "Product"}
                    </Link>

                    <p className="text-xs text-slate-400">
                      Unit Price: <span className="font-semibold text-slate-600 dark:text-rose-200/70">{itemPrice.toFixed(2)}</span>
                    </p>

                    <div className="pt-2 text-sm sm:text-base font-black text-[#9c5b6f] dark:text-[#e4a8b8]">
                      {itemTotal.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                    <div className="inline-flex items-center rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 p-1">
                      <button
                        type="button"
                        onClick={() => handleDecrease(item)}
                        className="p-1.5 rounded-xl text-slate-600 dark:text-rose-100 hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-slate-900 dark:text-slate-100">
                        {itemQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleIncrease(item)}
                        className="p-1.5 rounded-xl text-slate-600 dark:text-rose-100 hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(itemId)}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-[32px] bg-white dark:bg-[#150d11] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-6 sticky top-24">
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight pb-3 border-b border-slate-100 dark:border-white/10">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-500 dark:text-rose-200/60">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-slate-500 dark:text-rose-200/60">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-500 uppercase text-[11px] font-black">Free</span>
                    ) : (
                      shippingFee.toFixed(2)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500 dark:text-rose-200/60">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{estimatedTax.toFixed(2)}</span>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex justify-between items-baseline">
                  <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100">Total</span>
                  <span className="text-2xl font-black text-[#9c5b6f] dark:text-[#e4a8b8]">
                    {totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  to="/payment"
                  className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#9c5b6f] to-[#b36b81] hover:from-[#854b5d] hover:to-[#9c5b6f] border border-white/20 shadow-lg shadow-[#9c5b6f]/30 active:scale-95 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setShowAddressModal(true)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm text-[#9c5b6f] dark:text-[#e4a8b8] bg-[#9c5b6f]/10 dark:bg-[#9c5b6f]/20 hover:bg-[#9c5b6f]/20 dark:hover:bg-[#9c5b6f]/30 border border-[#9c5b6f]/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Gift className="w-4 h-4" />
                  <span>Ask Someone to Pay (Pay-For-Me)</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {showAddressModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#150d11] border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-[32px] max-w-lg w-full shadow-2xl space-y-5 relative">
            <button
              onClick={() => setShowAddressModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Enter Shipping Details
              </h3>
              <p className="text-xs text-slate-500 dark:text-rose-200/60 mt-1">
                Provide where you want the order delivered. This info stays private from the sponsor.
              </p>
            </div>

            <form onSubmit={handleGeneratePayForMeLink} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={shippingInfo.full_name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    placeholder="017xxxxxxxx"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Street Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  placeholder="House/Road, Area"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    placeholder="Chittagong"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    placeholder="Chittagong"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={shippingInfo.pincode}
                    onChange={handleInputChange}
                    placeholder="4000"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-700 dark:text-slate-200 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={payForMeLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#9c5b6f] to-[#b36b81] text-white font-bold text-xs shadow-lg shadow-[#9c5b6f]/30 active:scale-95 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {payForMeLoading ? "Generating Link..." : "Generate Payment Link"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#150d11] border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-[32px] max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#9c5b6f]/10 dark:bg-[#9c5b6f]/20 flex items-center justify-center text-[#9c5b6f] dark:text-[#e4a8b8]">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Share Payment Link
                </h3>
                <p className="text-xs text-slate-500 dark:text-rose-200/60">
                  Your address is saved securely.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Send this unique link to a friend or family member so they can complete the payment for your order:
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={paymentUrl}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-slate-700 dark:text-slate-200 font-mono outline-none"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="px-5 py-3 rounded-xl bg-[#9c5b6f] hover:bg-[#854b5d] text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
              >
                Copy
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
              >
                Done / Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;