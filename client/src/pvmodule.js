import "./App.css";
import { useState, useEffect } from "react";
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

  const [ModalIsOpen, setModalIsOpen] = useState(false);
  const [currentPVModulIsOpen, setCurrentPVModulIsOpen] = useState([{ id: 'test' }, { id: 'test' }]);
  const [updateCurrentPVModulIsOpen, setUpdateCurrentPVModulIsOpen] = useState([]);


  const capitalizeFirstLetter = ([ first, ...rest ], locale = navigator.language) =>
    first.toLocaleUpperCase(locale) + rest.join('')
  
  
  const addPVModul = () => {
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

    
  };
  const updateCurrentPVModul = (event, index, key) => {
    setUpdateCurrentPVModulIsOpen({ ...updateCurrentPVModulIsOpen, [key]: event });

  }
  const submitUpdateCurrentPVModule = (key, index, id) => {
    Axios.put("http://localhost:3001/update", { id: id, key: key, value: Object.entries(updateCurrentPVModulIsOpen)[index][1] }).then(
      (response) => {
        setCurrentPVModulIsOpen({ ...currentPVModulIsOpen, [key]: Object.entries(updateCurrentPVModulIsOpen)[index][1] })
        getEmployees();

      }
    )
  }
  

  function openModal(key) {
    setModalIsOpen(true);
    setCurrentPVModulIsOpen(employeeList[key])
    setUpdateCurrentPVModulIsOpen(employeeList[key])
  }

  function closeModal() {
    setModalIsOpen(false);
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

  //open table on Load page first time
  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <PVModuleWrapper>
      
      <table>
        {employeeHeaderList.slice(1).map((headerval, headerkey) => {

          return (
            <tr class="row">
              <th class="col-xs-4">{capitalizeFirstLetter(headerval.Field)}</th>
              {employeeList.map((value, key) => {
                  return (
                    <td class="col-xs-4">{employeeList[key][(headerval.Field)]}</td>)
              })}
              <td><input type="text"/></td>

              
            </tr>)
          
        })}
        <tr class="row">
            <th class="col-xs-4">Bearbeiten</th>
            {employeeList.map((val, key) => {
            return (<td class="col-xs-4">
              <button
                onClick={() => {
                  openModal(key)
                }}
              >
                Bearbeiten
              </button>
            </td>);
            })}
            <td class="col-xs-4">
              <button onClick={addPVModul}>Neues Modul</button>
            </td>
          </tr>
      </table> 
      
      <div className="employees">
        
        <button onClick={getEmployees}>Show Employees</button>
        
        
        <Modal isOpen={ModalIsOpen} ariaHideApp={false}>
          
          <button onClick={closeModal}>close</button>
          <div>PV-Modul bearbeiten</div>
          <table>
            <tr >
              <th>Parameter</th>
              <th>Aktuell</th>
              <th>Neu</th>
            </tr>
  
            {Object.keys(currentPVModulIsOpen).map((key, index) => {
              if (index>=1){
              return (
                  <tr>
                    <td>
                      {capitalizeFirstLetter(Object.entries(currentPVModulIsOpen)[index][0])}
                    </td>
                    <td>
                      {Object.entries(currentPVModulIsOpen)[index][1]}
                    </td>
                    <td>
                      <input type="text"
                        onChange={(event) => {
                          updateCurrentPVModul(event.target.value, index, key);
                        }}/>
                    </td>
                    <td>
                      <button onClick={() => {
                        submitUpdateCurrentPVModule(key, index, currentPVModulIsOpen.id)
                      }}
                      >Ändern</button>
                    </td> 
                  </tr>
                );
              }})}
              

            

          </table>


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

td {
      font-weight: normal;

      width: 7rem;
}
th {
      background-color: #f1f3f4;
      font-weight: 700;
      width: 20rem;
}
input {

  width: 5rem;
}


`;