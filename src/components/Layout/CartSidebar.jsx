import React from "react";
import { Link } from "react-router-dom";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleCart } from "../../store/slices/popupSlice";
import {
  addToCart,
  removeFromCart,
  decreaseQuantity,
  clearCart,
} from "../../store/slices/cartSlice";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { isCartOpen } = useSelector((state) => state.popup || {});
  const { cart = [] } = useSelector((state) => state.cart || {});


  const safeCart = Array.isArray(cart) ? cart.filter(Boolean) : [];


  const subtotal = safeCart.reduce((total, item) => {
    const rawPrice = item?.price ?? item?.product?.price ?? 0;
    const rawQuantity = item?.quantity ?? 1;
    return total + (Number(rawPrice) || 0) * (Number(rawQuantity) || 1);
  }, 0);

  const totalItemsCount = safeCart.reduce((total, item) => {
    const rawQuantity = item?.quantity ?? 1;
    return total + (Number(rawQuantity) || 1);
  }, 0);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">

      <div
        onClick={() => dispatch(toggleCart())}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#150d11] border-l border-slate-200/80 dark:border-white/10 shadow-2xl flex flex-col justify-between">
          

          <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#9c5b6f]/10 dark:bg-[#9c5b6f]/20 text-[#9c5b6f] dark:text-[#e4a8b8] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#2b141d] dark:text-[#f7eef1]">
                  Shopping Bag
                </h2>
                <span className="text-xs text-slate-400 dark:text-rose-200/50">
                  {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {safeCart.length > 0 && (
                <button
                  type="button"
                  onClick={() => dispatch(clearCart())}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 transition-colors text-xs font-semibold cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => dispatch(toggleCart())}
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-rose-100 transition-all cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {safeCart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-white/20">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#2b141d] dark:text-[#f7eef1]">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-rose-200/50 mt-1 max-w-[200px]">
                    Looks like you haven't added any items to your bag yet.
                  </p>
                </div>
                <Link
                  to="/products"
                  onClick={() => dispatch(toggleCart())}
                  className="px-6 py-2.5 rounded-2xl bg-[#9c5b6f] text-white text-xs font-bold shadow-md shadow-[#9c5b6f]/25 hover:bg-[#854b5d] transition-all"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              safeCart.map((item, index) => {
                const prod = item?.product || item || {};
                const itemId = item?.id || item?._id || prod?.id || prod?._id || `item-${index}`;
                const itemName = prod?.name || prod?.title || "Untitled Product";
                const itemPrice = Number(prod?.price ?? item?.price ?? 0);
                const quantity = Number(item?.quantity) || 1;
                
                const imageSrc =
                  prod?.images?.[0]?.url ||
                  prod?.images?.[0] ||
                  prod?.image ||
                  item?.image ||
                  "https://placehold.co/200x200?text=Product";

                return (
                  <div
                    key={itemId}
                    className="flex gap-4 p-3 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-white/5 flex-shrink-0 border border-slate-200/50 dark:border-white/5">
                      <img
                        src={imageSrc}
                        alt={itemName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/200x200?text=Product";
                        }}
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-[#2b141d] dark:text-[#f7eef1] line-clamp-1">
                          {itemName}
                        </h4>
                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCart(itemId))}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-extrabold text-[#9c5b6f] dark:text-[#e4a8b8]">
                          {(itemPrice * quantity).toFixed(2)}
                        </span>


                        <div className="flex items-center gap-2 bg-white dark:bg-white/10 rounded-xl border border-slate-200/80 dark:border-white/10 px-2 py-1">
                          <button
                            type="button"
                            onClick={() => dispatch(decreaseQuantity(itemId))}
                            className="text-slate-500 hover:text-slate-900 dark:text-rose-200 dark:hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-slate-800 dark:text-white min-w-[16px] text-center">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
                            className="text-slate-500 hover:text-slate-900 dark:text-rose-200 dark:hover:text-white cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {safeCart.length > 0 && (
            <div className="p-6 border-t border-slate-100 dark:border-white/10 space-y-4 bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500 dark:text-rose-200/60 font-medium">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-rose-200/60 font-medium">
                  <span>Shipping</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Free</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#2b141d] dark:text-[#f7eef1] pt-2 border-t border-slate-200/60 dark:border-white/10">
                  <span>Estimated Total</span>
                  <span className="text-[#9c5b6f] dark:text-[#e4a8b8] text-base">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  to="/cart"
                  onClick={() => dispatch(toggleCart())}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#9c5b6f] hover:bg-[#854b5d] text-white text-xs font-bold shadow-lg shadow-[#9c5b6f]/25 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartSidebar;