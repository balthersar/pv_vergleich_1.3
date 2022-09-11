import "../App.css";
import React, {useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import styling from 'styled-components';
import Axios from "axios";
import { AuthContext, AuthContextProvider } from "../authContext";

function Login() {
    const [userNameReg, setUserNameReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { loginStatus, setLoginStatus, logout } = useContext(AuthContext);

    Axios.defaults.withCredentials = true;

    const register = () => {
        Axios.post("http://localhost:3001/register",
            {username: userNameReg, password: passwordReg}).then(
                (response) => {
                    setUserNameReg('')
                    setPasswordReg('')
            })
    }
    const login = () => {
        Axios.post("http://localhost:3001/login",
            {username: username, password: password}).then(
                (response) => {
                    if (!response.data.auth) {
                        setLoginStatus(false)
                    }
                    else {
                        setLoginStatus(true);
                        localStorage.setItem("token", response.data.token)
                    }
            })
    }


    const userAuthenticated = () => {
        Axios.get("http://localhost:3001/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token"),
             }},
        ).then((response) => {
            console.log(response)
        })
    }

    return (
    <LoginWrapper>
        {!loginStatus ? (
                <div>
                    <div className="registration" >
                        <h1 >Registrierung</h1>
                        <label > Username</label>
                        <input
                            type="text"
                            placeholder="Benutzername..."
                            onChange={(event) => {
                                setUserNameReg(event.target.value);
                            }}
                        />
                        <label> Passwort </label>
                        <input
                            type="password"
                            placeholder="Passwort..."
                            onChange={(event) => {
                                setPasswordReg(event.target.value);
                            }}
                        />
                        <button onClick={register}>Register</button>
                    </div>
                    <div className="login">
                        <h1>Login</h1>
                        <input
                            type="text"
                            placeholder="Username..."
                            onChange={(event) => {
                                setUsername(event.target.value);
                            }}/>
                        <input
                            type="password"
                            placeholder="Passwort..."
                            onChange={(event) => {
                                setPassword(event.target.value);
                            }}/>

                            <button onClick={login}>Login</button>

                    </div>
                </div>
        ) : (
            <div className="loginstatus">
                <h2>Angemeldet</h2>
                <button onClick={logout}>Logout</button>
                <button onClick={userAuthenticated}>Authentifizierung überprüfen</button>
            </div>
        )
        }        

    </LoginWrapper>
  );
}
export default Login;

const LoginWrapper = styling.nav`
    margin-top:4rem;
    overflow:hidden;


.registration h1,input,label,button{
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    
}

.login h1,input,label,button{
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;

}
.loginstatus h1,h2,input,label,button{
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;

}
 
    `;