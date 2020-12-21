//Importing premade libraries Axios,React,React-bootstrap, react-router-dom and ../assets/rating.jpg
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, Col, Container, Row, Table, Button } from "react-bootstrap";
import rating from "../assets/rating.jpg";
import { useNavigate } from "react-router-dom";

//Create a fuction GenreRating to generate the ratings for Genre of books
//It is used to create the ratings of genres of books
export default function GenreRating() {

  if (!localStorage.getItem("uid")) {
    window.location.href = "/login";
  }
  const [message, setMesssage] = useState("");
  const [errmessage, setErrMesssage] = useState("");

  const [response, setResponse] = useState([]);
  const [genrelist, setGenresList] = useState([]);

  const [counter, setCounter] = useState(0);


  useEffect(() => {
    Axios.post("http://localhost:4000/genres", {
      uid: localStorage.getItem("uid"),
    }).then((response) => {
      if (typeof response.data.error !== "undefined") {
        // It is redirecting to home
        setErrMesssage(response.data.error);
      } else {
        setResponse(response.data.allratings);
        setGenresList(response.data.genrelist);
      }
    });
  }, [counter]);
  const onFormSubmit = (e) => {
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    formDataObj.uid = localStorage.getItem("uid");

    Axios.post("http://localhost:4000/postgenres", formDataObj).then(
      (response) => {
        if (typeof response.data.error !== "undefined") {
          //It is redirecting to home
          setMesssage(response.data.error);
        } else {
          console.log(counter + ": incrementing counter");
          setCounter(counter + 1);
          setMesssage(response.data.message);
        }
      }
    );
    e.preventDefault();
  };

  //Here we create a form to generate ratings for genres by using table fields Genre, public rating and your rating
  return (
    <div style={{ padding: 20 }}>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={10} md={8} lg={6}>
            {errmessage}
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>Genre</th>
                  <th>Public Rating</th>
                  <th>Your Rating</th>
                </tr>
              </thead>
              <tbody>
                {console.log("The counter is " + "" + counter + "" + response)}
                {response.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td>{value.genredesc}</td>
                      <td>
                        <img src={rating} width="20" height="20" />
                        &nbsp;{(value.rating.toFixed(2))}
                      </td>
                      <td>
                        <img src={rating} width="20" height="20" />
                        &nbsp;
                        {value.userrating ? value.userrating : "Give Rating"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <br />
            <Form onSubmit={onFormSubmit}>
              <Form.Group>
                <Form.Label>Select Genre</Form.Label>
                <Form.Control as="select" size="sm" name="genreid" custom>
                  {genrelist.map((value, index) => {
                    return (
                      <option value={value.genreid}>{value.genredesc}</option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Give Rating</Form.Label>
                <Form.Control as="select" size="sm" name="userrating" custom>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </Form.Control>
              </Form.Group>
              {message}
              <br />
              <Button variant="primary" type="submit">
                Post Rating
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
