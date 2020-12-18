import Axios from "axios";
import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
export default function Forgot() {
  const [message, setMesssage] = useState("");
  const onFormSubmit = (e) => {
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    Axios.post("http://localhost:4000/sendforgetemail", formDataObj).then(
      (response) => {
        if (typeof response.data.error !== "undefined") {
          //redirect to home
          setMesssage(response.data.error);
        } else {
          setMesssage(response.data.message);
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
              {message}
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
