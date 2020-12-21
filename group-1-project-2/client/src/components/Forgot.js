import Axios from "axios";                                                         //axios is a open source library we have imported for http requests and fetching.
import React, { useState } from "react";                                           //we have imported the react library
import { Button, Col, Container, Form, Row } from "react-bootstrap";               // we have imported the react bootstrap library 
export default function Forgot() {                                                 // this exports the forgot function
  const [message, setMesssage] = useState("");                                    // returns the current state
  const onFormSubmit = (e) => {
    const formData = new FormData(e.target);                                      // returns the new form data to the targeted page
    const formDataObj = Object.fromEntries(formData.entries());                   // returns the form entries
    Axios.post("http://localhost:4000/sendforgetemail", formDataObj).then(        // this posts the data to localhost:4000/sendforgetemail page
      (response) => {
        if (typeof response.data.error !== "undefined") {                        // gives the error message if the user is undefined and redirects user to the home page
          //redirect to home 
          setMesssage(response.data.error);
        } else {
          setMesssage(response.data.message);                                   // if user is valid it gives the correct message
        }
      }
    );
    e.preventDefault();
  };

  return (                                                                     // This function returns the Form structured page having email feild in the form and a text below this feild "We'll never share your email with anyone else" and a submit button below it to submit the email id.
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
