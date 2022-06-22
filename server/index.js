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

app.post("/create", (req, res) => {
  const hersteller = req.body.hersteller;
  const typ = req.body.typ;
  const maximale_Modulleistung_Wp = req.body.maximale_Modulleistung_Wp;
  const maximale_Modulspannung_Vp = req.body.maximale_Modulspannung_Vp;
  const maximale_Modulstrom_Ap_IMPPSTC = req.body.maximale_Modulstrom_Ap_IMPPSTC;

  db.query(
    "INSERT INTO pvmodule (hersteller, typ, maximale_Modulleistung_Wp, maximale_Modulspannung_Vp, maximale_Modulstrom_Ap_IMPPSTC) VALUES (?,?,?,?,?)",
    [hersteller, typ, maximale_Modulleistung_Wp, maximale_Modulspannung_Vp, maximale_Modulstrom_Ap_IMPPSTC],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

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

app.listen(3001, () => {
  console.log("Yey, your server is running on port 3001");
});
