import "../App.css";
import { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import styling from 'styled-components';
import Modal from 'react-modal';
import ModalParamEdit from "./ModalParamEdit";
import Select from 'react-select';

function PVModule() {
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeHeaderList, setEmployeeHeaderList] = useState([]);

  const [PVModulEditIsOpen, setPVModulEditIsOpen] = useState(false);
 
  
  const [currentPVModulIsOpen, setCurrentPVModulIsOpen] = useState([{ id: 'test' }, { id: 'test' }]);
  const [updateCurrentPVModulIsOpen, setUpdateCurrentPVModulIsOpen] = useState([]);




  const [addPVModulObjectList, setAddPVModulObjectList] = useState([]);
  const [addPVModulHeaderList, setAddPVModulHeaderList] = useState([]);
  const [addPVModulValueList, setAddPVModulValueList] = useState([]);

  const [employeeHeaderListToList, setEmployeeHeaderListToList] = useState([]);
  //const [employeeHeaderListToList, setEmployeeHeaderListToList] = useState([]);
  const [newID, setNewID] = useState();
  let response
  var regExp = /\(([^)]+)\)/;

  //open table on Load page first time
  useEffect(() => {
    getEmployees();
  }, []);

  const capitalizeFirstLetter = ([ first, ...rest ], locale = navigator.language) =>
    first.toLocaleUpperCase(locale) + rest.join('')
  

  const addPVModul = (event, value, key) => {
    setAddPVModulObjectList({ ...addPVModulObjectList, [value.Field]: event });
  };

  
  const submitAddPVModul = () => {
    var keys = Object.keys(addPVModulObjectList);
    var values = Object.values(addPVModulObjectList)
    Axios.post("http://localhost:3001/createWithList", {
      key: keys,
      value: values
    }).then(() => {
      setEmployeeList([
        ...employeeList,
        addPVModulObjectList,
      ]);
      getEmployees()
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
  // Modal Parameter
  const [ParamEditIsOpen, setParamEditIsOpen] = useState(false);

  function openParamEdit() {
    setParamEditIsOpen(true);
  }
  function closeParamEdit() {
    setParamEditIsOpen(false);
  }
  
 //END Modal Parameter
  
  // Modal PVModul
  function openPVModulEdit(key) {
    setPVModulEditIsOpen(true);
    setCurrentPVModulIsOpen(employeeList[key])
    setUpdateCurrentPVModulIsOpen(employeeList[key])
  }

  function closePVModulEdit() {
    setPVModulEditIsOpen(false);
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
      
      <table>
        {employeeHeaderList.slice(1).map((headerval, headerkey) => {

          return (
            <tr class="row">
              <th class="col-xs-4">{capitalizeFirstLetter(headerval.Field).replace(/_/g, ' ')}</th>
              {employeeList.map((value, key) => {
                  return (
                    <td class="col-xs-4">{employeeList[key][(headerval.Field)]}</td>)
              })}
              <td>
                <input type="text"
                  onChange={(event) => {
                    addPVModul(event.target.value, headerval, headerkey);
                  }}
                />
              </td>

              
            </tr>)
          
        })}
        <tr class="row">
            <th class="col-xs-4"> <button
              onClick={() => {
                openParamEdit()
            }}
              >
                Parameter Bearbeiten
              </button></th>
            {employeeList.map((val, key) => {
            return (<td class="col-xs-4">
              <button
                onClick={() => {
                  openPVModulEdit(key)
                }}
              >
                Bearbeiten
              </button>
            </td>);
            })}
            <td class="col-xs-4">
              <button onClick={submitAddPVModul}>Neues Modul</button>
            </td>
          </tr>
      </table> 
      
      <div className="employees">
        
        {/* <button onClick={getEmployees}>Show Employees</button> */}
        
        
        <Modal  isOpen={PVModulEditIsOpen} ariaHideApp={false} classname="ModalPVModulEdit">
          
          <button onClick={closePVModulEdit}>close</button>
          <button onClick={() => {
            deleteEmployee(currentPVModulIsOpen.id);
              closePVModulEdit();
                }}>PV-Modul löschen</button>
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

        <ModalParamEdit
          ParamEditIsOpen={ParamEditIsOpen}
          closeParamEdit={closeParamEdit}
          employeeHeaderList={employeeHeaderList}
          regExp={regExp}
          setEmployeeHeaderList={setEmployeeHeaderList}
          getEmployees={getEmployees}
          capitalizeFirstLetter={capitalizeFirstLetter}
        />

      </div>
    </PVModuleWrapper>

  );
}

export default PVModule;

const PVModuleWrapper = styling.nav`
    margin-top:4rem;
    overflow:hidden;
table{
  border-collapse: collapse;
  border: 1px solid black;
  text-align: center;
	vertical-align: middle;
  margin-left: 2rem;
}
table, th, td {

      background-color: #f1f3f4;
}
th, td{
  
  padding: 8px;
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