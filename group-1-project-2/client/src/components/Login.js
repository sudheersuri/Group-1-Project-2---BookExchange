import Axios from "axios";                                                    //axios is a open source library we have imported for http requests and fetching. 
import React, { useState } from "react";                                      //we have imported the react library

import {                                                                     // We have imported Button, Col, Container, Form, Row , Navigate, Nav from the react-bootsrap library
  Button,
  Col,
  Container,
  Form,
  Row,
  Navigate,
  Nav,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";                     // helps to return the first route that matches and enables to navigate quickly with new hook.
function Login() {                                                        // enables login functionalities
  if (localStorage.getItem("uid")) {                                      // gets the user id present in local storage it directs to the login page
    window.location.href = "/home";
  }
  let navigate = useNavigate();                                          // enables user to navigate

  const [errormessage, setErrorMesssage] = useState("");                 //returns the current state
  const onFormSubmit = (e) => {                                          // When user submits the form it returns the form data
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    Axios.post("http://localhost:4000/validate", formDataObj).then(     // this posts the data on the local host:4000 and validates the data
      (response) => {
        if (typeof response.data.error !== "undefined") {               //if the user id is not equal to undefined user will be redirected to the home page.
          //redirect to home
          setErrorMesssage(response.data.error);                        // gives an error message
        } else {
          localStorage.setItem("uid", response.data.uid);               // sets the user id of the user as specified by the user
          localStorage.setItem("username", response.data.username);     // sets the username of the user as specified by the user
          navigate("/home");                                            // directs the user to the home page
        }
      }
    );
    e.preventDefault();
  };
  return (                                                              // this returns the form  with email,password , submit button to submit the form and Signup and Forgot password functionality.
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
