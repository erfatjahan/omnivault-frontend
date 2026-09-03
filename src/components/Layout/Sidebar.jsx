import React from "react";
import {
  X,
  Home,
  Package,
  ShoppingBag,
  Info,
  Phone,
  HelpCircle,
  LogOut,
  User,
  LogIn,
  ClipboardList,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { resetOrder } from "../../store/slices/orderSlice";
import { clearCart } from "../../store/slices/cartSlice";
import { toggleSidebar, toggleAuthPopup, toggleCart } from "../../store/slices/popupSlice";

const Sidebar = () => {
  const { authUser } = useSelector((state) => state.auth || {});
  const { isSidebarOpen } = useSelector((state) => state.popup || { isSidebarOpen: false });

  const cartState = useSelector((state) => state.cart || {});
  const cart = cartState.cart || cartState.cartItems || cartState.items || [];
  
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const cartItemsCount =
    cart?.reduce((total, item) => total + (Number(item?.quantity ?? item?.qty ?? 1) || 1), 0) || 0;

  const menuItems = [
    { name: "Home", path: "/", icon: Home, type: "link" },
    { name: "Products", path: "/products", icon: Package, type: "link" },
    { name: "Shopping Bag", icon: ShoppingBag, type: "cart", badge: cartItemsCount },
    ...(authUser
      ? [{ name: "My Orders", path: "/orders", icon: ClipboardList, type: "link" }]
      : []),
    { name: "About Us", path: "/about", icon: Info, type: "link" },
    { name: "Contact", path: "/contact", icon: Phone, type: "link" },
    { name: "FAQ", path: "/faq", icon: HelpCircle, type: "link" },
  ];

  const handleOpenAuth = () => {
    dispatch(toggleSidebar());
    dispatch(toggleAuthPopup());
  };

  const handleItemClick = (item) => {
    dispatch(toggleSidebar());
    if (item.type === "cart") {
      dispatch(toggleCart());
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      dispatch(resetOrder());
      dispatch(clearCart());
      try {
        localStorage.removeItem("shippingInfo");
        localStorage.removeItem("shippingAddress");
        localStorage.removeItem("cart");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("myOrders");
      } catch (e) {
        console.error(e);
      }
      dispatch(toggleSidebar());
      navigate("/");
    }
  };

  if (!isSidebarOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in cursor-pointer"
        onClick={() => dispatch(toggleSidebar())}
      />
      <aside className="fixed top-2 bottom-2 left-2 md:top-4 md:bottom-4 md:left-4 z-50 w-[82vw] max-w-[320px] md:w-72 bg-white/95 dark:bg-[#150d11]/95 md:bg-white/80 md:dark:bg-black/60 backdrop-blur-2xl rounded-3xl md:rounded-[36px] border border-white/60 dark:border-white/10 shadow-2xl shadow-black/20 flex flex-col justify-between p-4 md:p-5 transition-all duration-300 ease-in-out animate-in slide-in-from-left">
        
        {/* Top Header & Menu */}
        <div className="w-full flex flex-col overflow-y-auto scrollbar-hide">
          <div className="flex items-center justify-between pb-4 mb-3 border-b border-black/5 dark:border-white/10">
            <Link
              to="/"
              onClick={() => dispatch(toggleSidebar())}
              className="font-mono text-base md:text-sm font-black tracking-widest text-[#4a2430] dark:text-[#f7eef1] uppercase flex items-center gap-1 select-none"
            >
              Omnivault
            </Link>
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-[#8a4a5e] dark:text-[#e4a8b8] transition active:scale-95 cursor-pointer"
              title="Close Sidebar"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>

          <nav className="space-y-1.5 w-full">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path &&
                (item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path));

              if (item.type === "cart") {
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className="w-full group relative flex items-center justify-between rounded-2xl transition-all duration-200 select-none px-3.5 py-3 text-[#66424e] dark:text-[#cfb0ba] hover:bg-slate-100 dark:hover:bg-white/10 hover:text-[#4a2430] dark:hover:text-white cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon className="w-5 h-5 flex-shrink-0 stroke-[1.8] transition-transform duration-200 group-hover:scale-110" />
                      <span className="text-xs font-semibold tracking-wide">
                        {item.name}
                      </span>
                    </div>
                    {item.badge > 0 && (
                      <span className="text-[10px] font-bold bg-[#9c5b6f] text-white px-2 py-0.5 rounded-full shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => dispatch(toggleSidebar())}
                  className={`group relative flex items-center gap-3.5 rounded-2xl transition-all duration-200 select-none px-3.5 py-3 ${
                    isActive
                      ? "bg-[#9c5b6f] text-white font-semibold shadow-md shadow-[#9c5b6f]/25"
                      : "text-[#66424e] dark:text-[#cfb0ba] hover:bg-slate-100 dark:hover:bg-white/10 hover:text-[#4a2430] dark:hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? "stroke-[2.2] text-white" : "stroke-[1.8]"
                    }`}
                  />
                  <span className="text-xs font-semibold tracking-wide">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile / Auth Area */}
        <div className="w-full pt-3 mt-2 border-t border-black/5 dark:border-white/10">
          {authUser ? (
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 p-2.5 gap-3">
              <div 
                onClick={handleOpenAuth}
                className="flex items-center gap-2.5 overflow-hidden flex-1 cursor-pointer"
                title="View Profile"
              >
                <div className="w-9 h-9 rounded-full bg-[#9c5b6f] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm overflow-hidden">
                  {authUser?.avatar?.url ? (
                    <img src={authUser.avatar.url} alt={authUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 stroke-[2]" />
                  )}
                </div>

                <div className="overflow-hidden flex-1 text-left">
                  <p className="text-xs font-bold text-[#4a2430] dark:text-[#f7eef1] truncate">
                    {authUser.name}
                  </p>
                  <p className="text-[10px] text-[#8a636f] dark:text-[#b8959f] truncate">
                    {authUser.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-[#8a636f] hover:text-rose-500 dark:text-[#b8959f] dark:hover:text-rose-400 transition active:scale-90 cursor-pointer"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpenAuth}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#9c5b6f] text-white font-bold transition hover:bg-[#854b5d] px-4 py-3 shadow-md shadow-[#9c5b6f]/20 active:scale-95 cursor-pointer"
            >
              <LogIn className="w-4 h-4 stroke-[2]" />
              <span className="text-xs">Sign In</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;