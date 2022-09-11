import React from 'react';
import { Routes,  Route} from "react-router-dom";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import Navbar from './navbar.js';
import Default from './default.js';
import PVModule from './PVModule/pvmodule.js';
import Login from './Login/login.js';

function App() {
  return <React.Fragment>
    <Navbar />
    <Routes>
   
      <Route path="/" element={<PVModule />} />
      <Route path="/pvmodule" element={<PVModule />} />
      <Route path="/login" element={<Login />} />
      <Route component={Default} />
    </Routes>

  </React.Fragment>;
}

export default App;