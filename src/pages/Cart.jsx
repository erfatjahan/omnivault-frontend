import React from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  decreaseQuantity,
  clearCart,
} from "../store/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();

  const cartState = useSelector((state) => state.cart || {});
  
  const rawItems =
    cartState.cartItems ||
    cartState.items ||
    cartState.cart ||
    (Array.isArray(cartState) ? cartState : []);

  const cartItems = Array.isArray(rawItems) ? rawItems : [];

 
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
          
          {/* কার্ট আইটেমস */}
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

              <Link
                to="/payment"
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#9c5b6f] to-[#b36b81] hover:from-[#854b5d] hover:to-[#9c5b6f] border border-white/20 shadow-lg shadow-[#9c5b6f]/30 active:scale-95 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;