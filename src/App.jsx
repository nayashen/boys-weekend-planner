import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div
      style={{
        display: "flex",
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

        <Dashboard />
      </div>
    </div>
  );
}

export default App;