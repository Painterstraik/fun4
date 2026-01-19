export type UserRole = "admin" | "user";

export const isAdmin = (role?: string | null) => role === "admin";
