import { signOut } from "firebase/auth";
import { clientAuth } from "@/admin/lib/firebaseClient";
import axios from "axios";

export const signout = async () => {
  try {
    await signOut(clientAuth);
    await axios.post("/api/admin/userManagement/sessionLogout");
  } catch (error) {
    throw error;
  }
};
