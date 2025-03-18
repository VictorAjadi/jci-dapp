import { create } from "zustand";
import toast from "react-hot-toast";
import Cookies from "js-cookie"; // Import js-cookie for secure cookie handling
import { logoutApi } from "../utils/api";
const LONG_COOKIE_TIME = import.meta.env.VITE_COOKIE_TIME
interface AuthState {
  isLoggedIn: boolean;
  setLoggedIn: () => void;
  setLoggedOut: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: Cookies.get('isLoggedIn') === 'true',  // Initial value from cookie
  setLoggedIn: () => {
    Cookies.set('isLoggedIn', 'true', {
      expires: Number(LONG_COOKIE_TIME),
      secure: window.location.protocol === "https:",
      sameSite: "Strict",
    });  // Set cookie with 7 days expiry
    set({ isLoggedIn: true });
  },
  setLoggedOut: () => {
    const clearUserData = useUserData.getState().clearData;
    //perform log out
    const logout = async()=>{
      const response = await logoutApi();
      toast.success(response?.message);
    }
    logout()
    Cookies.remove('isLoggedIn');
    set({ isLoggedIn: false });
    //clear userData
    clearUserData();
    //redirect to home page
    const path = window.location.pathname;
    window.location.href=`/auth?redirectTo=${path}`
  },
}));
// TypeScript interface for user data state
interface UserDataState {
  state: Record<string, any>;
  setData: (data: Record<string, any>) => void;
  updateData: (data: Record<string, any>) => void;
  clearData: () => void;
}
// Zustand store for user data
export const useUserData = create<UserDataState>((set) => ({
  state: (() => {
    const data = Cookies.get("userData"); // Get data from cookie
    return data ? JSON.parse(data) : {};
  })(),

  setData: (data: Record<string, any>) => {
    if (data) {
      Cookies.set("userData", JSON.stringify(data), {
        expires: Number(LONG_COOKIE_TIME),
        secure: window.location.protocol === "https:",
        sameSite: "Strict",
      });      
      set({ state: data });
    }
  },

  updateData: (data: Record<string, any>) => {
    const cookieData = Cookies.get("userData");
    const existingData = cookieData ? JSON.parse(cookieData) : {};
    const newData = { ...existingData, ...data }; // Merge existing and new data
    if (newData) {
      Cookies.set("userData", JSON.stringify(newData), {
        expires: Number(LONG_COOKIE_TIME),
        secure: true,
        sameSite: "Strict",
        httpOnly: true,
      });
      set({ state: newData });
    }
  },

  clearData: () => {
    Cookies.remove("userData"); // Remove the cookie
    set({ state: {} });
  },
}));