import Axios from "axios";
import React, { useState, useEffect } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function LoginHistory() {
  //part 1
  if (!localStorage.getItem("uid")) {
    window.location.href = "/login";
  }
  const [message, setMesssage] = useState("");
  const [response, setResponse] = useState([]);
  var scrollcss = {
    position: "relative",
    height: "300px",
    overflow: "auto",
  };
  //part 2
  useEffect(() => {
    Axios.post("http://localhost:4000/loginhistory", {
      uid: localStorage.getItem("uid"),
    }).then((response) => {
      if (typeof response.data.error !== "undefined") {
        // redirect to home
        setMesssage(response.data.error);
      } else {
        setResponse(response.data.loginhistory);
      }
    });
  }, []);

  //part 3
  return (
    <div style={{ padding: 20 }}>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={10} md={8} lg={6} style={scrollcss}>
            {message}
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Login Date</th>
                </tr>
              </thead>
              <tbody>
                {console.log(response)}
                {response.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{value.lastlogindate.replace("T", "  ")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
