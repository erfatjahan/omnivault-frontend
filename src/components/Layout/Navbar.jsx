import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Fingerprint,
  Sun,
  Moon,
  Search,
  SlidersHorizontal,
  LayoutGrid
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleSidebar,
  toggleSearchBar,
  toggleCart,
  toggleAuthPopup
} from "../../store/slices/popupSlice";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  
  const { cart } = useSelector((state) => state.cart || { cart: [] });
  const cartItemsCount =
    cart?.reduce((total, item) => total + (Number(item?.quantity) || 1), 0) || 0;

  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navTabs = [
    { name: "Search", type: "search", icon: Search },
    { name: "Bag", type: "cart", icon: ShoppingBag, badge: cartItemsCount },
    { name: "Theme", type: "theme", icon: theme === "dark" ? Sun : Moon },
    { name: "Profile", type: "profile", icon: Fingerprint },
  ];

  const mobileTabs = [
    { name: "Home", type: "link", path: "/", icon: LayoutGrid },
    { name: "Menu", type: "sidebar", icon: SlidersHorizontal },
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

      <header
        className={`hidden md:block sticky top-0 left-0 w-full z-40 transition-all duration-300 border-b backdrop-blur-2xl ${
          isScrolled
            ? "bg-white/70 dark:bg-black/40 border-slate-200/80 dark:border-white/10 shadow-sm shadow-slate-200/50"
            : "bg-white/30 dark:bg-black/20 border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="h-20 flex items-center justify-between gap-6">
            
           
            <div className="flex items-center gap-4">
              <div className="relative group">
                <button
                  onClick={() => dispatch(toggleSidebar())}
                  className="p-3 rounded-2xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-[#754d5a] dark:text-[#cfb0ba] hover:text-[#4a2430] dark:hover:text-white transition-all active:scale-95 border border-slate-200/80 dark:border-white/10 shadow-xs cursor-pointer"
                  aria-label="Toggle Sidebar"
                >
                  <SlidersHorizontal className="w-5 h-5 stroke-[1.8]" />
                </button>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#2b171e]/90 text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-md whitespace-nowrap">
                  Menu
                </span>
              </div>

           
              <Link
                to="/"
                onClick={handleLogoClick}
                className="group inline-flex items-center cursor-pointer select-none"
              >
                <span className="text-xl font-bold tracking-wider text-slate-900 dark:text-[#f7eef1] uppercase font-mono transition-colors duration-300">
                  Omnivault<span className="text-[#9c5b6f] font-bold text-2xl group-hover:scale-125 inline-block transition-transform duration-200"></span>
                </span>
              </Link>
            </div>

          
            <nav className="relative flex items-center bg-white dark:bg-white/5 rounded-full px-3 py-1.5 border border-slate-200/80 dark:border-white/10 shadow-sm shadow-slate-200/30 backdrop-blur-xl gap-1">
              {navTabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <div key={tab.name} className="relative flex flex-col items-center group">
                    <button
                      type="button"
                      onClick={() => handleAction(tab)}
                      className="relative flex items-center justify-center p-2.5 rounded-full transition-all duration-300 text-[#754d5a] dark:text-[#cfb0ba] hover:text-[#4a2430] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 active:scale-90 cursor-pointer"
                      aria-label={tab.name}
                    >
                      <div className="w-5 h-5 flex items-center justify-center relative">
                        <Icon className="w-5 h-5 stroke-[1.9]" />
                        {tab.badge > 0 && (
                          <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#9c5b6f] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                            {tab.badge}
                          </span>
                        )}
                      </div>
                    </button>

                 
                    <span className="absolute -bottom-8 px-2 py-0.5 rounded-md bg-[#2b171e]/90 text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-md whitespace-nowrap z-50">
                      {tab.name}
                    </span>
                  </div>
                );
              })}
            </nav>

          </div>
        </div>
      </header>

      <div className="md:hidden sticky top-0 left-0 right-0 z-40 bg-white/80 dark:bg-black/40 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/10 px-5 h-16 flex items-center justify-between">
        <Link
          to="/"
          onClick={handleLogoClick}
          className="text-lg font-bold tracking-wider text-slate-900 dark:text-[#f7eef1] uppercase font-mono cursor-pointer"
        >
          Omnivault<span className="text-[#9c5b6f] font-bold text-xl"></span>
        </Link>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => dispatch(toggleSearchBar())}
            className="p-2.5 rounded-full text-slate-600 dark:text-[#cfb0ba] hover:bg-slate-100 dark:hover:bg-white/10 transition active:scale-90"
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[1.9]" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-slate-600 dark:text-[#cfb0ba] hover:bg-slate-100 dark:hover:bg-white/10 transition active:scale-90"
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

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/85 dark:bg-[#120b0e]/90 backdrop-blur-2xl border-t border-slate-200/80 dark:border-white/10 px-4 py-2 pb-5">
        <div className="flex items-center justify-around max-w-sm mx-auto">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const isTabActive = tab.path === "/" ? location.pathname === "/" : location.pathname.startsWith(tab.path || "");

            if (tab.type !== "link") {
              return (
                <button
                  key={tab.name}
                  type="button"
                  onClick={() => handleAction(tab)}
                  className="relative flex flex-col items-center justify-center p-1.5 text-slate-600 dark:text-[#b8959f] hover:text-[#9c5b6f] dark:hover:text-white transition active:scale-90"
                  aria-label={tab.name}
                >
                  <span className="text-[10px] font-medium tracking-tight mb-1">
                    {tab.name}
                  </span>
                  <div className="relative">
                    <Icon className="w-5 h-5 stroke-[1.9]" />
                    {tab.badge > 0 && (
                      <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-[#9c5b6f] ring-2 ring-white dark:ring-black" />
                    )}
                  </div>
                </button>
              );
            }

            return (
              <Link
                key={tab.name}
                to={tab.path}
                onClick={tab.path === "/" ? handleLogoClick : undefined}
                className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
                  isTabActive
                    ? "-translate-y-1 text-[#9c5b6f] dark:text-[#f7eef1]"
                    : "p-1.5 text-slate-600 dark:text-[#b8959f]"
                }`}
                aria-label={tab.name}
              >
                <span className={`text-[10px] tracking-tight mb-1 ${isTabActive ? "font-bold text-[#9c5b6f] dark:text-white" : "font-medium"}`}>
                  {tab.name}
                </span>

                <div
                  className={`flex items-center justify-center transition-all duration-300 ${
                    isTabActive
                      ? "w-9 h-9 rounded-full bg-[#9c5b6f] text-white shadow-md shadow-[#9c5b6f]/30"
                      : ""
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[1.9]" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;