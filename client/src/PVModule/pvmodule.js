import "../App.css";
import { useState, useEffect} from "react";
import Axios from "axios";
import styling from 'styled-components';
import Modal from 'react-modal';
import ModalParamEdit from "./ModalParamEdit";


function PVModule() {
// #region useState / Var-Definitions
  const [pvmoduleList, setpvmoduleList] = useState([]);
  const [pvmoduleHeaderList, setpvmoduleHeaderList] = useState([]);

  const [PVModulEditIsOpen, setPVModulEditIsOpen] = useState(false);
 
  const [currentPVModulIsOpen, setCurrentPVModulIsOpen] = useState([{ id: 'test' }, { id: 'test' }]);
  const [updateCurrentPVModulIsOpen, setUpdateCurrentPVModulIsOpen] = useState([]);

  const [addPVModulObjectList, setAddPVModulObjectList] = useState([]);

  const regExp = /\(([^)]+)\)/;
// #endregion END useState / Var-Definitions

// #region FUNCTIONS:
    //open table on Load page first time
    useEffect(() => {
      getpvmodules();
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
        setpvmoduleList([
          ...pvmoduleList,
          addPVModulObjectList,
        ]);
        getpvmodules()
      });


    };
    const getpvmodules = () => {
      Axios.get("http://localhost:3001/pvmodules").then((response) => {
        setpvmoduleList(response.data);

      });
      Axios.get("http://localhost:3001/pvmodulesHeader").then((response) => {
        setpvmoduleHeaderList(response.data);

      });
    };
    
    const updateCurrentPVModul = (event, index, key) => {
      setUpdateCurrentPVModulIsOpen({ ...updateCurrentPVModulIsOpen, [key]: event });
    }
    const submitUpdateCurrentPVModule = (key, index, id) => {
      Axios.put("http://localhost:3001/update", { id: id, key: key, value: Object.entries(updateCurrentPVModulIsOpen)[index][1] }).then(
        (response) => {
          setCurrentPVModulIsOpen({ ...currentPVModulIsOpen, [key]: Object.entries(updateCurrentPVModulIsOpen)[index][1] })
          getpvmodules();

        }
      )
    }
    // Modal Parameter Edit
    const [ParamEditIsOpen, setParamEditIsOpen] = useState(false);

    function openParamEdit() {
      setParamEditIsOpen(true);
    }
    function closeParamEdit() {
      setParamEditIsOpen(false);
    }
  //END Modal Parameter Edit
    
    // Modal PVModul Edit
    function openPVModulEdit(key) {
      setPVModulEditIsOpen(true);
      setCurrentPVModulIsOpen(pvmoduleList[key])
      setUpdateCurrentPVModulIsOpen(pvmoduleList[key])
    }

    function closePVModulEdit() {
      setPVModulEditIsOpen(false);
    }

    const deletepvmodule = (id) => {
      Axios.delete(`http://localhost:3001/delete/${id}`).then((response) => {
        setpvmoduleList(
          pvmoduleList.filter((val) => {
            return val.id !== id;
          })
        );
      });
    };
  // End Modal PVModul Edit

// #endregion END FUNCTIONS:
  
  return (
    <PVModuleWrapper>
      
      <table>
        {pvmoduleHeaderList.slice(1).map((headerval, headerkey) => {

          return (
            <tr class="row">
              <th class="col-xs-4">{capitalizeFirstLetter(headerval.Field).replace(/_/g, ' ')}</th>
              {pvmoduleList.map((value, key) => {
                  return (
                    <td class="col-xs-4">{pvmoduleList[key][(headerval.Field)]}</td>)
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
            {pvmoduleList.map((val, key) => {
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
      
      <div className="pvmodules">
        
        {/* <button onClick={getpvmodules}>Show pvmodules</button> */}
        
        
        <Modal  isOpen={PVModulEditIsOpen} ariaHideApp={false} classname="ModalPVModulEdit">
          
          <button onClick={closePVModulEdit}>close</button>
          <button onClick={() => {
            deletepvmodule(currentPVModulIsOpen.id);
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
          pvmoduleHeaderList={pvmoduleHeaderList}
          regExp={regExp}
          setpvmoduleHeaderList={setpvmoduleHeaderList}
          getpvmodules={getpvmodules}
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