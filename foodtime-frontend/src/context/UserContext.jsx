/**
 * User Context for global state management
 */

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('foodtime_user');
        const savedUserId = localStorage.getItem('foodtime_user_id');

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        if (savedUserId) {
            setUserId(parseInt(savedUserId));
        }
    }, []);

    // Save user to localStorage when it changes
    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('foodtime_user', JSON.stringify(userData));
    };

    const updateUserId = (id) => {
        setUserId(id);
        localStorage.setItem('foodtime_user_id', id.toString());
    };

    const clearUser = () => {
        setUser(null);
        setUserId(null);
        localStorage.removeItem('foodtime_user');
        localStorage.removeItem('foodtime_user_id');
    };

    return (
        <UserContext.Provider value={{ user, userId, updateUser, updateUserId, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
};
