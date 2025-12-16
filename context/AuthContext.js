import { createContext, useState } from "react";
import { auth } from "../services/firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  return (
    <AuthContext.Provider value={{ user, setUser, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};
