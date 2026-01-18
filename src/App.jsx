import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="bg-white text-slate-900 flex flex-col min-h-screen overflow-x-hidden font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
