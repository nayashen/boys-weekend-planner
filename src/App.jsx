import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { TripProvider } from "./context/TripContext";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Finance from "./pages/Finance";
import Contributions from "./pages/Contributions";
import Groceries from "./pages/Grocery";
import Accommodation from "./pages/Accommodation";
import Gallery from "./pages/Gallery";
import Drinks from "./pages/Drinks";
import Expenses from "./pages/Expenses";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <TripProvider>
        <Routes>

          {/* LOGIN PAGE */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* PROTECTED APPLICATION */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >

            {/* DASHBOARD */}
            <Route
              index
              element={<Dashboard />}
            />

            {/* MEMBERS */}
            <Route
              path="members"
              element={<Members />}
            />

            {/* FINANCE */}
            <Route
              path="finance"
              element={<Finance />}
            />

            {/* CONTRIBUTIONS */}
            <Route
              path="contributions"
              element={<Contributions />}
            />

            {/* GROCERIES */}
            <Route
              path="groceries"
              element={<Groceries />}
            />

            {/* ACCOMMODATION */}
            <Route
              path="accommodation"
              element={<Accommodation />}
            />

            {/* GALLERY */}
            <Route
              path="gallery"
              element={<Gallery />}
            />

            {/* DRINKS */}
            <Route
              path="drinks"
              element={<Drinks />}
            />

            {/* EXPENSES */}
            <Route
              path="expenses"
              element={<Expenses />}
            />

            {/* SETTINGS */}
            <Route
              path="settings"
              element={<Settings />}
            />

          </Route>

          {/* UNKNOWN ROUTES */}
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>
      </TripProvider>
    </BrowserRouter>
  );
}

export default App;