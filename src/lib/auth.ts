import { supabase } from "@/integrations/supabase/client";
import type { User, LoginCredentials } from "@/types/auth";

// Simple password hashing (in production, use bcrypt or similar)
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  const hashedPassword = await hashPassword(password);
  return hashedPassword === hash;
};

export const loginUser = async (
  credentials: LoginCredentials
): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", credentials.username)
      .single();

    if (error || !data) {
      return { success: false, error: "Invalid username or password" };
    }

    const isValidPassword = await verifyPassword(
      credentials.password,
      data.password_hash
    );

    if (!isValidPassword) {
      return { success: false, error: "Invalid username or password" };
    }

    // Store user in localStorage for session management
    const user: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    localStorage.setItem("user", JSON.stringify(user));

    return { success: true, user };
  } catch (error) {
    return { success: false, error: "Login failed. Please try again." };
  }
};

export const logoutUser = async (): Promise<void> => {
  localStorage.removeItem("user");
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
