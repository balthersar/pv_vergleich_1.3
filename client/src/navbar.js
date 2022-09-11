
import React, {useContext, useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import styling from 'styled-components';
import Axios from "axios";
import { AuthContext, AuthContextProvider } from "./authContext";



function Navbar() {
    
    const [loginName, setLoginName] = useState('');
    const { loginStatus , logout} = useContext(AuthContext);

    const navslide = () => {
            const burger = document.querySelector(".burger");
            const nav = document.querySelector(".nav-links");
            const navLinks = document.querySelectorAll(".nav-links li");
              nav.classList.toggle("open");
  
              navLinks.forEach((link, index) => {
                if (link.style.animation) {
                  link.style.animation = "";
                } else {
                  link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 +
                    0.5}s`;
                }
              });

              burger.classList.toggle("toggle");
            };


    
    return (
            <NavWrapper className="navbar  navbar-dark px-sm-2">
                <div className="burger" onClick={navslide}>
                    <div className="line1"></div>
                    <div className="line2"></div>
                    <div className="line3"></div>
                </div>

                    
                <ul className="nav-links">
                    <div className ="nav-links-item">
                        <li className="nav-item ">
                            <Link to="/pvmodule" className="nav-link" onClick={navslide}>PV-Module</Link>
                        </li>
                        <li className="nav-item ">
                            <Link to="/wr" className="nav-link" onClick={navslide}>Wechselrichter</Link>
                        </li>
                        <li className="nav-item ">
                            <Link to="/climate" className="nav-link" onClick={navslide}>Klimadaten</Link>
                        </li>
                        <li className="nav-item ">
                            <Link to="/climate" className="nav-link" onClick={navslide}>Verbrauch</Link>
                        </li>
                        <li className="nav-item ">
                            <Link to="/anlage" className="nav-link" onClick={navslide}>Anlage</Link>
                        </li>
                        {/* <li className="nav-item ">
                                    <Link to="/login" className="nav-link" onClick={navslide}>Login</Link>
                        </li> */}
                        {loginStatus ? (
                            <li className="nav-item ">
                                <Link to="/login" onClick={logout}>
                                    <h6>Ausloggen</h6>
                                </Link>
                            </li>
                            ) : (
                                <li className="nav-item ">
                                    <Link to="/login" className="nav-link" onClick={navslide}>Login</Link>
                                </li>
                            )
                        }
                    </div>

                </ul>

            </NavWrapper>
    )
}

export default Navbar;

const NavWrapper = styling.nav`
    background: var(--lightBlue);
    height: 60px;
    position: fixed; /* Set the navbar to fixed position */
    top: 0; /* Position the navbar at the top of the page */
    width: 100%; /* Full width */
    overflow:hidden;
    z-index:99;
    
    
    .nav-link{
        color:var(--mainWhite);
        font-size:1.3rem !important;
        text-transform:capitalize;
    }
    

    .nav-links-item{
        display:flex;

    }
    .nav-links-item-burger{
        display:flex;
        display:none;
    }
    .nav-links {
        display: flex;
        position:relative;
        list-style: none;


        margin-right: auto;
    }

    .nav-links li a {
        color: white;
        text-decoration: none;
        font-size: 25px;   
    }
    .nav-links li:hover{
        background: white;
        transition: .5s;
        transform: translate3d(0,0,0);
        -webkit-transform: translate3d(0,0,0);
        -webkit-transition: .5s;   
        border-radius: 7px;
    }
    .nav-links li a:hover{
        color: rgb(125,166,136);
    }
        
    
    
    @media screen and (max-width: 710px) {
        
        .navbar-brand img{
            margin-left: 40px;

        }
        .line1, .line2, .line3 {
          width: 30px;
          height: 3px;
          background: white;
          margin: 5px;
        }
        .burger {
            position: absolute;
            z-index: 99; 
            cursor:pointer;
        }
        .toggle.burger{
            position:fixed;
        }
        
        .nav-links {
            display:block;
            left:0;
            top:0;
            position: fixed;
            background: var(--lightBlue);
            width: 70%;
            height:100vh;
            flex-direction: column;
            clip-path: circle(50px at -90% -30%);
            -webkit-clip-path: circle(50px at -90% -30%);
            transition: all 1s ease-out;
            -webkit-transition: all 1s ease-out;
            pointer-events: none;
            z-index: 9;
            -webkit-transform: translateZ(9px);
          }
          .nav-links-item{
            display:block;
    
        }
        .nav-links-item-burger{
            display:block;
        }
          .nav-links-item{
              margin-top:60px;
          }
        .nav-links.open {
            clip-path: circle(2000px at -120% -30%);
            transform: translate3d(0,0,0);
            -webkit-transform: translate3d(0,0,0);
            -webkit-clip-path: circle(2000px at -120% -30%);
            pointer-events: all;
            opacity: 0.9;
            transform: translate3d(0,0,0);
            -webkit-transform: translate3d(0,0,0);
            -webkit-transform: translateZ(9px); 
          }
        
        
        
        
        .toggle .line1{
            transform: rotate(-45deg) translate(-5px,6px);
            -webkit-transform: rotate(-45deg) translate(-5px,6px);
          }
          .toggle .line2{
            opacity: 0;
          }
          .toggle .line3{
            transform: rotate(45deg) translate(-5px,-6px);
            -webkit-transform: rotate(45deg) translate(-5px,-6px);
          }
`;
