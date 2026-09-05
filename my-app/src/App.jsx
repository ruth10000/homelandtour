import { Routes, Route } from "react-router-dom"
import Home from './components/home'
import Tours from "./components/tour"
import About from "./components/about";
import Contact from "./components/contact";
import Packages from "./components/packages";
import "./App.css"
import Login from "./components/Login";
import Adashboard from "./components/admin/adashboard";
import Register from "./components/Register";
import Padetail from "./components/padetail";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:id" element={<Padetail />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/adashboard" element={<Adashboard />} />
      </Routes>
    </>
  )
}

export default App




