import React from "react";
import { useState, useEffect, useCallback } from "react";
import Modal from 'react-modal';
import Axios from "axios";
import Select from 'react-select';

export default function ModalParamEdit(props) {

  const { ParamEditIsOpen,
    closeParamEdit,
    pvmoduleHeaderList,
    regExp,
    setpvmoduleHeaderList,
    getpvmodules,
    capitalizeFirstLetter} = props

  //Modal Parameter
    const [updateNewPVModulParameterset, setupdateNewPVModulParameterset] = useState([]);
    const [updateEditPVModulParameterset, setupdateEditPVModulParameterset] = useState([]);
    const [selectedTypeOption, setSelectedTypeOption] = useState({ value: "tinyint" });
    const [selectedLengthOption, setSelectedLengthOption] = useState(null);
    const [selectedDecplaceOption, setSelectedDecplaceOption] = useState(null);
    const [selectedEditTypeOption, setSelectedEditTypeOption] = useState({ value: "bool" });
    const [selectedEditLengthOption, setSelectedEditLengthOption] = useState(null);
    const [selectedEditDecplaceOption, setSelectedEditDecplaceOption] = useState(null);
    const [selectedChangeParameter, setSelectedChangeParameter] = useState(null);
  
    const typeoptions = [
      { value: 'tinyint', label: 'Boolean' },
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
      { value: '10', label: '10' },
    ]; 
  //END Modal Parameter

  //Functions:
  const updateNewPVModulParameter = (event, key) => {
    setupdateNewPVModulParameterset({[key]: event });
  }
  const submitNewPVModulParameter = () => {
    let nameNewParameter = updateNewPVModulParameterset.parameter.replace(/ /g,"_")
    var datatypeNewParameter 
    if (selectedTypeOption.value == "tinyint") {
      datatypeNewParameter = selectedTypeOption.value
    } else if (selectedTypeOption.value == "dec") {
      datatypeNewParameter = selectedTypeOption.value + "(" + selectedLengthOption.value + "," + selectedDecplaceOption.value + ")"     
    } else {
      datatypeNewParameter = selectedTypeOption.value + "(" + selectedLengthOption.value + ")"
    }

    Axios.put("http://localhost:3001/addColumn", { name: nameNewParameter, type: datatypeNewParameter }).then(
      (response) => {
        setpvmoduleHeaderList(pvmoduleHeaderList, { Field: [nameNewParameter], Type: [datatypeNewParameter] })
        getpvmodules();
      }
    )
    
  }
  const updateEditPVModulParameter = (event, key) => {
    setupdateEditPVModulParameterset({[key]: event });
  }
  const submitEditPVModulParameter = (currentName, type, length, decplaces) => {
    let nameNewParameter = updateEditPVModulParameterset.parameter.replace(/ /g, "_")

    var datatypeNewParameter
    if (selectedEditTypeOption.value == "tinyint") {
      datatypeNewParameter = selectedEditTypeOption.value
    } else if (selectedEditTypeOption.value == "dec") {
      datatypeNewParameter = selectedEditTypeOption.value + "(" + selectedEditLengthOption.value + "," + selectedEditDecplaceOption.value + ")"
    } else {
      datatypeNewParameter = selectedEditTypeOption.value + "(" + selectedEditLengthOption.value + ")"
    }
    if ((currentName !== updateEditPVModulParameterset.parameter)
      || (type !== selectedEditTypeOption.label)
      || (length !== selectedEditLengthOption.value && selectedEditLengthOption.value !== undefined)
      || (decplaces !== selectedEditDecplaceOption.value && selectedEditDecplaceOption.value !== undefined)
    )
    {
      Axios.put("http://localhost:3001/changeColumnName", { oldName: currentName, newName: nameNewParameter, newDatatype: datatypeNewParameter}).then(
        (response) => {
          ;
          //setpvmoduleHeaderList(pvmoduleHeaderList, { Field: [nameNewParameter], Type: [datatypeNewParameter] })
          getpvmodules();
        }
      )
    } else {
      ;
    }
  }
  const submitdeleteParameter = (parameter) => {
    Axios.delete(`http://localhost:3001/deleteParameter/${parameter}`).then((response) => {
      setpvmoduleHeaderList(
        pvmoduleHeaderList.filter((val) => {
          return val.Field != parameter;
        })
      );
    });
  };

  //END Functions
  return (
    <Modal isOpen={ParamEditIsOpen} ariaHideApp={false}  classname="ModalPVModulParamEdit">
          <button onClick={closeParamEdit}>close</button>
          <div>Parameter für PV-Module bearbeiten</div>
          <table>
            <tr >
              <th>Parameter</th>
              <th>Datentyp</th>
              <th>Länge</th>
              <th>Nachkommastellen</th>
            </tr>
           
            {pvmoduleHeaderList.slice(1).map((headerval, headerkey) => {
              var matches = regExp.exec(headerval.Type);
              //matches[1] contains the value between the parentheses
              let paramlength = matches[1].split(",")[0]
              let paramdecplaces = matches[1].split(",")[1]
              let paramtypeSQL = headerval.Type.split("(")[0]
              if (paramtypeSQL == "decimal") {
                paramtypeSQL = "dec";
              }
              let paramtype = headerval.Type.split("(")[0]
              switch (paramtype) {
                case "tinyint":
                  paramtype = "Boolean"
              break;
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
              if (headerval.Field == selectedChangeParameter) {
                return (
                  <tr >
                    <td class="col-xs-4">
                      {capitalizeFirstLetter(headerval.Field).replace(/_/g, ' ')}
                      <div className="display-linebreak"> 
                        <input type="text" placeholder={capitalizeFirstLetter(headerval.Field).replace(/_/g, ' ')}
                          onChange={(event) => {
                          updateEditPVModulParameter(event.target.value, "parameter");
                          }}
                        />
                      </div>
                    </td>
                    <td class="col-xs-4">
                      {paramtype}
                      <Select
                        defaultValue={{ value: paramtypeSQL, label: paramtype }}
                        menuPlacement="auto"
                        onChange={setSelectedEditTypeOption}
                        options={typeoptions}
                      />
                    </td>
                    <td class="col-xs-4">
                      {paramlength}
                      {selectedEditTypeOption.value == "varchar" ? ( 
                        <Select
                            menuPlacement="auto"
                            defaultValue={{ value: paramlength, label: paramlength }}
                            onChange={setSelectedEditLengthOption}
                            options={lengthoptionsString}
                          />
                        ) : selectedEditTypeOption.value !== "tinyint" ? (
                        <Select
                          menuPlacement="auto"
                          defaultValue={{ value: paramlength, label: paramlength }}
                          onChange={setSelectedEditLengthOption}
                          options={lengthoptionsNumber}
                        />
                        ): null
                      }
                    </td>
                    <td class="col-xs-4">
                      {paramdecplaces}
                      {selectedEditTypeOption.value == "dec" ? ( 
                        <Select
                            menuPlacement="auto"
                            defaultValue={{ value: paramdecplaces, label: paramdecplaces }}
                            onChange={setSelectedEditDecplaceOption}
                            options={decplacesoptions}
                          />
                        ):null
                      }
                    </td>
                    <td>
                      <button onClick={() => {
                            submitEditPVModulParameter(headerval.Field,paramtype,paramlength,paramdecplaces )
                          }}
                          >Ersetzen</button>
                    </td>
                    <td>
                      <button onClick={() => {
                            setSelectedChangeParameter(null)
                          }}
                          >Abbrechen</button>
                    </td>
                </tr> )
              }else{
                return (
                  <tr >
                      <td class="col-xs-4">{capitalizeFirstLetter(headerval.Field).replace(/_/g, ' ')}</td>
                      <td class="col-xs-4">{paramtype}</td>
                      <td class="col-xs-4">{paramlength}</td>
                      <td class="col-xs-4">{paramdecplaces}</td>
                      <td>
                        <button onClick={() => {
                        setSelectedChangeParameter(headerval.Field)
                        updateEditPVModulParameter(headerval.Field, "parameter")
                        setSelectedEditTypeOption({ value: paramtypeSQL, label: paramtype })
                        setSelectedEditLengthOption({ value: paramlength, label: paramlength })
                        setSelectedEditDecplaceOption({ value: paramdecplaces, label: paramdecplaces })
                            }}
                            >Ändern</button>
                      </td>
                      <td>
                        <button onClick={() => {
                              submitdeleteParameter(headerval.Field)
                            }}
                            >Entfernen</button>
                      </td>
                    </tr> 
                )  
              } //if (headerval.Field == "typ")
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
                ) : selectedTypeOption.value != "tinyint" ? (
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
              <td class="col-xs-4" ></td>
              <button onClick={(event) => {
                submitNewPVModulParameter()
                updateNewPVModulParameter(" ", "parameter")
                      }}
                      >Hinzufügen</button>
            </tr>
            

          </table>
    </Modal>
  );
}