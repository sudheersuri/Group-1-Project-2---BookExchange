import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect } from "react";
import { Nav, Navbar } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Forgot from "./components/Forgot";
import Home from "./components/Home";
import Login from "./components/Login";
import LoginHistory from "./components/LoginHistory";
import GenreRating from "./components/GenreRating";
import Signup from "./components/Signup";
import EditProfile from "./components/EditProfile";
import UploadBook from "./components/UploadBook";

const NavBar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">BookExchange</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/home">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/profile">
            Profile
          </Nav.Link>

          <Nav.Link as={Link} to="/uploadbook">
            Upload Book
          </Nav.Link>
          <Nav.Link as={Link} to="/login">
            Login
          </Nav.Link>
          <Nav.Link as={Link} to="/genrerating">
            Genrerating
          </Nav.Link>
          <Nav.Link as={Link} to="/logout">
            Logout
          </Nav.Link>
          <Nav.Link as={Link} to="/loginhistory">
            Login History
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

function Logout() {
  if (localStorage.getItem("uid")) {
    localStorage.removeItem("uid");
    window.location.href = "/login";
  }
  return (
    <div style={{ padding: 20 }}>
      <h2>logging out..</h2>
    </div>
  );
}
function Genre() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Home View</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adip.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <NavBar />

      {/* Rest of the code remains same */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<EditProfile />} />
        <Route path="/uploadbook" element={<UploadBook />} />

        <Route path="/loginhistory" element={<LoginHistory />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/genrerating" element={<GenreRating />} />
        <Route path="/forgot" element={<Forgot />} />
      </Routes>
    </Router>
  );
}

export default App;
