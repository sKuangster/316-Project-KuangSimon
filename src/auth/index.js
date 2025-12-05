'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    REGISTER_USER_ERROR: "REGISTER_USER_ERROR",
    LOGIN_USER_ERROR: "LOGIN_USER_ERROR"
}

const authAPI = {
    getLoggedIn: async () => {
        try {
            const res = await fetch("/api/auth/loggedIn", {
                method: "GET",
                credentials: "include"
            });
            const text = await res.text();
            const data = text ? JSON.parse(text) : {};
            return { status: res.status, data };
        } catch (error) {
            return { status: 500, data: { errorMessage: error.message } };
        }
    },
    
    loginUser: async (email, password) => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const text = await res.text();
            const data = text ? JSON.parse(text) : {};
            return { status: res.status, data };
        } catch (error) {
            return { status: 500, data: { errorMessage: error.message } };
        }
    },
    
    logoutUser: async () => {
        try {
            const res = await fetch("/api/auth/logout", {
                method: "GET",
                credentials: "include"
            });
            const text = await res.text();
            const data = text ? JSON.parse(text) : {};
            return { status: res.status, data };
        } catch (error) {
            return { status: 500, data: { errorMessage: error.message } };
        }
    },
    
    registerUser: async (firstName, lastName, email, password, passwordVerify) => {
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password, passwordVerify })
            });
            const text = await res.text();
            const data = text ? JSON.parse(text) : {};
            return { status: res.status, data };
        } catch (error) {
            return { status: 500, data: { errorMessage: error.message } };
        }
    }
};

export function AuthContextProvider({ children }) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: null
    });
    const router = useRouter();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN:
                return setAuth({ user: payload.user, loggedIn: payload.loggedIn, errorMessage: null });
            case AuthActionType.LOGIN_USER:
                return setAuth({ user: payload.user, loggedIn: true, errorMessage: null });
            case AuthActionType.LOGIN_USER_ERROR:
                return setAuth({ user: null, loggedIn: false, errorMessage: payload.errorMessage });
            case AuthActionType.LOGOUT_USER:
                return setAuth({ user: null, loggedIn: false, errorMessage: null });
            case AuthActionType.REGISTER_USER:
                return setAuth({ user: payload.user, loggedIn: true, errorMessage: null });
            case AuthActionType.REGISTER_USER_ERROR:
                return setAuth({ user: null, loggedIn: false, errorMessage: payload.errorMessage });
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await authAPI.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: { loggedIn: response.data.loggedIn, user: response.data.user }
            });
        }
    }

    auth.registerUser = async function(firstName, lastName, email, password, passwordVerify) {
        try {   
            const response = await authAPI.registerUser(firstName, lastName, email, password, passwordVerify);   
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: { user: response.data.user }
                });
                router.push("/");
            } else {
                authReducer({
                    type: AuthActionType.REGISTER_USER_ERROR,
                    payload: { errorMessage: response.data.errorMessage || "Registration failed" }
                });
            }
        } catch(error) {
            authReducer({
                type: AuthActionType.REGISTER_USER_ERROR,
                payload: { errorMessage: error.message || "Registration failed" }
            });
        }
    }

    auth.loginUser = async function(email, password) {
        try {
            const response = await authAPI.loginUser(email, password);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: { user: response.data.user }
                });
                router.push("/");
            } else {
                authReducer({
                    type: AuthActionType.LOGIN_USER_ERROR,
                    payload: { errorMessage: response.data.errorMessage || "Login failed" }
                });
            }
        } catch(error) {
            authReducer({
                type: AuthActionType.LOGIN_USER_ERROR,
                payload: { errorMessage: error.message || "Login failed" }
            });
        }
    }

    auth.logoutUser = async function() {
        const response = await authAPI.logoutUser();
        if (response.status === 200) {
            authReducer({ type: AuthActionType.LOGOUT_USER, payload: null });
            router.push("/");
        }
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        return initials;
    }

    return (
        <AuthContext.Provider value={{ auth }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;

export function useAuth() {
    return useContext(AuthContext);
}