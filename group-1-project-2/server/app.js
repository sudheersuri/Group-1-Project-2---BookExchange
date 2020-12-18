//import required packages.
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const mailgun = require("mailgun-js");
const mysql = require("mysql2");
const multer = require("multer");
//setup details for mailgun
const DOMAIN = "sandbox97e61f2954d34e089bd93a3510e9c5fa.mailgun.org";
const api_key = "63e5b8e05f853a86285305d137fb29aa-360a0b2c-9b053ba1";
const mg = mailgun({ apiKey: api_key, domain: DOMAIN });
const authorized_recipients = [
  "sudhirsuri43@gmail.com",
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

//instantiate handlebars variable
var handlebars = exphbs.create({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views"),
  partialsDir: path.join(__dirname, "views/partials"),
  helpers: {
    incremented: function (index) {
      index++;
      return index;
    },
    ifEqual: function (a, b, options) {
      return a == b ? options.fn(this) : options.inverse(this);
    },
  },
});

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.use(session({ secret: "sss1234" }));
// Static folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//there is no need of login in below
app.get("/login", (req, res) => {
  if (req.session.error != null)
    // res.render("login",);
    res.send({ msg: req.session.error });
  else res.send({ msg: false });
});

app.post("/search", (req, res) => {
  req.session.searchbooktext = req.body.searchbook;
});

app.get("/home", (req, res) => {
  //get the connection
  let queryString = "";
  var lastloginmsg = "";
  const connection = getNewConnection();
  //write the query to get the last login time by uid
  if (req.session.uid) {
    queryString = `select lastlogindate from loginhistory where uid=${req.session.uid} order by lastlogindate desc`;
    //execute the query
    connection.query(queryString, (err, result, fields) => {
      if (err != null) {
        console.error(err);
      }
      if (result.length == 1) {
        req.session.lastloginmsg = "Welcome to BookExchange";
        //if there is only 1 row , store - welcome to BookExchange in lastloginmsg variable.
      } else if (result.length > 1) {
        //if there is more than 1 row , get the last login date store it in lastloginmsg variable
        req.session.lastloginmsg =
          "Last loggedin at " + result[0].lastlogindate.split("T")[0] + " ISO";
      }
    });
  } else req.session.lastloginmsg = "Welcome to BookExchange";

  queryString = `select * from genres`;
  //execute the query

  connection.query(queryString, (err, result, fields) => {
    let genrelist = "";
    let genreid = "";
    //check if errors
    if (err != null) {
      req.session.errmsg = "Something went wrong, please try again later!";
    } else {
      genrelist = result;
    }
    genreid = result[0].genreid;
    queryString = `select userbooks.bookimgurlone,users.username,userbooks.bookname,userbooks.bookdesc,userbooks.bookimgurlone,userbooks.bookposteddate from users join userbooks on users.uid=userbooks.uid where userbooks.genreid=${genreid}`;
    connection.query(queryString, (err, result, fields) => {
      //check if errors
      if (err != null) {
        req.session.errmsg = "Something went wrong, please try again later!";
        res.render("home", {
          layout: false,
          selectedgenre: genreid,
          searchbooktext: req.session.searchbooktext,
          username: req.session.username,
          genrelist: genrelist,
          errmsg: req.session.errmsg,
          lastloginmsg: req.session.lastloginmsg,
        });
      } else {
        res.render("home", {
          layout: false,
          selectedgenre: genreid,
          searchbooktext: req.session.searchbooktext,
          bookslist: result,
          username: req.session.username,
          genrelist: genrelist,
          errmsg: req.session.errmsg,
          lastloginmsg: req.session.lastloginmsg,
        });
      }
    });
  });
});

app.post("/home", (req, res) => {
  //get the connection
  let queryString = "";
  var lastloginmsg = "";
  req.session.searchbooktext = req.body.searchbook;
  const connection = getNewConnection();
  //write the query to get the last login time by uid
  if (req.session.uid) {
    queryString = `select lastlogindate from loginhistory where uid=${req.session.uid} order by lastlogindate desc`;
    //execute the query
    connection.query(queryString, (err, result, fields) => {
      if (err != null) {
        console.error(err);
      }
      if (result.length == 1) {
        req.session.lastloginmsg = "Welcome to BookExchange";
        //if there is only 1 row , store - welcome to BookExchange in lastloginmsg variable.
      } else if (result.length > 1) {
        //if there is more than 1 row , get the last login date store it in lastloginmsg variable
        req.session.lastloginmsg =
          "Last loggedin at " + result[0].lastlogindate.split("T")[0] + " ISO";
      }
    });
  } else req.session.lastloginmsg = "Welcome to BookExchange";

  queryString = `select * from genres`;
  //execute the query
  connection.query(queryString, (err, result, fields) => {
    var genrelist = "";
    //check if errors
    if (err != null) {
      req.session.errmsg = "Something went wrong, please try again later!";
    } else {
      genrelist = result;
    }
    if (req.body.searchbook != "")
      queryString = `select userbooks.bookimgurlone,users.username,userbooks.bookname,userbooks.bookdesc,userbooks.bookimgurlone,userbooks.bookposteddate from users join userbooks on users.uid=userbooks.uid where userbooks.bookname like '%${req.body.searchbook}%' and userbooks.genreid=${req.body.genreid}`;
    else
      queryString = `select userbooks.bookimgurlone,users.username,userbooks.bookname,userbooks.bookdesc,userbooks.bookimgurlone,userbooks.bookposteddate from users join userbooks on users.uid=userbooks.uid where userbooks.genreid=${req.body.genreid}`;
    connection.query(queryString, (err, result, fields) => {
      //check if errors
      if (err != null) {
        req.session.errmsg = "Something went wrong, please try again later!";
        res.render("home", {
          layout: false,
          selectedgenre: req.body.genreid,
          searchbooktext: req.session.searchbooktext,
          username: req.session.username,
          genrelist: genrelist,
          errmsg: req.session.errmsg,
          lastloginmsg: req.session.lastloginmsg,
        });
      } else {
        res.render("home", {
          layout: false,
          selectedgenre: req.body.genreid,
          searchbooktext: req.session.searchbooktext,
          bookslist: result,
          username: req.session.username,
          genrelist: genrelist,
          errmsg: req.session.errmsg,
          lastloginmsg: req.session.lastloginmsg,
        });
      }
    });
  });
});
app.get("/documentation", (req, res) => {
  res.send({
    username: req.session.username,
    lastloginmsg: req.session.lastloginmsg,
    name: "sudheer",
  });
});
app.get("/genres", (req, res) => {
  const connection = getNewConnection();
  queryString = `select genres.genreid,genres.genredesc,avg(rating) as rating from genrerating join genres on genres.genreid=genrerating.genreid group by genres.genreid`;

  //execute the query
  connection.query(queryString, (err, result, fields) => {
    //check if errors
    if (err != null) {
      res.render("genres", {
        layout: false,
        errmsg: "Something went wrong!",
        username: req.session.username,
        lastloginmsg: req.session.lastloginmsg,
      });
    } else {
      var publicobj = result;

      if (!req.session.uid)
        res.render("genres", {
          layout: false,
          errmsg: "",
          username: req.session.username,
          allratings: publicobj,
          lastloginmsg: req.session.lastloginmsg,
        });
      else {
        queryString = `select genres.genredesc,rating as rating,genres.genreid from genrerating join genres on genres.genreid=genrerating.genreid where genrerating.uid=${req.session.uid} group by genres.genreid`;
        connection.query(queryString, (err, result, fields) => {
          //check if errors
          if (err != null) {
            res.render("genres", {
              layout: false,
              errmsg: "Something went wrong!",
              username: req.session.username,
              lastloginmsg: req.session.lastloginmsg,
            });
          } else {
            var userratingobj = result;
            if (userratingobj.length == 0) {
              //send userrating as null if there is no userrating.
              publicobj[0].userrating = "";
              res.render("genres", {
                layout: false,
                errmsg: "",
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
                res.render("genres", {
                  layout: false,
                  errmsg: "Something went wrong!",
                  genrelist: result,
                  allratings: publicobj,
                  username: req.session.username,
                  lastloginmsg: req.session.lastloginmsg,
                });
              } else {
                res.render("genres", {
                  layout: false,
                  errmsg: "",
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

app.post("/genres", (req, res) => {
  var genreid = req.body.genreid;
  var rating = req.body.userrating;
  var queryString = "";
  const connection = getNewConnection();
  console.log(genreid + "" + rating);
  queryString = `select * from genrerating where uid=${req.session.uid} and genreid=${genreid}`;
  connection.query(queryString, (err, result, fields) => {
    //check if errors
    console.log(result);
    if (err != null) {
      console.log(err);
      res.render("genres", {
        layout: false,
        errmsg: "Something went wrong",
        username: req.session.username,
        errmsg: "Something went wrong!",
        lastloginmsg: req.session.lastloginmsg,
      });
      return;
    } else {
      if (result.length == 0) {
        queryString = `insert into genrerating(uid,genreid,rating) values(${req.session.uid},${genreid},${rating})`;
      } else {
        queryString = `update genrerating set rating=${rating} where uid=${req.session.uid} and genreid=${genreid}`;
      }
    }
    connection.query(queryString, (err, result, fields) => {
      //check if errors
      if (err != null)
        res.render("genres", {
          layout: false,
          username: req.session.username,
          errmsg: "Something went wrong!",
          lastloginmsg: req.session.lastloginmsg,
        });
      else {
        res.redirect("/genres");
      }
    });
  });
});
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

app.get("/uploadbook", (req, res) => {
  const connection = getNewConnection();
  const queryString = `select * from genres`;
  //execute the query
  connection.query(queryString, (err, result, fields) => {
    //check if errors
    if (err != null) {
      res.render("uploadbook", {
        layout: false,
        errmsg: err,
        username: req.session.username,
        lastloginmsg: req.session.lastloginmsg,
      });
    } else {
      res.render("uploadbook", {
        layout: false,
        genrelist: result,
        msg: req.session.uploadmsg,
        username: req.session.username,
        lastloginmsg: req.session.lastloginmsg,
      });
    }
  });
});
app.post("/uploadbook", upload.single("myfile"), (req, res) => {
  fileextensions = [".jpg", ".jpeg", ".png"];
  if (
    !fileextensions.includes(path.extname(req.file.originalname).toLowerCase())
  ) {
    req.session.uploadmsg = "Only Images are accepted!";
    res.redirect("/uploadbook");
    return;
  }
  currdate = new Date();
  currdate = currdate.toISOString().replace("T", " ");
  imgpath =
    req.protocol +
    `://` +
    req.hostname +
    ":4000/" +
    req.file.path.replace(/\\/g, "/");
  const connection = getNewConnection();
  const queryString = `insert into userbooks(uid,bookid,bookname,bookdesc,bookimgurlone,genreid,bookposteddate) values(${
    req.session.uid
  },concat(uid,${Date.now()}),'${req.body.bookname}','${
    req.body.bookdesc
  }','${imgpath}',${req.body.genreid},'${currdate}')`;
  //execute the query
  console.log(queryString);
  connection.query(queryString, (err, result, fields) => {
    //check if errors
    if (err != null) {
      console.log(err);
      req.session.uploadmsg = "Something went wrong, Please try again later!";
      res.redirect("/uploadbook");
    } else {
      console.log("Book Added");
      req.session.uploadmsg = "Book Added!";
      res.redirect("/uploadbook");
    }
  });
});

app.get("/loginhistory", (req, res) => {
  //get connection
  const connection = getNewConnection();
  //write query to get date from loginhistory table
  const queryString = `select lastlogindate from loginhistory where uid=${req.session.uid}`;
  //execute the query
  connection.query(queryString, (err, result, fields) => {
    //check if errors
    if (err != null) {
      console.error(err);
      //if errors send a message to user that server error exists
      res.render("loginhistory", {
        layout: false,
        errmsg: "Something went wrong, please try again later!",
        lastloginmsg: req.session.lastloginmsg,
        username: req.session.username,
      });
    } else {
      //if no err exists send data
      res.render("loginhistory", {
        layout: false,
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
    res.redirect("/signup");
    return;
  }
  const queryString = `insert into users(email,username,password) values('${email}','${uname}','${psw}')`;

  connection.query(queryString, (err, result, fields) => {
    if (err != null) {
      req.session.addusrmsg = "User Already exists!";
      res.redirect("/signup");

      // Send Code Error to the user.
    } else {
      req.session.username = uname;
      res.redirect("/home");
    }
  });
});
app.get("/signup", (req, res) => {
  res.render("signup", { layout: false, msg: req.session.addusrmsg });
});

app.get("/forget", (req, res) => {
  res.render("forget", { layout: false, msg: req.session.forgetmailmsg });
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

      flag = 0;
    }
    if (result.length == 0) {
      req.session.forgetmailmsg = "No user exists!";
      res.redirect("/forget");
      flag = 0;
    } else {
      username = result[0].username;
      psw = result[0].password;

      const output = `<p>Hi ${username} , your password is <strong> ${psw}</strong></p><a href='http://localhost:4000/login'><strong>Please Login</strong></a>`;
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
      req.session.forgetmailmsg = "Recovery Mail has been sent!";
      res.redirect("/forget");
    }
  });
});

app.listen(4000, () =>
  console.log("Server is running at http://localhost:4000/home")
);
