const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

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

// app.post("/createWithOneParameter", (req, res) => {
//   const key = req.body.key;
//   const value = req.body.value;
//   db.query(
//     "INSERT INTO pvmodule(??) VALUES (?)",
//     [key, value],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.send(result);
//       }
//     }
//   );
// });

app.get("/employees", (req, res) => {
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

app.get("/employeesHeader", (req, res) => {
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

app.listen(3001, () => {
  console.log("Yey, your server is running on port 3001");
});
