import Axios from "axios";
import React, { useState } from "react";

import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Navigate,
  Nav,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
function Login() {
  let navigate = useNavigate();

  const [errormessage, setErrorMesssage] = useState("");
  const onFormSubmit = (e) => {
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    Axios.post("http://localhost:4000/validate", formDataObj).then(
      (response) => {
        if (typeof response.data.error !== "undefined") {
          //redirect to home
          setErrorMesssage(response.data.error);
        } else {
          localStorage.setItem("uid", response.data.uid);
          localStorage.setItem("username", response.data.username);
          navigate("/home");
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
              <Link to="/signup">Signup |</Link>&nbsp;
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

export default Login;
