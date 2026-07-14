import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Members from "./pages/Members";

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

        <Members />
      </div>
    </div>
  );
}

export default App;