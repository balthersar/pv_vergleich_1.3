import "../App.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import styling from 'styled-components';
import Modal from 'react-modal';
import ModalParamEdit from "./ModalParamEdit";
import Select from 'react-select';

function PVModule() {
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeHeaderList, setEmployeeHeaderList] = useState([]);

  const [PVModulEditIsOpen, setPVModulEditIsOpen] = useState(false);
  const [ParamEditIsOpen, setParamEditIsOpen] = useState(false);
  
  const [currentPVModulIsOpen, setCurrentPVModulIsOpen] = useState([{ id: 'test' }, { id: 'test' }]);
  const [updateCurrentPVModulIsOpen, setUpdateCurrentPVModulIsOpen] = useState([]);

  //Modal Parameter
    const [updateNewPVModulParameterset, setupdateNewPVModulParameterset] = useState([]);
    const [selectedTypeOption, setSelectedTypeOption] = useState({ value: "bool" });
    const [selectedLengthOption, setSelectedLengthOption] = useState(null);
    const [selectedDecplaceOption, setSelectedDecplaceOption] = useState(null);

    const typeoptions = [
      { value: 'bit', label: 'Boolean' },
      { value: 'varchar', label: 'String' },
      { value: 'dec', label: 'Dezimal' },
      { value: 'int', label: 'Integer' },
    ]; 
    const lengthoptionsNumber = [
      { value: '4', label: '4' },
      { value: '5', label: '5' },
      { value: '8', label: '8' },
      { value: '11', label: '11' },
    ]; 
    const lengthoptionsString = [
      { value: '20', label: '20' },
      { value: '50', label: '50' },
      { value: '100', label: '100' },
      { value: '255', label: '255' },
    ]; 
    const decplacesoptions = [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
    ]; 
  //END Modal Parameter

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
  
  const updateNewPVModulParameter = (event, key) => {
    setupdateNewPVModulParameterset({[key]: event });
  }
  const submitNewPVModulParameter = () => {
    let nameNewParameter = updateNewPVModulParameterset.parameter.replace(/ /g,"_")
    var datatypeNewParameter 
    if (selectedTypeOption.value == "bool") {
      datatypeNewParameter = selectedTypeOption.value
    } else if (selectedTypeOption.value == "dec") {
      datatypeNewParameter = selectedTypeOption.value + "(" + selectedLengthOption.value + "," + selectedDecplaceOption.value + ")"     
    } else {
      datatypeNewParameter = selectedTypeOption.value + "(" + selectedLengthOption.value + ")"
    }


    Axios.put("http://localhost:3001/addColumn", { name: nameNewParameter, type: datatypeNewParameter }).then(
      (response) => {
        setEmployeeHeaderList(employeeHeaderList, { Field: [nameNewParameter], Type: [datatypeNewParameter] })
        getEmployees();
      }
    )
  }

  function openPVModulEdit(key) {
    setPVModulEditIsOpen(true);
    setCurrentPVModulIsOpen(employeeList[key])
    setUpdateCurrentPVModulIsOpen(employeeList[key])
  }

  function closePVModulEdit() {
    setPVModulEditIsOpen(false);
  }

  function openParamEdit() {
    setParamEditIsOpen(true);
  }
  function closeParamEdit() {
    setParamEditIsOpen(false);
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
  const submitdeleteParameter = (parameter) => {
    Axios.delete(`http://localhost:3001/deleteParameter/${parameter}`).then((response) => {
      setEmployeeHeaderList(
        employeeHeaderList.filter((val) => {
          return val.Field != parameter;
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
        {/* <ModalParamEdit ParamEditIsOpen={ParamEditIsOpen}/> */}
        <Modal isOpen={ParamEditIsOpen} ariaHideApp={false} classname="ModalPVModulParamEdit">
          <button onClick={closeParamEdit}>close</button>
          <div>Parameter für PV-Module bearbeiten</div>
          <table>
            <tr >
              <th>Parameter</th>
              <th>Datentyp</th>
              <th>Länge</th>
              <th>Nachkommastellen</th>
            </tr>
            {employeeHeaderList.slice(1).map((headerval, headerkey) => {
              console.log(headerval)
              var matches = regExp.exec(headerval.Type);
              //matches[1] contains the value between the parentheses
              let paramlength = matches[1].split(",")[0]
              let paramdecplaces = matches[1].split(",")[1]
              let paramtype = headerval.Type.split("(")[0]
              switch(paramtype){
                case "varchar":
                    paramtype = "String"
                break;
                case "int":
                    paramtype = "Integer"
                break;
                case "decimal":
                    paramtype = "Dezimal"
                break;
              default:
              }

              return (
                <tr >
                  <td class="col-xs-4">{capitalizeFirstLetter(headerval.Field).replace(/_/g, ' ')}</td>
                  <td class="col-xs-4">{paramtype}</td>
                  <td class="col-xs-4">{paramlength}</td>
                  <td class="col-xs-4">{paramdecplaces}</td>
                  <td>
                  <button onClick={() => {
                        submitdeleteParameter(headerval.Field)
                      }}
                      >Entfernen</button>
                  </td>

                </tr>
              )
            })}
            <tr >
              <td class="col-xs-4">
                Neu: 
                <input type="text"
                  onChange={(event) => {
                    updateNewPVModulParameter(event.target.value, "parameter");
                    }} />
              </td>
              <td class="col-xs-4">
                <Select
                  menuPlacement="auto"
                  defaultValue={typeoptions[0]}
                  onChange={setSelectedTypeOption}
                  options={typeoptions}
                />
              </td>
              <td class="col-xs-4">
                {selectedTypeOption.value == "varchar" ? ( 
                <Select
                    menuPlacement="auto"
                    defaultValue={selectedLengthOption}
                    onChange={setSelectedLengthOption}
                    options={lengthoptionsString}
                  />
                ) : selectedTypeOption.value != "bool" ? (
                <Select
                  menuPlacement="auto"
                  defaultValue={selectedLengthOption}
                  onChange={setSelectedLengthOption}
                  options={lengthoptionsNumber}
                />
                ): null
                } 
              </td>
              
              <td class="col-xs-4" >
                {selectedTypeOption.value=="dec"?( 
                  <Select
                      menuPlacement="auto"
                      defaultValue={selectedDecplaceOption}
                      onChange={setSelectedDecplaceOption}
                      options={decplacesoptions}
                    />
                  ):null
                } 
              </td>
              <button onClick={(event) => {
                  submitNewPVModulParameter()
                      }}
                      >Hinzufügen</button>
            </tr>
            

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