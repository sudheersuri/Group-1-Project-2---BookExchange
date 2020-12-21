import Axios from "axios";                                                      //axios is a open source library we have imported for http requests and fetching. 
import React, { useEffect, useState } from "react";                             //we have imported the react library
import { Col, Container, Row, Table } from "react-bootstrap";                   // we have imported the react bootstrap library 
import { Link } from "react-router-dom";                                       // helps to return the first route that matches
export default function Home() {
  let src = "";
  //part 1
  if (!localStorage.getItem("uid")) {                                         // gets the user id is present in local storage it directs to the login page
    window.location.href = "/login";
  }
  const [message, setMessage] = useState("");                                 // this enables to give the initial state and returns the current state
  const [response, setResponse] = useState([]);                               // this eanbles to initialise the response
  var datecss = {                                                            // defines the date feature
    opacity: "0.5",
    fontSize: "10px",
  };
  //part 2
  useEffect(() => {                                                          // this is a function to request to  get the user id  from the defined url
    Axios.get(
      `http://localhost:4000/homepage?uid=${localStorage.getItem("uid")}`
    ).then((response) => {
      if (typeof response.data.error !== "undefined") {                      //if the user id is not equal to undefined user will be redirected to the home page.
        // redirect to home
        setMessage(response.data.error);
      } else {                                                               // gives the last login message for the user id and returns all the books                        
        src = `data:image/png;base64{value.base64data}`;
        setMessage(response.data.lastloginmsg);
        setResponse(response.data.allbooks);
      }
    });
  }, []);

  //part 3
  return (                                                                       // this function gets the user name of the user id and specfies a message with the Book cover and Book details in a table format. It also assigns Seller tag to the username of the user id fetched.
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
