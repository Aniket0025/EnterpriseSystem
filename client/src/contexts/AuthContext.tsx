import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
  id: string; // React apps often want string IDs
  email?: string;
  user_metadata?: { full_name?: string };
}
export interface Session {
  user: User;
  token: string;
}

type UserRole = "super_admin" | "hr_admin" | "employee" | "trainer" | "student" | "intern";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  loading: boolean;
  signIn: (email: string, password: string, recaptchaToken?: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<void>;
  signOut: () => Promise<void>;
  setupDemoAccount: (email: string, password: string, fullName: string, role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>("employee");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (res.ok) {
            const userData = await res.json();
            const formattedUser = { id: userData._id, email: userData.email, user_metadata: { full_name: userData.full_name }};
            setSession({ user: formattedUser, token: storedToken });
            setUser(formattedUser);
            setRole(userData.role);
          } else {
            localStorage.removeItem("token");
            setUser(null);
            setSession(null);
          }
        } catch (error) {
          console.error("Auth init failed", error);
        }
      } else {
        setUser(null);
        setSession(null);
      }
      setLoading(false);
    };

    initAuth();

    window.addEventListener("auth-change", initAuth);
    return () => {
      window.removeEventListener("auth-change", initAuth);
    };
  }, []);

  const signIn = async (email: string, password: string, recaptchaToken?: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, recaptchaToken })
    });
    if (!res.ok) throw new Error(await res.text());
    
    const data = await res.json();
    const formattedUser = { id: data._id, email: data.email, user_metadata: { full_name: data.full_name }};
    setSession({ user: formattedUser, token: data.token });
    setUser(formattedUser);
    setRole(data.role);
    localStorage.setItem("token", data.token);
  };

  const signUp = async (email: string, password: string, fullName: string, userRole: string = "employee") => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name: fullName, role: userRole })
    });
    if (!res.ok) throw new Error(await res.text());
    
    const data = await res.json();
    const formattedUser = { id: data._id, email: data.email, user_metadata: { full_name: data.full_name }};
    setSession({ user: formattedUser, token: data.token });
    setUser(formattedUser);
    setRole(data.role);
    localStorage.setItem("token", data.token);
  };

  const setupDemoAccount = async (email: string, password: string, fullName: string, demoRole: string) => {
    // Attempt sign in first
    try {
      await signIn(email, password);
    } catch {
      await signUp(email, password, fullName, demoRole);
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setRole("employee");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signIn, signUp, signOut, setupDemoAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
