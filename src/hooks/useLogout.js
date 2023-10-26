import { signOut } from "firebase/auth";
import useAuthContext from "./useAuthContext";
import { auth } from "../../firebase.config";
import { useState } from "react";

export const useLogout = () => {
  const { user, dispatch } = useAuthContext();
  const [err, setErr] = useState(null);
  const logout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: "LOGOUT" });
    } catch (err) {
      setErr(err);
    }
  };
  return { logout, err };
};
