import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { Bookmark } from "lucide-react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ created: 0, voted: 0, bookmarked: 0 });
    const [loading, setLoading] = useState(true);

    // to load user profile
    const loadMe = async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data.user);
            setStats(data.stats);
        } catch (error) {
            setUser(null);
        }
        finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            loadMe();
        }
        else setLoading(false);

    }, []);

    // to save the tokrn inside the localStorage
    const saveToken = async (token) => {
        localStorage.setItem("token", token);
        await loadMe();
    };

    // to register a user
    const register = async (fromData) => (await api.post('/auth/register', fromData)).data;

    // to verify otp
    const verifyOtp = (payload) => api.post("/auth/verify-otp", payload);

    // to resend otp
    const resendOtp = (email) => api.post("/auth/resend-otp", { email });

    // to login
    const login = async (payload) => {
        const { data } = await api.post("/auth/login", payload);
        await saveToken(data.token);
    }

    // to forgot, verifyOtp, and reset password
    const forgotPassword = (email) => api.post("/auth/forgot-password", { email });

    const verifyResetOtp = (payload) => api.post("/auth/verify-reset-otp", payload);

    const resetPassword = (payload) => api.post("/auth/reset-password", payload);

    // for settings page to update profile and change password
    const updateProfile = async (fromData) => {
        const { data } = await api.patch("/auth/profile", fromData);
        setUser(data.user);
    };

    const changePassword = (payload) => api.patch("/auth/password", payload);
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    // to delete an account
    const delteAccount = async () => {
        await api.delete("/auth/account");
        logout();
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            stats,
            setStats,
            loading,
            setLoading,
            register,
            verifyOtp,
            resendOtp,
            login,
            forgotPassword,
            verifyResetOtp,
            resetPassword,
            updateProfile,
            changePassword,
            logout,
            refresh: loadMe,
        }}>
            {children}
        </AuthContext.Provider>
    );

}


export default AuthContext;


