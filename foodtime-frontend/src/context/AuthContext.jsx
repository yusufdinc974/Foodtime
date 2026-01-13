/**
 * Auth Context for global authentication state management
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('foodtime_token');

            // Only fetch user if token exists
            if (storedToken) {
                setToken(storedToken); // Set token state from localStorage
                setIsAuthenticated(true); // Assume authenticated if token exists
                try {
                    // This part assumes an 'authAPI' object with a 'getMe' method exists.
                    // If not, you'll need to define or import it.
                    const userData = await authAPI.getMe();
                    setUser(userData);
                    localStorage.setItem('foodtime_user', JSON.stringify(userData)); // Update user in localStorage
                } catch (error) {
                    console.error('Auth error:', error);
                    localStorage.removeItem('foodtime_token');
                    localStorage.removeItem('foodtime_user');
                    setToken(null);
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('foodtime_token', newToken);
        localStorage.setItem('foodtime_user', JSON.stringify(userData));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('foodtime_token');
        localStorage.removeItem('foodtime_user');
        localStorage.removeItem('foodtime_user_id'); // Clean up old data
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('foodtime_user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            token,
            user,
            loading,
            login,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
