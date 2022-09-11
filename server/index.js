const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

const bcrypt = require("bcrypt");
const saltRounds = 10;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "PUT", "POST", "DELETE"],
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24 * 1000, //Ablauf der Session nach 24h
    },
  })
)

//#region Database for PVModules
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'nutella12345',
    database: 'giraffe',
    
})

app.post("/createWithList", (req, res) => {
  const key = req.body.key;
  const value = req.body.value;
  db.query(
    "INSERT INTO pvmodule(??) VALUES (?)",
    [key, value],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});


app.get("/pvmodules", (req, res) => {
  db.query("SELECT * FROM pvmodule", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/currentdataset/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM pvmodule WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/pvmodulesHeader", (req, res) => {
  db.query("DESCRIBE  pvmodule", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);

    }
  });
});


app.put("/update", (req, res) => {
  const key = req.body.key;
  const value = req.body.value;
  const id = req.body.id;
  db.query(
    "UPDATE pvmodule SET ?? = ? WHERE id = ?",
    [key, value, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.put("/addColumn", (req, res) => {
  const name = req.body.name;
  const type = req.body.type;
  var sql = "ALTER TABLE pvmodule ADD COLUMN " + name + " " + type
  db.query(
    sql,
    [name, type],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.put("/changeColumnName", (req, res) => {
  const oldName = req.body.oldName;
  const newName = req.body.newName;
  const newDatatype = req.body.newDatatype;
  var sql = "ALTER TABLE pvmodule CHANGE " + oldName + " " + newName + " " + newDatatype
  db.query(
    sql,
    [oldName, newName, newDatatype],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM pvmodule WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
app.delete("/deleteParameter/:parameter", (req, res) => {
  const parameter = req.params.parameter;
  db.query("ALTER TABLE pvmodule DROP ??", parameter, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
//#endregion Database for PVModules

//#region Database for Usermanagement
const userdb = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'nutella12345',
  database: 'Usermanagement',
  
})

app.post('/register', (req, res) => { 
  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err)
    }
    userdb.query("INSERT INTO users (username, password) VALUES (?,?)",
    [username, hash],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    })
  })
}
)

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"]
  if (!token) {
    res.send("Wir benötigen ein Token, bitte beim nächsten Mal")
  } else {
    jwt.verify(token, "jwtSecret", (err, decoded) => {
      if (err) {
        res.json({auth:false, message: "Fehler bei der Authentifizierung"})
      } else {
        req.userID = decoded.id;
        next();
      }
    })
  }
}

app.get('/isUserAuth', verifyJWT, (req, res) => {
  res.send("Du bist authentifiziert")
})

app.get('/login', (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user })
  } else {
    res.send({ loggedIn: false })
  }
});
  
  
  
app.post('/login', (req, res) => { 
  const username = req.body.username;
  const password = req.body.password;
  userdb.query("SELECT * FROM users WHERE username = ?;",
    username,
    (err, result) => {
    if (err) {
      res.send({err: err});
    }
    if (result.length>0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          const id = result[0].id
          //jwtSecret ->Private Key -> .env-File/.env-Variable (sicheres passwort in extra Datei gespeichert)
          const token = jwt.sign({ id }, "jwtSecret", {
            expiresIn: 300,
          });
          req.session.user = result;
          res.json({ auth: true, token: token, result: result });
        } else {
          res.json({ auth: false,  result: result , message: "Falscher Benutzername und/oder Passwort"});
        }
      })
    } else {
      res.json({ auth: false,  result: result , message: "Benutzer exisitert nicht"});
    }
      
  })
}
)


app.post('/logout', (req, res) => {
  req.session.destroy();
  res.send("Erfolgreich abgemeldet")
})
//#endregion

app.listen(3001, () => {
  console.log("Yey, your server is running on port 3001");
});
