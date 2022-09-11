import "./App.css";
import React, { createContext, useEffect, useState} from "react";
import Axios from "axios";



export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [loginStatus, setLoginStatus] = useState(false);
    
    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
            if (response.data.loggedIn === true) {
                setLoginStatus(true)  
            }
        })
    }, [])

    const logout = () => {
        Axios.post("http://localhost:3001/logout")
            .then(
                (response) => {
                    setLoginStatus(false)
                    localStorage.removeItem("token")
                }
            )
    }
  return (
    <AuthContext.Provider value={{loginStatus, setLoginStatus, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

