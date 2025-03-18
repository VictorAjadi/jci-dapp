import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode"; // Fix import, `jwtDecode` is not default.
import { getCookie, getUserByID } from "../utils/api";
import { useAuthStore, useUserData } from "../hooks/store";

type UserRole = 'user';

/**
 * Display error message via toast.
 * @param message - The error message to display.
 */
const showError = (message: string) => toast.error(message);

/**
 * User Authorization Function
 *
 * Validates user authentication and authorization based on cookies, JWT, and user data.
 *
 * @returns {Promise<boolean>} - Resolves true if the user is authorized, otherwise false.
 */
export const userAuth = async (): Promise<boolean> => {
  try {
    const userData = useUserData.getState().state;
    const isLoggedIn = useAuthStore.getState().isLoggedIn;
    const token:string = await getCookie();
    if (!isLoggedIn) {
      showError("User not authorized. Please log in.");
      return false;
    }
    if (!token) {
      showError("Session token has expired. Please log in.");
      return false;
    }

    let decoded:any;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      showError("Invalid session token. Please log in.");
      return false;
    }
    if (decoded?.exp && Date.now() >= decoded?.exp * 1000) {
      showError("Session has expired. Please log in.");
      return false;
    }

    if (!decoded?.id) {
      showError("Invalid token. Please log in.");
      return false;
    }
    if (!userData?._id || userData._id !== decoded.id) {
      showError("User not authorized. Please log in.");
      return false;
    }

    const validRoles: UserRole[] = ["user"];
    if (!validRoles.includes(userData?.role as UserRole)) {
      showError("User role not authorized. Please log in.");
      return false;
    }

    const res = await getUserByID(decoded?.id);
    if (res.status === "success") {
      return true;
    } else {
      showError("User not found. Please sign up.");
      return false;
    }
  } catch (error) {
    showError("An error occurred during authorization.");
    return false;
  }
};

export const allowAdminAndEmployees =():boolean=>{
  const userData = useUserData.getState().state;
  return ['admin','employees'].includes(userData?.role)
}