import { useContext } from "react";
import { authContext } from "../context/AuthContext";

export default function useAuthContext() {
  const context = useContext(authContext);
  if (!context)
    throw new Error("useAuthContext() must be used inside AuthProvider");
  return context;
}
