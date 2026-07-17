import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import BankStatement from "./pages/BankStatement";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Finance from "./pages/Finance";
import Contributions from "./pages/Contributions";
import Accommodation from "./pages/Accommodation";
import Grocery from "./pages/Grocery";
import Drinks from "./pages/Drinks";
import Expenses from "./pages/Expenses";
import Settings from "./pages/Settings";
import Gallery from "./pages/Gallery";

function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
        }}
      >
        <Sidebar />

        <main
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Routes>
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/members"
              element={<Members />}
            />

            <Route
              path="/finance"
              element={<Finance />}
            />

            <Route
              path="/contributions"
              element={<Contributions />}
            />

            <Route
              path="/bank-statement"
              element={<BankStatement />}
            />

            <Route
              path="/accommodation"
              element={<Accommodation />}
            />

            <Route
              path="/grocery"
              element={<Grocery />}
            />

            <Route
              path="/drinks"
              element={<Drinks />}
            />

            <Route
              path="/expenses"
              element={<Expenses />}
            />

            {/* NEW GALLERY PAGE */}
            <Route
              path="/gallery"
              element={<Gallery />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;