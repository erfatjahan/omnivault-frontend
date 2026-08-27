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
  Menu,
  LogIn,
  ClipboardList 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { toggleSidebar, toggleAuthPopup, toggleCart } from "../../store/slices/popupSlice";

const Sidebar = () => {
  const { authUser } = useSelector((state) => state.auth || {});
  const { isSidebarOpen } = useSelector((state) => state.popup || { isSidebarOpen: false });
  const { cart = [] } = useSelector((state) => state.cart || {});
  const dispatch = useDispatch();
  const location = useLocation();

  const cartItemsCount =
    cart?.reduce((total, item) => total + (Number(item?.quantity) || 1), 0) || 0;

  const menuItems = [
    { name: "Home", path: "/", icon: Home, type: "link" },
    { name: "Products", path: "/products", icon: Package, type: "link" },
    { name: "Bag", icon: ShoppingBag, type: "cart", badge: cartItemsCount },
    ...(authUser
      ? [{ name: "My Orders", path: "/orders", icon: ClipboardList, type: "link" }]
      : []),
    { name: "About", path: "/about", icon: Info, type: "link" },
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

  if (!isSidebarOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in cursor-pointer"
        onClick={() => dispatch(toggleSidebar())}
      />
      <aside className="fixed top-4 bottom-4 left-4 z-50 w-16 md:w-64 bg-white/40 dark:bg-black/35 backdrop-blur-2xl rounded-[32px] md:rounded-[36px] border border-white/50 dark:border-white/10 shadow-2xl shadow-black/5 flex flex-col justify-between p-2.5 md:p-4 transition-all duration-300 ease-in-out animate-in slide-in-from-left">
        
        <div className="w-full flex flex-col">
          <div className="flex items-center justify-center md:justify-between pb-3 md:pb-4 mb-2 md:mb-3 border-b border-black/5 dark:border-white/10">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="md:hidden p-2 rounded-2xl bg-white/50 dark:bg-white/10 text-[#8a4a5e] dark:text-[#e4a8b8] hover:bg-white/70 dark:hover:bg-white/20 transition active:scale-95 border border-white/60 dark:border-white/10 cursor-pointer"
              aria-label="Close Sidebar"
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </button>
            <div className="hidden md:flex items-center justify-between w-full px-2">
              <Link
                to="/"
                onClick={() => dispatch(toggleSidebar())}
                className="font-mono text-sm font-black tracking-widest text-[#4a2430] dark:text-[#f7eef1] uppercase flex items-center gap-1"
              >
                Omnivault<span className="text-[#9c5b6f] font-bold text-base"></span>
              </Link>
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="p-1.5 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 text-[#8c6772] hover:text-[#4a2430] dark:text-[#b8959f] dark:hover:text-[#f7eef1] transition cursor-pointer"
                title="Close Sidebar"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
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
                    className="w-full group relative flex items-center justify-center md:justify-start rounded-2xl transition-all duration-200 select-none p-3 md:px-3.5 md:py-3 md:gap-3.5 text-[#66424e] dark:text-[#cfb0ba] hover:bg-white/40 dark:hover:bg-white/10 hover:text-[#4a2430] dark:hover:text-white cursor-pointer"
                    title={item.name}
                  >
                    <div className="relative">
                      <Icon className="w-5 h-5 flex-shrink-0 stroke-[1.8] transition-transform duration-200 group-hover:scale-110" />
                      {item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#9c5b6f] ring-2 ring-white dark:ring-black" />
                      )}
                    </div>
                    <span className="hidden md:inline text-xs font-medium tracking-wide">
                      {item.name}
                    </span>
                    {item.badge > 0 && (
                      <span className="hidden md:inline-flex ml-auto text-[10px] font-bold bg-[#9c5b6f]/15 text-[#9c5b6f] dark:text-[#e4a8b8] px-2 py-0.5 rounded-full">
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
                  className={`group relative flex items-center justify-center md:justify-start rounded-2xl transition-all duration-200 select-none p-3 md:px-3.5 md:py-3 md:gap-3.5 ${
                    isActive
                      ? "bg-[#9c5b6f]/90 text-white font-semibold shadow-md shadow-[#9c5b6f]/25 backdrop-blur-md"
                      : "text-[#66424e] dark:text-[#cfb0ba] hover:bg-white/40 dark:hover:bg-white/10 hover:text-[#4a2430] dark:hover:text-white"
                  }`}
                  title={item.name}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? "stroke-[2.4] text-white" : "stroke-[1.8]"
                    }`}
                  />
                  <span className="hidden md:inline text-xs font-medium tracking-wide">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="w-full pt-3 border-t border-black/5 dark:border-white/10">
          {authUser ? (
            <div className="flex items-center justify-center md:justify-between rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 p-2 md:p-2.5 md:gap-3 backdrop-blur-md">
              <div 
                onClick={handleOpenAuth}
                className="flex items-center gap-2.5 overflow-hidden flex-1 cursor-pointer"
                title="View Profile"
              >
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#9c5b6f] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm overflow-hidden">
                  {authUser?.avatar?.url ? (
                    <img src={authUser.avatar.url} alt={authUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 stroke-[2]" />
                  )}
                </div>

                <div className="hidden md:block overflow-hidden flex-1 text-left">
                  <p className="text-xs font-bold text-[#4a2430] dark:text-[#f7eef1] truncate">
                    {authUser.name}
                  </p>
                  <p className="text-[10px] text-[#8a636f] dark:text-[#b8959f] truncate">
                    {authUser.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  dispatch(logout());
                  dispatch(toggleSidebar());
                }}
                className="hidden md:block p-1.5 text-[#8a636f] hover:text-rose-500 dark:text-[#b8959f] dark:hover:text-rose-400 transition active:scale-90 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpenAuth}
              className="w-full flex items-center justify-center md:justify-center gap-2 rounded-2xl bg-[#9c5b6f]/90 text-white font-bold transition hover:bg-[#854b5d] p-2.5 md:px-4 md:py-2.5 shadow-sm shadow-[#9c5b6f]/20 backdrop-blur-md active:scale-95 cursor-pointer"
              title="Sign In"
            >
              <LogIn className="w-4 h-4 stroke-[2]" />
              <span className="hidden md:inline text-xs">Sign In</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;