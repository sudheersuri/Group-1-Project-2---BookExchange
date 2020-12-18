import logo from "./logo.svg";
import "./App.css";
import Axios from "axios";
import { useEffect, useState } from "react";

function App() {
  //first this will be declared
  const [res, setRes] = useState("");
  //this function is like componentdidmount and will execute before render function
  useEffect(() => {
    Axios.get("http://localhost:4000/documentation").then((response) => {
      setRes(response.data);
    });
  });
  //this will return jsx code.
  return (
    <div className="App">
      {res.name}
      {res.lastloginmsg}
    </div>
  );
}

export default App;
