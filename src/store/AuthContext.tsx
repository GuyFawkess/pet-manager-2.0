import type { ReactNode } from "react";
import { useContext, useState, useEffect, createContext } from "react";
import { account } from "../appwriteConfig";
import { ID } from "appwrite";
import type { Models } from "appwrite";

interface AuthContextType {
    user: Models.User<Models.Preferences> | null;
    loginUser: (userInfo: LoginUserInfo) => Promise<void>;
    logoutUser: () => Promise<void>;
    registerUser: (userInfo: RegisterUserInfo) => Promise<void>;
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

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const loginUser = async (userInfo: LoginUserInfo): Promise<void> => {
        setLoading(true);

        try {
            await account.createEmailPasswordSession(
                userInfo.email,
                userInfo.password
            );
            let accountDetails = await account.get();
            setUser(accountDetails);
        } catch (error: any) {
            setLoading(false);
            console.log("Login error:", error.message);
        }
        setLoading(false);
    };

    const logoutUser = async (): Promise<void> => {
        setLoading(true);
        try {
            await account.deleteSession("current");
            setUser(null);
        } catch (error: any) {
            console.log("Logout error:", error.message);
            setLoading(false);
        }
        setLoading(false);
    };

    const registerUser = async (userInfo: RegisterUserInfo): Promise<void> => {
        setLoading(true);
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
            let accountDetails = await account.get();
            setUser(accountDetails);
        } catch (error: any) {
            setLoading(false);
            console.log("Registration error:", error.message);
        }
        setLoading(false);
    };

    const checkUserStatus = async (): Promise<void> => {
        setLoading(true);
        try {
            let accountDetails = await account.get();
            setUser(accountDetails);
        } catch (error: any) {
            setLoading(false);
            console.log("User is not logged in:", error.message);
            setUser(null);
        }
        setLoading(false);
    };

    const contextData: AuthContextType = {
        user,
        loginUser,
        logoutUser,
        registerUser
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <div className="flex justify-center items-center h-screen">
                <span className="loading loading-bars loading-xl"></span>
            </div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;