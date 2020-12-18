import React from "react";
import "./App.css";
import Axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useHistory,
  Link,
  Outlet,
  useParams,
} from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
const NavBar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/home">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/profile">
            Profile
          </Nav.Link>
          <Nav.Link as={Link} to="/login">
            Login
          </Nav.Link>
          <Nav.Link as={Link} to="/genrerating">
            Genrerating
          </Nav.Link>
          <Nav.Link as={Link} to="/logout">
            LogOut
          </Nav.Link>
          <Nav.Link as={Link} to="/loginhistory">
            Login History
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

let errmsg = "";

function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Home View</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adip.</p>
    </div>
  );
}
function Signup() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Home View</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adip.</p>
    </div>
  );
}
function Logout() {
  localStorage.removeItem("uid");
  window.location.href = "/login";
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
function ForgotPass() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Home View</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adip.</p>
    </div>
  );
}
function Login() {
  const [errormessage, setErrorMesssage] = useState("");
  const onFormSubmit = (e) => {
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    Axios.post("http://localhost:4000/validate", formDataObj).then(
      (response) => {
        if (typeof response.data.error !== "undefined") {
          //redirect to home
          setErrorMesssage(response.data.error);
        } else {
          localStorage.setItem("uid", response.data.uid);
          localStorage.setItem("username", response.data.username);
          window.location.href = "/home";
        }
      }
    );
    e.preventDefault();
  };
  return (
    <div style={{ padding: 20 }}>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={10} md={8} lg={6}>
            <Form onSubmit={onFormSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="psw"
                  type="password"
                  placeholder="Password"
                />
              </Form.Group>
              {errormessage} <br />
              <Link to="/forgot">Forgot Password?</Link>
              <br />
              <br />
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function App() {
  return (
    <Router>
      <NavBar />

      {/* Rest of the code remains same */}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/genre" element={<Genre />} />
        <Route path="/forgot" element={<ForgotPass />} />
      </Routes>
    </Router>
  );
}

export default App;
