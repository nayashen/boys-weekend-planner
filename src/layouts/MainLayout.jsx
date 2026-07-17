import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          backgroundColor: "#f3f4f6",
          minHeight: "100vh",
        }}
      >
        <TopBar />

        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;