import Axios from "axios";
import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
export default function Signup() {
  let navigate = useNavigate();
  const [message, setMesssage] = useState("");
  const onFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    console.log(formDataObj);
    console.log(formDataObj.psw);
    if (formDataObj.psw != formDataObj.cpsw) {
      setMesssage("Passwords dont match");
    } else {
      Axios.post("http://localhost:4000/adduser", formDataObj).then(
        (response) => {
          if (typeof response.data.error !== "undefined") {
            //redirect to home
            setMesssage(response.data.error);
          } else {
            navigate("/login");
          }
        }
      );
    }
  };
  return (
    <div style={{ padding: 20 }}>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={10} md={8} lg={6}>
            <Form onSubmit={onFormSubmit}>
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="uname"
                  placeholder="Enter username"
                />
              </Form.Group>
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
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="psw"
                  type="password"
                  placeholder="Password"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  name="cpsw"
                  type="password"
                  placeholder="Password"
                />
              </Form.Group>
              {message} <br />
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
