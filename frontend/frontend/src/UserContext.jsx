// src/UserContext.jsx
import { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const logOut = () => {
    setEmail("");
    setProfilePic("");
    localStorage.clear();
  };

  return (
    <UserContext.Provider
      value={{ email, setEmail, profilePic, setProfilePic, logOut }}
    >
      {children}
    </UserContext.Provider>
  );
}
