import { useEffect, useState } from "react";
import { X, LogOut, Upload, Eye, EyeOff, User, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout, updatePassword, updateProfile } from "../../store/slices/authSlice";
import { toggleAuthPopup } from "../../store/slices/popupSlice";

const ProfilePanel = () => {
  const dispatch = useDispatch();
  const { isAuthPopupOpen } = useSelector((state) => state.popup || { isAuthPopupOpen: false });
  const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector(
    (state) => state.auth || {}
  );

  const [name, setName] = useState(authUser?.name || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (authUser) {
      setName(authUser.name || "");
      setEmail(authUser.email || "");
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setAvatar(null);
    setAvatarPreview(null);
  }, [authUser, isAuthPopupOpen]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Name and Email cannot be empty!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    if (avatar) formData.append("avatar", avatar);

    dispatch(updateProfile(formData));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }
    const passwordData = {
      currentPassword,
      newPassword,
      confirmNewPassword: confirmPassword,
    };

    const res = await dispatch(updatePassword(passwordData));
    if (res?.meta?.requestStatus === "fulfilled" || res?.payload?.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  if (!isAuthPopupOpen || !authUser) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 dark:bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in"
        onClick={() => dispatch(toggleAuthPopup())}
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] bg-white/95 dark:bg-[#1c1115]/95 backdrop-blur-2xl border-l border-[#e8d5dc] dark:border-white/10 shadow-2xl flex flex-col justify-between p-6 transition-all duration-300 ease-in-out animate-in slide-in-from-right">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ebd7df] dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#f7edf1] dark:bg-white/10 text-[#8a3854] dark:text-[#e4a8b8] flex items-center justify-center">
              <User className="w-4 h-4 stroke-[2]" />
            </div>
            <h2 className="text-base font-bold text-[#2b141d] dark:text-[#f7eef1]">
              My Profile
            </h2>
          </div>

          <button
            type="button"
            onClick={() => dispatch(toggleAuthPopup())}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-[#8c6772] hover:text-[#2b141d] dark:text-[#b8959f] dark:hover:text-[#f7eef1] transition active:scale-90 cursor-pointer"
            aria-label="Close Profile"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-5 pr-1 space-y-6">
          
          {/* User Info Header */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <img
                src={avatarPreview || authUser?.avatar?.url || authUser?.avatar || "/default_avatar.png"}
                alt={authUser?.name}
                className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-[#9c5b6f]/40 object-cover bg-slate-100 dark:bg-white/5"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/default_avatar.png";
                }}
              />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {authUser?.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{authUser?.email}</p>
          </div>

          {/* Update Profile Form */}
          <form onSubmit={handleUpdateProfile} className="space-y-4 mb-8">
            <h3 className="text-sm font-bold text-[#5a3240] dark:text-[#cfb0ba]">
              Update Profile
            </h3>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#e8d5dc] dark:border-white/10 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#9c5b6f]/40"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#e8d5dc] dark:border-white/10 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#9c5b6f]/40"
            />
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#8a3854] dark:text-[#c47790] hover:underline w-fit">
              <Upload className="w-4 h-4" />
              <span>{avatar ? "Avatar Selected (Click to change)" : "Upload Avatar"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full py-2.5 rounded-xl bg-[#9c5b6f] hover:bg-[#854b5d] text-white text-xs font-semibold shadow-md transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Profile...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>

          {/* Update Password Form */}
          <form 
            onSubmit={handleUpdatePassword} 
            autoComplete="off"
            className="space-y-4 pt-4 border-t border-[#ebd7df] dark:border-white/10"
          >
            <h3 className="text-sm font-bold text-[#5a3240] dark:text-[#cfb0ba]">
              Update Password
            </h3>
            
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                name="current_password"
                autoComplete="new-password"
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2.5 pr-10 rounded-xl border border-[#e8d5dc] dark:border-white/10 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#9c5b6f]/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#8c6772] hover:text-[#2b141d] dark:hover:text-[#f7eef1] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              name="new_password"
              autoComplete="new-password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#e8d5dc] dark:border-white/10 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#9c5b6f]/40"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              name="confirm_new_password"
              autoComplete="new-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#e8d5dc] dark:border-white/10 bg-white dark:bg-white/5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#9c5b6f]/40"
            />

            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="w-full py-2.5 rounded-xl bg-[#9c5b6f] hover:bg-[#854b5d] text-white text-xs font-semibold shadow-md transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </form>

        </div>

        {/* Footer Sign Out */}
        <div className="pt-4 border-t border-[#ebd7df] dark:border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition flex items-center justify-center gap-2 active:scale-95 border border-rose-500/20 cursor-pointer"
          >
            <LogOut className="w-4 h-4 stroke-[2]" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default ProfilePanel;