import Axios from "axios"; //axios is a open source library we have imported for http requests and fetching.
import React, { useState, useEffect } from "react"; //we have imported the react library
import { Button, Col, Container, Form, Row } from "react-bootstrap"; // We have imported Button, Col, Container, Form, Row from the react-bootsrap library
import { useNavigate } from "react-router-dom"; // This imports the navigation feature for the user from the react-router-dom
export default function EditProfile() {
  //this exports the Edit profile function
  const [redirect, setRedirect] = useState(""); // this sets the current stae to redirect

  if (!localStorage.getItem("uid")) {
    //if the user id is not equal to the local storage it redirects the user to the login page
    window.location.href = "/login";
  }
  // else it returns the message, counter as per the current state of the user
  const [response, setResponse] = useState("");

  const [message, setMesssage] = useState("");

  const [counter, setCounter] = useState("");
  //part 2
  useEffect(() => {
    Axios.post("http://localhost:4000/profile", {
      // this posts the user id from the local storage to the url localhost:4000/profile page in the user id field
      uid: localStorage.getItem("uid"),
    }).then((response) => {
      if (typeof response.data.error !== "undefined") {
        // if the user is undefined it returns the error message and redirects the user to the home page
        // redirect to home
        setMesssage(response.data.error);
      } else {
        setResponse(response.data.details[0]); // accepts the details of the user
      }
    });
  }, [counter]);
  const onFormSubmit = (e) => {
    // function that executes on submission of the form
    e.preventDefault();
    const formData = new FormData(e.target); // new form data generated on the target page
    const formDataObj = Object.fromEntries(formData.entries()); // form data is taken as entries from the user in the form object form
    formDataObj.uid = localStorage.getItem("uid"); // gets the user id from local storage stored as a form object entry
    Axios.post("http://localhost:4000/updateuser", formDataObj).then(
      // posts the data on the page with url localhost:4000/updateuser page
      (response) => {
        if (typeof response.data.error !== "undefined") {
          // if the user is undefined it gives the error message and redirects the user to the home page.
          //redirect to home
          setMesssage(response.data.error);
        } else {
          localStorage.setItem("username", formDataObj.uname); //sets the username entered by the user in the form object as uname and stored in local storage
          setMesssage(response.data.message); //gives a message
          setCounter(counter + 1); // sets the counter and increments the counter by 1
        }
      }
    );
  };
  return (
    //this function returns the form with the Fields Username to be neterd by the user and Email address field for email id to be entered by the user and a submit button to submit the data entered in these feilds by the user.
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
