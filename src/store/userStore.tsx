import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { getUser } from "@functions/requests/users";
import { getStoredItem, storeItem } from "@functions/services";
import type { UserInfo } from "@ctypes/dto/users";

interface UserContextType {
  isConnected: boolean;
  userProfile: UserInfo | undefined;
  isLoading: boolean;
  login: (discordId: string, token: string) => void;
  logout: () => void;
  refreshUserProfile: () => Promise<void>;
}

// Default context value
const defaultUserContext: UserContextType = {
  isConnected: false,
  userProfile: undefined,
  isLoading: false,
  login: (_discordId: string, _token: string) => {
    // Default implementation - will be overridden by provider
    console.warn("login called outside of UserProvider");
  },
  logout: () => {
    // Default implementation - will be overridden by provider
    console.warn("logout called outside of UserProvider");
  },
  refreshUserProfile: async () => {
    // Default implementation - will be overridden by provider
    console.warn("refreshUserProfile called outside of UserProvider");
    return Promise.resolve();
  },
};

// Create the context
const UserContext = createContext<UserContextType>(defaultUserContext);

interface UserProviderProps {
  children: ReactNode;
}

/**
 * User context provider that manages connection state and profile
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserInfo>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if the user is connected when loading the component
  useEffect(() => {
    const checkUserConnection = async () => {
      setIsLoading(true);
      const token = getStoredItem("token");

      console.log("Token:", token);

      if (token) {
        setIsConnected(true);
        try {
          await refreshUserProfile();
        } catch (err) {
          console.error("Error loading profile:", err);
        }
      }

      setIsLoading(false);
    };

    checkUserConnection();
  }, []);

  /**
   * Updates the user profile information from the API
   */
  const refreshUserProfile = async (): Promise<void> => {
    try {
      const token = getStoredItem("token");
      if (!token) {
        setUserProfile(undefined);
        return;
      }

      setIsLoading(true);
      const userData = await getUser();
      setUserProfile(userData);
      setIsConnected(true);
    } catch (err) {
      console.error("Error getting user data:", err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * User login
   */
  const login = (discordId: string, token: string): void => {
    storeItem("discordid", discordId);
    storeItem("token", token);
    setIsConnected(true);
    refreshUserProfile();
  };

  /**
   * User logout
   */
  const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("discordid");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("discordid");
    setIsConnected(false);
    setUserProfile(undefined);
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      isConnected,
      userProfile,
      isLoading,
      login,
      logout,
      refreshUserProfile,
    }),
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    [isConnected, userProfile, isLoading, login, logout, refreshUserProfile],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

/**
 * Custom hook to access the user context
 */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
