import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TripProvider } from "./context/TripContext";
import { UserProvider } from "./context/UserContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <UserProvider>
      <TripProvider>
        <App />
      </TripProvider>
    </UserProvider>
  </React.StrictMode>
);