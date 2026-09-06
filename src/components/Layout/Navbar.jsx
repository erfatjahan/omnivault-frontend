import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Fingerprint,
  Sun,
  Moon,
  Search,
  SlidersHorizontal,
  LayoutGrid,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleSidebar,
  toggleSearchBar,
  toggleCart,
  toggleAuthPopup,
} from "../../store/slices/popupSlice";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const cartState = useSelector((state) => state.cart || {});
  const rawCart =
    cartState.cartItems ||
    cartState.items ||
    cartState.cart ||
    (Array.isArray(cartState) ? cartState : []);

  const cartList = Array.isArray(rawCart) ? rawCart : [];

  const cartItemsCount = cartList.reduce(
    (total, item) => total + (Number(item?.quantity ?? item?.qty ?? 1) || 1),
    0
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const desktopTabs = [
    { name: "Home", type: "link", path: "/", icon: LayoutGrid },
    { name: "Search", type: "search", icon: Search },
    { name: "Bag", type: "cart", icon: ShoppingBag, badge: cartItemsCount },
    { name: "Theme", type: "theme", icon: theme === "dark" ? Sun : Moon },
    { name: "Profile", type: "profile", icon: Fingerprint },
  ];
  const mobileTabs = [
    { name: "Home", type: "link", path: "/", icon: LayoutGrid },
    { name: "Menu", type: "sidebar", icon: SlidersHorizontal },
    { name: "Search", type: "search", icon: Search },
    { name: "Bag", type: "cart", icon: ShoppingBag, badge: cartItemsCount },
    { name: "Profile", type: "profile", icon: Fingerprint },
  ];

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAction = (tab) => {
    if (tab.type === "theme") {
      toggleTheme();
    } else if (tab.type === "search") {
      dispatch(toggleSearchBar());
    } else if (tab.type === "cart") {
      dispatch(toggleCart());
    } else if (tab.type === "profile") {
      dispatch(toggleAuthPopup());
    } else if (tab.type === "sidebar") {
      dispatch(toggleSidebar());
    }
  };

  return (
    <>
      <header className="hidden md:flex fixed top-5 left-0 right-0 z-50 justify-center px-6 pointer-events-none">
        <nav className="pointer-events-auto flex items-center gap-2 bg-white/85 dark:bg-[#150d11]/90 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 px-4 py-2.5 rounded-full shadow-2xl shadow-black/10 transition-all duration-300">
          
          <Link
            to="/"
            onClick={handleLogoClick}
            className="px-3 font-mono font-bold tracking-wider text-slate-900 dark:text-[#f7eef1] uppercase text-sm select-none cursor-pointer hover:opacity-75 transition"
          >
            Omnivault
          </Link>

          <div className="h-5 w-[1px] bg-slate-200 dark:bg-white/10 mx-1" />
          <div className="flex items-center gap-1">
            {desktopTabs.map((tab) => {
              const Icon = tab.icon;
              const isTabActive =
                tab.type === "link" && tab.path === "/"
                  ? location.pathname === "/"
                  : false;

              if (tab.type !== "link") {
                return (
                  <button
                    key={tab.name}
                    type="button"
                    onClick={() => handleAction(tab)}
                    className="relative group px-4 py-2 rounded-full flex items-center gap-2 text-slate-600 dark:text-[#cfb0ba] hover:text-[#9c5b6f] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer text-xs font-semibold"
                    aria-label={tab.name}
                  >
                    <div className="relative">
                      <Icon className="w-4 h-4 stroke-[2]" />
                      {tab.badge > 0 && (
                        <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-[#9c5b6f] text-white text-[9px] font-bold flex items-center justify-center">
                          {tab.badge}
                        </span>
                      )}
                    </div>
                    <span>{tab.name}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  onClick={(e) => {
                    if (tab.path === "/") handleLogoClick(e);
                  }}
                  className={`relative px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
                    isTabActive
                      ? "bg-[#9c5b6f] text-white shadow-lg shadow-[#9c5b6f]/30 -translate-y-0.5"
                      : "text-slate-600 dark:text-[#cfb0ba] hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[2]" />
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
      <div className="md:hidden sticky top-0 left-0 right-0 z-40 bg-white/85 dark:bg-[#120b0e]/90 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 px-5 h-16 flex items-center justify-between">
        <Link
          to="/"
          onClick={handleLogoClick}
          className="text-lg font-bold tracking-wider text-slate-900 dark:text-[#f7eef1] uppercase font-mono cursor-pointer select-none"
        >
          Omnivault
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-slate-600 dark:text-[#cfb0ba] hover:bg-slate-100 dark:hover:bg-white/10 transition active:scale-90 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-300 stroke-[1.9]" />
            ) : (
              <Moon className="w-5 h-5 text-[#9c5b6f] stroke-[1.9]" />
            )}
          </button>
        </div>
      </div>

      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 dark:bg-[#150d11]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 px-3 py-2 rounded-[32px] shadow-2xl shadow-black/20">
          <div className="flex items-center justify-around">
            {mobileTabs.map((tab) => {
              const Icon = tab.icon;
              const isTabActive =
                tab.type === "link" && tab.path === "/"
                  ? location.pathname === "/"
                  : false;

              if (tab.type !== "link") {
                return (
                  <button
                    key={tab.name}
                    type="button"
                    onClick={() => handleAction(tab)}
                    className="flex-1 flex flex-col items-center justify-center py-1.5 text-slate-600 dark:text-[#cfb0ba] active:scale-95 transition cursor-pointer select-none"
                    aria-label={tab.name}
                  >
                    <div className="relative mb-1">
                      <Icon className="w-5 h-5 stroke-[1.9]" />
                      {tab.badge > 0 && (
                        <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#9c5b6f] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#150d11]">
                          {tab.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium tracking-tight">
                      {tab.name}
                    </span>
                  </button>
                );
              }

              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  onClick={(e) => {
                    if (tab.path === "/") handleLogoClick(e);
                  }}
                  className="flex-1 flex flex-col items-center justify-center py-1.5 transition select-none active:scale-95"
                  aria-label={tab.name}
                >
                  <div
                    className={`flex items-center justify-center transition-all duration-300 mb-1 ${
                      isTabActive
                        ? "w-10 h-10 rounded-full bg-[#9c5b6f] text-white shadow-lg shadow-[#9c5b6f]/40 -translate-y-2 scale-110"
                        : "text-slate-600 dark:text-[#cfb0ba]"
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[1.9]" />
                  </div>
                  <span
                    className={`text-[10px] tracking-tight ${
                      isTabActive
                        ? "font-bold text-[#9c5b6f] dark:text-white -translate-y-1"
                        : "font-medium text-slate-600 dark:text-[#cfb0ba]"
                    }`}
                  >
                    {tab.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;