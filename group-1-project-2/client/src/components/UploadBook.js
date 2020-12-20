import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
export default function UploadBook() {
  if (!localStorage.getItem("uid")) {
    window.location.href = "/login";
  }
  const [genrelist, setGenresList] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedfile, setFile] = useState({});
  const [loading, setLoading] = useState(false);
  var uploadcss = {
    opacity: "0.5",
    fontSize: "20px",
  };
  //   http:localhost:3000/Public/images/image.jpg
  //part 2
  const onChangeHandler = (event) => {
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      let data = reader.result.toString().replace(/^data:.+;base64,/, "");
      let attachment = {
        base64Data: data,
        filename: file.name,
        contentType: file.type,
      };
      setFile(attachment);
    };
  };

  useEffect(() => {
    Axios.post("http://localhost:4000/genres", {
      uid: localStorage.getItem("uid"),
    }).then((response) => {
      if (typeof response.data.error !== "undefined") {
        // redirect to home
        setMessage(response.data.error);
      } else {
        setGenresList(response.data.genrelist);
      }
    });
  }, []);
  const onFormSubmit = (e) => {
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());

    console.log(selectedfile);
    e.preventDefault();
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };

    // const formDataObj = Object.fromEntries(formData.entries());
    setMessage("");
    setLoading(true);
    Axios.post("http://localhost:4000/uploadbook", {
      file: selectedfile,
      uid: localStorage.getItem("uid"),
      ...formDataObj,
    }).then((response) => {
      setLoading(false);
      if (typeof response.data.error !== "undefined") {
        //redirect to home
        setMessage(response.data.error);
      } else {
        setMessage(response.data.message);
      }
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={10} md={8} lg={6}>
            <Form onSubmit={onFormSubmit}>
              <Form.Group controlId="formBasicName">
                <Form.Label>Book Name</Form.Label>
                <Form.Control
                  type="text"
                  name="bookname"
                  placeholder="Enter Book Name"
                />
              </Form.Group>{" "}
              <Form.Group controlId="formBasicDesc">
                <Form.Label>Book Description</Form.Label>
                <Form.Control
                  type="text"
                  name="bookdesc"
                  placeholder="Enter Book Description"
                />
              </Form.Group>
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
              <Form>
                <Form.Group>
                  <input type="file" name="file" onChange={onChangeHandler} />
                </Form.Group>
              </Form>
              {message}
              <br />
              {loading ? <i style={uploadcss}>Uploading.......</i> : ""}
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
