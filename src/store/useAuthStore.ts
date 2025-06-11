import { create } from 'zustand';
import { account } from "../appwriteConfig";
import { ID } from "appwrite";
import type { User, Credentials } from '../types/authType';
import type { AppError } from '../types/appErrorTypes';
import { useEffect } from 'react';

interface AuthState {
    user: User | null;
    loading: boolean;
    initialized: boolean; // Indicates if the store has been initialized
    error: AppError | null;
    loginUser: (userInfo: LoginUserInfo) => Promise<void>;
    logoutUser: () => Promise<void>;
    registerUser: (userInfo: RegisterUserInfo) => Promise<void>;
    checkUserStatus: () => Promise<void>;
    clearError: () => void;
}

interface LoginUserInfo {
    email: string;
    password: string;
}

interface RegisterUserInfo {
    email: string;
    password1: string;
    name: string;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    initialized: false,
    error: null,

    loginUser: async (userInfo: Credentials) => {
        set({ loading: true, error: null });
        try {
            // First try to get current session
            try {
                await account.get();
                // If successful, user is already logged in
                // Delete current session before creating new one
                await account.deleteSession('current');
            } catch {
                // No active session, continue with login
            }

            // Now create new session
            await account.createEmailPasswordSession(
                userInfo.email,
                userInfo.password
            );
            const accountDetails = await account.get();
            set({ 
                user: {
                    id: accountDetails.$id,
                    name: accountDetails.name,
                    email: accountDetails.email
                }
            });
        } catch (error: any) {
            set({ 
                error: {
                    code: error.code || 'AUTH_ERROR',
                    message: error.message || 'An error occurred during login'
                }
            });
        } finally {
            set({ loading: false });
        }
    },

    logoutUser: async () => {
        set({ loading: true, error: null });
        try {
            await account.deleteSession("current");
            set({ user: null });
        } catch (error: any) {
            set({ 
                error: {
                    code: error.code || 'AUTH_ERROR',
                    message: error.message || 'An error occurred during logout'
                }
            });
        } finally {
            set({ loading: false });
        }
    },

    registerUser: async (userInfo: RegisterUserInfo) => {
        set({ loading: true, error: null });
        try {
            await account.create(
                ID.unique(),
                userInfo.email,
                userInfo.password1,
                userInfo.name
            );
            await account.createEmailPasswordSession(
                userInfo.email,
                userInfo.password1
            );
            const accountDetails = await account.get();
            set({ 
                user: {
                    id: accountDetails.$id,
                    name: accountDetails.name,
                    email: accountDetails.email
                } 
            });
        } catch (error: any) {
            set({ 
                error: {
                    code: error.code || 'AUTH_ERROR',
                    message: error.message || 'An error occurred during registration'
                }
            });
        } finally {
            set({ loading: false });
        }
    },

    checkUserStatus: async () => {
        set({ loading: true, error: null });
        try {
            const accountDetails = await account.get();
            set({ 
                user: {
                    id: accountDetails.$id,
                    name: accountDetails.name,
                    email: accountDetails.email
                },
                initialized: true
            });
        } catch (error: any) {
            set({ 
                user: null,
                error: {
                    code: error.code || 'AUTH_ERROR',
                    message: error.message || 'User is not logged in'
                },
                initialized: true
            });
        } finally {
            set({ loading: false });
        }
    },
    
    clearError: () => set({error: null})
}));

// Custom hook to handle initialization
export const useAuthInit = () => {
    const initialized = useAuthStore(state => state.initialized);
    const checkUserStatus = useAuthStore(state => state.checkUserStatus);
    const loading = useAuthStore(state => state.loading);
    const user = useAuthStore(state => state.user);
    const error = useAuthStore(state => state.error);

    useEffect(() => {
        if (!initialized) {
            checkUserStatus();
        }
    }, [initialized, checkUserStatus]);

    return { loading, user, error };
};