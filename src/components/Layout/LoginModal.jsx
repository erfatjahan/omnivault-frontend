import { useState, useEffect } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import { login, register, forgotPassword, resetPassword } from "../../store/slices/authSlice";
import { toast } from "react-toastify";

const LoginModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    authUser,
    isSigningUp,
    isLoggingIn,
    isRequestingForToken,
    isUpdatingPassword,
  } = useSelector((state) => state.auth || {});

  const { isAuthPopupOpen } = useSelector((state) => state.popup || { isAuthPopupOpen: false });
  const [mode, setMode] = useState("signin"); // 'signin' | 'signup' | 'forgot' | 'reset'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // URL check
  useEffect(() => {
    if (location.pathname.includes("/password/reset/")) {
      setMode("reset");
      if (!isAuthPopupOpen) {
        dispatch(toggleAuthPopup());
      }
    }
  }, [location.pathname, dispatch, isAuthPopupOpen]);
  useEffect(() => {
    if (isAuthPopupOpen) {
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isAuthPopupOpen, mode]);

  // submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "forgot") {
      dispatch(forgotPassword({ email: formData.email })).then((res) => {
        if (!res.error) {
          dispatch(toggleAuthPopup());
          setMode("signin");
          setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        }
      });
      return;
    }

    if (mode === "reset") {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      const pathParts = location.pathname.split("/").filter(Boolean);
      const token = pathParts[pathParts.length - 1];

      if (!token || token === "reset") {
        toast.error("Invalid or missing reset token!");
        return;
      }

      dispatch(
        resetPassword({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })
      ).then((res) => {
        if (!res.error) {
          dispatch(toggleAuthPopup());
          setMode("signin");
          setFormData({ name: "", email: "", password: "", confirmPassword: "" });
          navigate("/"); 
        }
      });
      return;
    }

    if (mode === "signup" && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);

    if (mode === "signup") {
      data.append("name", formData.name);
      data.append("confirmPassword", formData.confirmPassword);
      dispatch(register(data));
    } else {
      dispatch(login(data));
    }
  };

  useEffect(() => {
    if (authUser) {
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    }
  }, [authUser]);

  if (!isAuthPopupOpen || authUser) return null;

  const isLoading = isSigningUp || isLoggingIn || isRequestingForToken || isUpdatingPassword;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={() => dispatch(toggleAuthPopup())}
      />

      <div className="relative z-10 w-full max-w-md bg-white/85 dark:bg-[#1c1115]/90 backdrop-blur-2xl rounded-[32px] border border-[#e8d5dc] dark:border-white/10 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        
        <button
          type="button"
          onClick={() => dispatch(toggleAuthPopup())}
          className="absolute top-5 right-5 p-2 rounded-2xl bg-white/60 dark:bg-white/10 text-[#8c6772] hover:text-[#2b141d] dark:text-[#b8959f] dark:hover:text-[#f7eef1] transition active:scale-90"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-[#2b141d] dark:text-[#f7eef1]">
            {mode === "signin" && "Welcome Back"}
            {mode === "signup" && "Create Account"}
            {mode === "forgot" && "Forgot Password"}
            {mode === "reset" && "Reset Password"}
          </h2>
          <p className="text-xs text-[#8c6772] dark:text-[#b8959f] mt-1">
            {mode === "signin" && "Sign in to access your orders and account"}
            {mode === "signup" && "Join us to enjoy seamless shopping"}
            {mode === "forgot" && "Enter your email to receive a password reset link"}
            {mode === "reset" && "Enter a new password to secure your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-bold text-[#5a3240] dark:text-[#cfb0ba] mb-1 px-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-[#8c6772] dark:text-[#b8959f]" />
                <input
                  type="text"
                  name="fullNameField"
                  autoComplete="off"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-white/5 border border-[#e8d5dc] dark:border-white/10 rounded-2xl text-xs font-semibold text-[#2b141d] dark:text-[#f7eef1] placeholder-[#8c6772]/60 outline-none focus:ring-2 focus:ring-[#9c5b6f]/40 transition"
                  required
                />
              </div>
            </div>
          )}

          {mode !== "reset" && (
            <div>
              <label className="block text-xs font-bold text-[#5a3240] dark:text-[#cfb0ba] mb-1 px-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-[#8c6772] dark:text-[#b8959f]" />
                <input
                  type="email"
                  name="userEmailField"
                  autoComplete="off"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-white/5 border border-[#e8d5dc] dark:border-white/10 rounded-2xl text-xs font-semibold text-[#2b141d] dark:text-[#f7eef1] placeholder-[#8c6772]/60 outline-none focus:ring-2 focus:ring-[#9c5b6f]/40 transition"
                  required
                />
              </div>
            </div>
          )}

          {mode !== "forgot" && (
            <div>
              <div className="flex justify-between items-center mb-1 px-1">
                <label className="text-xs font-bold text-[#5a3240] dark:text-[#cfb0ba]">
                  {mode === "reset" ? "New Password" : "Password"}
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-[11px] font-semibold text-[#8a3854] dark:text-[#c47790] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-[#8c6772] dark:text-[#b8959f]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="userSecretField"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 bg-white/70 dark:bg-white/5 border border-[#e8d5dc] dark:border-white/10 rounded-2xl text-xs font-semibold text-[#2b141d] dark:text-[#f7eef1] placeholder-[#8c6772]/60 outline-none focus:ring-2 focus:ring-[#9c5b6f]/40 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[#8c6772] hover:text-[#2b141d] dark:hover:text-[#f7eef1] transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {(mode === "signup" || mode === "reset") && (
            <div>
              <label className="block text-xs font-bold text-[#5a3240] dark:text-[#cfb0ba] mb-1 px-1">
                Confirm {mode === "reset" ? "New Password" : "Password"}
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-[#8c6772] dark:text-[#b8959f]" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="userConfirmSecretField"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 bg-white/70 dark:bg-white/5 border border-[#e8d5dc] dark:border-white/10 rounded-2xl text-xs font-semibold text-[#2b141d] dark:text-[#f7eef1] placeholder-[#8c6772]/60 outline-none focus:ring-2 focus:ring-[#9c5b6f]/40 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 text-[#8c6772] hover:text-[#2b141d] dark:hover:text-[#f7eef1] transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-2xl bg-[#9c5b6f] hover:bg-[#854b5d] text-white text-xs font-semibold shadow-md shadow-[#9c5b6f]/20 transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>
                {mode === "signin" && "Sign In"}
                {mode === "signup" && "Sign Up"}
                {mode === "forgot" && "Send Reset Link"}
                {mode === "reset" && "Update Password"}
              </span>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#ebd7df] dark:border-white/10 text-center text-xs text-[#8c6772] dark:text-[#b8959f]">
          {mode === "signin" && (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="font-bold text-[#8a3854] dark:text-[#c47790] hover:underline"
              >
                Sign Up
              </button>
            </p>
          )}

          {mode === "signup" && (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="font-bold text-[#8a3854] dark:text-[#c47790] hover:underline"
              >
                Sign In
              </button>
            </p>
          )}

          {(mode === "forgot" || mode === "reset") && (
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                navigate("/");
              }}
              className="font-bold text-[#8a3854] dark:text-[#c47790] hover:underline"
            >
              Back to Sign In
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default LoginModal;