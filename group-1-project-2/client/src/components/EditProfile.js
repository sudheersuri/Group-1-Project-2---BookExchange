import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
export default function EditProfile() {
  const [redirect, setRedirect] = useState("");

  if (!localStorage.getItem("uid")) {
    window.location.href = "/login";
  }

  const [response, setResponse] = useState("");

  const [message, setMesssage] = useState("");

  const [counter, setCounter] = useState("");
  //part 2
  useEffect(() => {
    Axios.post("http://localhost:4000/profile", {
      uid: localStorage.getItem("uid"),
    }).then((response) => {
      if (typeof response.data.error !== "undefined") {
        // redirect to home
        setMesssage(response.data.error);
      } else {
        setResponse(response.data.details[0]);
      }
    });
  }, [counter]);
  const onFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    formDataObj.uid = localStorage.getItem("uid");
    Axios.post("http://localhost:4000/updateuser", formDataObj).then(
      (response) => {
        if (typeof response.data.error !== "undefined") {
          //redirect to home
          setMesssage(response.data.error);
        } else {
          localStorage.setItem("username", formDataObj.uname);
          setMesssage(response.data.message);
          setCounter(counter + 1);
        }
      }
    );
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
                  defaultValue={response.username}
                  placeholder="Enter username"
                />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  defaultValue={response.email}
                  placeholder="Enter email"
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
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
