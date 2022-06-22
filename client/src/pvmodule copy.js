import "./App.css";
import { useState } from "react";
import Axios from "axios";
import styling from 'styled-components';


function PVModule() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [country, setCountry] = useState("");
  const [position, setPosition] = useState("");
  const [wage, setWage] = useState(0);

  const [newWage, setNewWage] = useState(0);

  const [employeeList, setEmployeeList] = useState([]);

  const addEmployee = () => {
    Axios.post("http://localhost:3001/create", {
      name: name,
      age: age,
      country: country,
      position: position,
      wage: wage,
    }).then(() => {
      setEmployeeList([
        ...employeeList,
        {
          name: name,
          age: age,
          country: country,
          position: position,
          wage: wage,
        },
      ]);
      setName([]);
    });
  };

  const getEmployees = () => {
    Axios.get("http://localhost:3001/employees").then((response) => {
      setEmployeeList(response.data);
      console.log(response.headers);
    });
    
  };

  const updateEmployeeWage = (id) => {
    Axios.put("http://localhost:3001/update", { wage: newWage, id: id }).then(
      (response) => {
        setEmployeeList(
          employeeList.map((val) => {
            return val.id == id
              ? {
                  id: val.id,
                  name: val.name,
                  country: val.country,
                  age: val.age,
                  position: val.position,
                  wage: newWage,
                }
              : val;
          })
        );
      }
    );
  };

  const deleteEmployee = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`).then((response) => {
      setEmployeeList(
        employeeList.filter((val) => {
          return val.id != id;
        })
      );
    });
  };

  return (
    <PVModuleWrapper>
      <div className="employees">
        <button onClick={getEmployees}>Show Employees</button>
        <table>
          <tr class="row">
            <th class="col-xs-4">Name:</th>
            {employeeList.map((val, key) => {
            return (<td class="col-xs-4">{val.name}</td>);
            })}
            <td class="col-xs-4">
            <input
              type="text"
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
            </td>
          </tr>
          <tr class="row">
            <th class="col-xs-4">Age:</th>
            {employeeList.map((val, key) => {
            return (<td class="col-xs-4">{val.age}</td>);
            })}
            <td class="col-xs-4">
            <input
              type="text"
              onChange={(event) => {
                setAge(event.target.value);
              }}
            />
            </td>
          </tr>
          <tr class="row">
            <th class="col-xs-4">Country:</th>
            {employeeList.map((val, key) => {
            return (<td class="col-xs-4">{val.country}</td>);
            })}
            <td class="col-xs-4">
            <input
              type="text"
              onChange={(event) => {
                setCountry(event.target.value);
              }}
            />
            </td>
          </tr>
          <tr class="row">
            <th class="col-xs-4">Position:</th>
            {employeeList.map((val, key) => {
            return (<td class="col-xs-4">{val.position}</td>);
            })}
            <td class="col-xs-4">
            <input
              type="text"
              onChange={(event) => {
                setPosition(event.target.value);
              }}
            />
            </td>
          </tr>
          <tr class="row">
            <th class="col-xs-4">Wage:</th>
            {employeeList.map((val, key) => {
            return (<td class="col-xs-4">{val.wage}</td>);
            })}
            <td class="col-xs-4">
            <input
              type="text"
              onChange={(event) => {
                setWage(event.target.value);
              }}
            />
            </td>
          </tr>
          <tr class="row">
            <th class="col-xs-4">Delete/New</th>
            {employeeList.map((val, key) => {
            return (<td class="col-xs-4">
              <button
                onClick={() => {
                  deleteEmployee(val.id);
                }}
              >
                Delete
              </button>
            </td>);
            })}
            <td class="col-xs-4">
              <button onClick={addEmployee}>Add Employee</button>
            </td>
          </tr>
        </table>
        

      </div>
      </PVModuleWrapper>
  );
}

export default PVModule;

const PVModuleWrapper = styling.nav`
    margin-top:4rem;
    overflow:hidden;
    
table, th, td, caption {
      border: thin solid #a0a0a0;
      background-color: #f1f3f4;
}

th, td {
      font-weight: normal;

      width: 5rem;
}
th, caption {
      background-color: #f1f3f4;
      font-weight: 700;
      width: 5rem;
}
input {

  width: 5rem;
}


`;