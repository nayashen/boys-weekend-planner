import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  // Temporary admin user
  const [currentUser, setCurrentUser] = useState({
    name: "Nayashen",
    role: "admin",
  });

  const value = {
    currentUser,
    setCurrentUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}