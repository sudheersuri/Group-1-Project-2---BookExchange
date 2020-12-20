import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
export default function Home() {
  let src = "";
  //part 1
  if (!localStorage.getItem("uid")) {
    window.location.href = "/login";
  }
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState([]);
  var datecss = {
    opacity: "0.5",
    fontSize: "10px",
  };
  //part 2
  useEffect(() => {
    Axios.get(
      `http://localhost:4000/homepage?uid=${localStorage.getItem("uid")}`
    ).then((response) => {
      if (typeof response.data.error !== "undefined") {
        // redirect to home
        setMessage(response.data.error);
      } else {
        src = `data:image/png;base64{value.base64data}`;
        setMessage(response.data.lastloginmsg);
        setResponse(response.data.allbooks);
      }
    });
  }, []);

  //part 3
  return (
    <div style={{ padding: 20 }}>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={8} lg={6}>
            <em style={datecss}>
              Hi&nbsp;{localStorage.getItem("username")}, you&nbsp;{message}
            </em>

            <Table bordered hover size="md">
              <thead>
                <tr style={datecss}>
                  <th>Book Cover</th>
                  <th>Book Details</th>
                </tr>
              </thead>
              <tbody>
                {console.log(response)}
                {response.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <img
                          src={`data:${value.contenttype};base64,${value.base64data}`}
                          height="100"
                          width="80"
                        />
                      </td>
                      <td>
                        <Link to="" activeClassName="active">
                          {value.bookname}
                        </Link>
                        <br />
                        <b style={datecss}>Seller : {value.username}</b>
                        <br />
                        <br />
                        <i style={datecss}>{value.bookposteddate}</i>
                      </td>
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
