import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import { UserContextProvider } from "../context/userContext";

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Navbar /> {/* Place Navbar inside BrowserRouter */}
        <Routes>
          {/* <Route path="/nav" element={<Navbar/>} /> */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          {/* Add a route for the root path if needed */}
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;
