//import required packages.
const express = require("express");
const bodyParser = require("body-parser");

const path = require("path");
const cors = require("cors");
const session = require("express-session");
const mailgun = require("mailgun-js");
const mysql = require("mysql2");

//setup details for mailgun
const DOMAIN = "sandbox97e61f2954d34e089bd93a3510e9c5fa.mailgun.org";
const api_key = "63e5b8e05f853a86285305d137fb29aa-360a0b2c-9b053ba1";
const mg = mailgun({ apiKey: api_key, domain: DOMAIN });
const authorized_recipients = [
  "ssuri@confederationcollege.ca",
  "mkoyande@confederationcollege.ca",
  "eduardo.coelhoreis@confederationcollege.ca",
  "skaur9@confederationcollege.ca",
];

function getNewConnection() {
  return mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "bookexchangedb",
  });
}

//instantiate app
const app = express();
app.use(cors());

app.use(session({ secret: "sss1234" }));
// Static folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(
  bodyParser.json({ limit: "50mb", extended: true }),
  bodyParser.urlencoded({ extended: false })
);
app.use(bodyParser.json());

//there is no need of login in below
app.get("/login", (req, res) => {
  if (req.session.error != null) res.send({ msg: req.session.error });
  else res.send({ msg: false });
});

app.get("/homepage", (req, res) => {
  uid = req.query.uid;
  const connection = getNewConnection();
  queryString = `select lastlogindate from loginhistory where uid=${uid} order by lastlogindate desc`;
  //execute the query
  connection.query(queryString, (err, result, fields) => {
    if (err != null) {
      res.send({ error: "Something went wrong!", err });
    }
    //if there is more than 1 row , get the last login date store it in lastloginmsg variable
    var lastloginmsg =
      "Last loggedin at " + result[0].lastlogindate.split("T")[0] + " ISO";
    //write the query to get the last login time by uid
    queryString = `select userbooks.base64data,userbooks.contenttype,users.username,userbooks.bookname,userbooks.bookdesc,userbooks.bookposteddate from users join userbooks on users.uid=userbooks.uid `;
    //execute the query
    connection.query(queryString, (err, result, fields) => {
      if (err != null) {
        res.send({ error: "Something went wrong!", err });
      } else {
        res.send({ allbooks: result, lastloginmsg });
      }
    });
  });
});

app.post("/genres", (req, res) => {
  let uid = req.body.uid;
  const connection = getNewConnection();
  queryString = `select genres.genreid,genres.genredesc,avg(rating) as rating from genrerating join genres on genres.genreid=genrerating.genreid group by genres.genreid`;

  //execute the query
  connection.query(queryString, (err, result, fields) => {
    //check if errors
    if (err != null) {
      res.send({
        error: "Something went wrong!",
        username: req.session.username,
        lastloginmsg: req.session.lastloginmsg,
      });
    } else {
      var publicobj = result;
      if (!uid)
        res.send({
          username: req.session.username,
          allratings: publicobj,
          lastloginmsg: req.session.lastloginmsg,
        });
      else {
        queryString = `select genres.genredesc,rating as rating,genres.genreid from genrerating join genres on genres.genreid=genrerating.genreid where genrerating.uid=${uid} group by genres.genreid`;
        connection.query(queryString, (err, result, fields) => {
          //check if errors
          if (err != null) {
            res.send({
              error: "Something went wrong!",
              username: req.session.username,
              lastloginmsg: req.session.lastloginmsg,
            });
          } else {
            var userratingobj = result;
            if (userratingobj.length == 0) {
              //send userrating as null if there is no userrating.
              publicobj[0].userrating = "";
              res.send({
                allratings: publicobj,
                username: req.session.username,
                lastloginmsg: req.session.lastloginmsg,
              });
              return;
            }
            var userrating = "";
            var genreid = "";
            var foundobj = "";
            // start the loop
            var i = 0;

            for (i = 0; i < publicobj.length; i++) {
              foundobj = userratingobj.find(
                (element) => element.genreid == publicobj[i].genreid
              );
              console.log(i + "---" + foundobj);

              if (typeof foundobj !== "undefined") {
                //it will now get the rating
                userrating = userratingobj.find(
                  (element) => element.genreid == publicobj[i].genreid
                ).rating;
                //it will set the rating
                publicobj[i].userrating = userrating;
              } else publicobj[i].userrating = "";
            }
            const queryString = `select * from genres`;
            //execute the query
            connection.query(queryString, (err, result, fields) => {
              console.log("came here");
              //check if errors
              if (err != null) {
                res.send({
                  error: "Something went wrong!",
                  genrelist: result,
                  allratings: publicobj,
                  username: req.session.username,
                  lastloginmsg: req.session.lastloginmsg,
                });
              } else {
                res.send({
                  genrelist: result,
                  allratings: publicobj,
                  username: req.session.username,
                  lastloginmsg: req.session.lastloginmsg,
                });
              }
            });
          }
        });
      }
    }
  });
});

app.post("/postgenres", (req, res) => {
  var uid = req.body.uid;
  var genreid = req.body.genreid;
  var rating = req.body.userrating;
  var queryString = "";
  const connection = getNewConnection();
  console.log(genreid + "" + rating);
  queryString = `select * from genrerating where uid=${uid} and genreid=${genreid}`;
  connection.query(queryString, (err, result, fields) => {
    //check if errors
    console.log(result);
    if (err != null) {
      console.log(err);
      res.send({
        error: "Something went wrong",
        username: req.session.username,
        error: "Something went wrong!",
        lastloginmsg: req.session.lastloginmsg,
      });
      return;
    } else {
      if (result.length == 0) {
        queryString = `insert into genrerating(uid,genreid,rating) values(${uid},${genreid},${rating})`;
      } else {
        queryString = `update genrerating set rating=${rating} where uid=${uid} and genreid=${genreid}`;
      }
    }
    connection.query(queryString, (err, result, fields) => {
      //check if errors
      if (err != null)
        res.send({
          username: req.session.username,
          error: "Something went wrong!",
          lastloginmsg: req.session.lastloginmsg,
        });
      else {
        res.send({
          message: "Rating has been added!",
        });
      }
    });
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});
app.post("/uploadbook", (req, res) => {
  uid = req.body.uid;
  console.log(req.body);
  fileextensions = ["image/jpeg", "image/png", "image/jpg"];
  if (!fileextensions.includes(req.body.file.contentType)) {
    res.send({ error: "Only Images are accepted!" });
    return;
  } else {
    const connection = getNewConnection();
    currdate = new Date();
    currdate = currdate.toISOString().replace("T", " ");
    const queryString = `insert into userbooks(uid,bookid,bookname,bookdesc,base64data,genreid,contenttype,bookposteddate) values(${uid},concat(uid,${Date.now()}),'${
      req.body.bookname
    }','${req.body.bookdesc}','${req.body.file.base64Data}',${
      req.body.genreid
    },'${req.body.file.contentType}','${currdate}')`;
    //execute the query
    console.log(queryString);
    connection.query(queryString, (err, result, fields) => {
      //check if errors
      if (err != null) {
        console.log(err);
        res.send({
          error: "Something went wrong, Please try again later!",
        });
      } else {
        console.log("Book Added");
        res.send({ message: "Book Added!" });
      }
    });
  }
});

app.post("/loginhistory", (req, res) => {
  //get connection
  const connection = getNewConnection();
  //write query to get date from loginhistory table
  const queryString = `select lastlogindate from loginhistory where uid=${req.body.uid}`;
  //execute the query
  console.log(queryString);
  connection.query(queryString, (err, result, fields) => {
    //check if errors
    if (err != null) {
      console.error(err);
      //if errors send a message to user that server error exists
      res.send({
        error: "Something went wrong, please try again later!",
        lastloginmsg: req.session.lastloginmsg,
        username: req.session.username,
      });
    } else {
      //if no err exists send data
      res.send({
        loginhistory: result,
        username: req.session.username,
        lastloginmsg: req.session.lastloginmsg,
      });
    }
  });
});

app.post("/validate", (req, res) => {
  
  const connection = getNewConnection();
  var email = req.body.email; //email
  var psw = req.body.psw; //psw
  const queryString = `select uid,username,password from users where email='${email}' limit 1`;

  connection.query(queryString, (err, result, fields) => {
    if (err != null) {
      console.error(err);
      // Send Code Error to the user.
      req.session.error = "Server Error!";
      console.log(err);
      res.send({ error: err });
      return;
    }
    if (result.length == 0) {
      req.session.error = "No User exists with given emailid";
      res.send({ error: "No user exists!" });
      return;
    }
    if (psw == result[0].password) {
      //get today date and time
      var today = new Date();

      today = today.toISOString();
      //create query to insert into lastlogin table
      const queryString = `insert into loginhistory(uid,lastlogindate) values('${result[0].uid}','${today}')`;
      //execute the query
      connection.query(queryString, (err, result, fields) => {
        //check if errors
        if (err != null) {
          console.error(err);
          //if errors send a message to user that server error exists
          req.session.error = "server error";
          console.log(err);
          res.send({ error: err });
          return;
        }
      });
      console.log("logged in");
      req.session.username = result[0].username;
      req.session.uid = result[0].uid;
      console.log(req.session.uid);
      res.send({ username: result[0].username, uid: result[0].uid });
      return;
    } else {
      console.log("invalid credentials");

      res.send({ error: "Invalid credentials " });
      return;
    }
  });
});

app.post("/adduser", (req, res) => {
  const connection = getNewConnection();

  var email = req.body.email;
  var uname = req.body.uname;
  var psw = req.body.psw;
  if (!authorized_recipients.includes(email)) {
    req.session.addusrmsg =
      "Sorry, Only selected confederation college email ids are allowed to signup!";
    res.send({
      error:
        "Sorry, Only selected confederation college email ids are allowed to signup!",
    });
    return;
  }
  const queryString = `insert into users(email,username,password) values('${email}','${uname}','${psw}')`;

  connection.query(queryString, (err, result, fields) => {
    if (err != null) {
      req.session.addusrmsg = "User Already exists!";
      res.send({
        error: "User Already exists!",
      });

      // Send Code Error to the user.
    } else {
      req.session.username = uname;
      res.send({
        message: "User Has been added!",
      });
    }
  });
});

app.post("/profile", (req, res) => {
  const connection = getNewConnection();
  var uid = req.body.uid;
  const queryString = `select username,email from users  where uid=${uid}`;

  connection.query(queryString, (err, result, fields) => {
    if (err != null) {
      res.send({
        error: "Invalid UID",
      });

      // Send Code Error to the user.
    } else {
      res.send({
        details: result,
      });
    }
  });
});

app.post("/updateuser", (req, res) => {
  const connection = getNewConnection();
  var uid = req.body.uid;
  var email = req.body.email;
  var uname = req.body.uname;
  if (!authorized_recipients.includes(email)) {
    req.session.addusrmsg =
      "Sorry, Only selected confederation college email ids are allowed to signup!";
    res.send({
      error:
        "Sorry, Only selected confederation college email ids are allowed to signup!",
    });
    return;
  }
  const queryString = `update users set email='${email}', username='${uname}' where uid=${uid}`;

  connection.query(queryString, (err, result, fields) => {
    if (err != null) {
      req.session.addusrmsg = "User Already exists!";
      res.send({
        error: "Something Went Wrong",
      });

      // Send Code Error to the user.
    } else {
      req.session.username = uname;
      res.send({
        message: "User Has been Updated!",
      });
    }
  });
});

app.post("/sendforgetemail", (req, res) => {
  const connection = getNewConnection();
  var email = req.body.email;

  const queryString = `select username,email,password from users where email='${email}'`;
  console.log(queryString);
  username = "";
  psw = "";
  flag = 1;
  connection.query(queryString, (err, result, fields) => {
    if (err != null) {
      req.session.forgetmailmsg = "Something went wrong please try again!";
      res.send({ error: "Something went wrong please try again!" });
      flag = 0;
    }
    if (result.length == 0) {
      req.session.forgetmailmsg = "No user exists!";
      res.send({ error: "No user exists!" });
      flag = 0;
    } else {
      username = result[0].username;
      psw = result[0].password;

      const output = `<p>Hi ${username} , your password is <strong> ${psw}</strong></p><a href='http://localhost:3000/login'><strong>Please Login</strong></a>`;
      var data = {
        from: "bookexchangesupport <bookexchangesupport@confed.com>",
        to: email,
        subject: "Book Exchange : Password Recovery",
        html: output,
      };
      mg.messages().send(data, function (error, body) {
        console.log(body);
        console.log("sent");
      });
      res.send({ message: "Recovery Mail has been sent!" });
    }
  });
});

app.listen(4000, () =>
  console.log("Server is running at http://localhost:4000/home")
);
