import "./App.css";
import { useState } from "react";
import Axios from "axios";
import styling from 'styled-components';
import Modal from 'react-modal';

function PVModule() {
  const [hersteller, sethersteller] = useState("");
  const [typ, setTyp] = useState(0);
  const [maximale_Modulleistung_Wp, setMaximale_Modulleistung_Wp] = useState("");
  const [maximale_Modulspannung_Vp, setMaximale_Modulspannung_Vp] = useState("");
  const [maximale_Modulstrom_Ap_IMPPSTC, setMaximale_Modulstrom_Ap_IMPPSTC] = useState(0);

  const [newWage, setNewWage] = useState(0);

  const [employeeList, setEmployeeList] = useState([]);
  const [employeeHeaderList, setEmployeeHeaderList] = useState([]);

  const [updatePVModulIsOpen, setUpdatePVModulIsOpen] = useState(false);
  const [currentPVModulIsOpen, setCurrentPVModulIsOpen] = useState([]);

  const capitalizeFirstLetter = ([ first, ...rest ], locale = navigator.language) =>
    first.toLocaleUpperCase(locale) + rest.join('')
  
  
  const addEmployee = () => {
    Axios.post("http://localhost:3001/create", {
      hersteller: hersteller,
      typ: typ,
      maximale_Modulleistung_Wp: maximale_Modulleistung_Wp,
      maximale_Modulspannung_Vp: maximale_Modulspannung_Vp,
      maximale_Modulstrom_Ap_IMPPSTC: maximale_Modulstrom_Ap_IMPPSTC,
    }).then(() => {
      setEmployeeList([
        ...employeeList,
        {
          hersteller: hersteller,
          typ: typ,
          maximale_Modulleistung_Wp: maximale_Modulleistung_Wp,
          maximale_Modulspannung_Vp: maximale_Modulspannung_Vp,
          maximale_Modulstrom_Ap_IMPPSTC: maximale_Modulstrom_Ap_IMPPSTC,
        },
      ]);
      sethersteller([]);
    });
  };

  const getEmployees = () => {
    Axios.get("http://localhost:3001/employees").then((response) => {
      setEmployeeList(response.data);

    });
    Axios.get("http://localhost:3001/employeesHeader").then((response) => {
      setEmployeeHeaderList(response.data);

    });
    console.log(hersteller)
    
  };

  // const updateEmployeeWage = (id) => {
  //   Axios.put("http://localhost:3001/update", { wage: newWage, id: id }).then(
  //     (response) => {
  //       setEmployeeList(
  //         employeeList.map((val) => {
  //           return val.id == id
  //             ? {
  //                 id: val.id,
  //                 hersteller: val.hersteller,
  //                 maximale_Modulleistung_Wp: val.maximale_Modulleistung_Wp,
  //                 typ: val.typ,
  //                 position: val.position,
  //                 wage: newWage,
  //               }
  //             : val;
  //         })
  //       );
  //     }
  //   );
  // };

  function openModal(id) {
    setUpdatePVModulIsOpen(true);
    console.log(currentPVModulIsOpen)
    Axios.get("http://localhost:3001/employees").then(
      (response) => {
        setCurrentPVModulIsOpen(
          currentPVModulIsOpen.map((val) => {
            return val.id == id
              ? {
                id: val.id,
                hersteller: hersteller,
                typ: typ,
                maximale_Modulleistung_Wp: maximale_Modulleistung_Wp,
                maximale_Modulspannung_Vp: maximale_Modulspannung_Vp,
                maximale_Modulstrom_Ap_IMPPSTC: maximale_Modulstrom_Ap_IMPPSTC,
              }
              : val;
          })
        );
      })
      console.log(currentPVModulIsOpen)
  }


  function closeModal() {
    setUpdatePVModulIsOpen(false);
  }
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
      {/* <table>
        {employeeHeaderList.slice(1).map((headerval, headerkey) => {

          return (
            <tr class="row">
              <th class="col-xs-4">{capitalizeFirstLetter(headerval.Field)}</th>
              {employeeList.map((value, key) => {
                  return (
                    <td class="col-xs-4">{employeeList[key][(headerval.Field)]}</td>)
              })}
              <td class="col-xs-4">
                <input
                  type="text"
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
              </td>
              
            </tr>)
          
        })}
      </table> */}
      
      <div className="employees">
        
        <button onClick={getEmployees}>Show Employees</button>
        <table>
          <tr class="row">
            <th class="col-xs-4">Hersteller:</th>
            {employeeList.map((val, key) => {
            return (<td class="col-xs-4">{val.hersteller}</td>);
            })}
            <td class="col-xs-4">
            <input
              type="text"
              onChange={(event) => {
                sethersteller(event.target.value);
              }}
            />
            </td>
          </tr>
          <tr class="row">
            <th class="col-xs-4">Typ:</th>
            {employeeList.map((val, key) => {
            return (<td class="col-xs-4">{val.typ}</td>);
            })}
            <td class="col-xs-4">
            <input
              type="text"
              onChange={(event) => {
                setTyp(event.target.value);
              }}
            />
            </td>
          </tr>
          <tr class="row">
            <th class="col-xs-4">Maximale Modulleistung [Wp]:</th>
            {employeeList.map((val, key) => {
            return (<td class="col-xs-4">{val.maximale_Modulleistung_Wp}</td>);
            })}
            <td class="col-xs-4">
            <input
              type="text"
              onChange={(event) => {
                setMaximale_Modulleistung_Wp(event.target.value);
              }}
            />
            </td>
          </tr>
          <tr class="row">
            <th class="col-xs-4">Maximale Modulspannung [Vp]</th>
            {employeeList.map((val, key) => {
            return (<td class="col-xs-4">{val.maximale_Modulspannung_Vp}</td>);
            })}
            <td class="col-xs-4">
            <input
              type="text"
              onChange={(event) => {
                setMaximale_Modulspannung_Vp(event.target.value);
              }}
            />
            </td>
          </tr>
          <tr class="row">
            <th class="col-xs-4">Maximale Modulstrom [Ap]:</th>
            {employeeList.map((val, key) => {
            return (<td class="col-xs-4">{val.maximale_Modulstrom_Ap_IMPPSTC}</td>);
            })}
            <td class="col-xs-4">
            <input
              type="text"
              onChange={(event) => {
                setMaximale_Modulstrom_Ap_IMPPSTC(event.target.value);
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
              <button onClick={addEmployee}>Neues Modul</button>
            </td>
          </tr>
          <tr class="row">
            <th class="col-xs-4">Update</th>
            {employeeList.map((val, key) => {
            return (<td class="col-xs-4">
              <button
                onClick={() => {
                  openModal(val.id)
                }}
              >
                Update
              </button>
            </td>);
            })}
            <td class="col-xs-4">
              <button onClick={addEmployee}>Neues Modul</button>
            </td>
          </tr>
        </table>
        
        <Modal isOpen={updatePVModulIsOpen}>
          
          <button onClick={closeModal}>close</button>
          <div>PV-Modul bearbeiten</div>

          <div>ID: {currentPVModulIsOpen.id}</div>

          <form>
            <input />
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </form>
        </Modal>
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
      width: 14rem;
}
input {

  width: 5rem;
}


`;