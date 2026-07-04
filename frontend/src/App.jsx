import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./Comp/Register";
import Login from "./Comp/Login";
import Profile from "./Comp/Profile";
import Ats_resume from "./Comp/Ats_resume";
import Mock_test from "./Comp/Mock_test";
import Logout from "./Comp/Logout";
import Footer from "./Comp/Footer";
import Nav from "./Comp/Nav";
import Ct from "./Comp/Ct";

import "./App.css";

const App = () => {

    const [token, setToken] = useState("");
    const [user, setUser] = useState(null);

    const obj = {token,setToken,user,setUser};
    return (
        <BrowserRouter>

<Ct.Provider value={obj}>

    <Nav/>

    <Routes>

        <Route path="/" element={<Login/>}/>

        <Route path="/register" element={<Register/>}/>

        <Route path="/profile" element={<Profile/>}/>

        <Route path="/resume" element={<Ats_resume/>}/>

        <Route path="/mt" element={<Mock_test/>}/>

        <Route path="/lg" element={<Logout/>}/>

    </Routes>

    {token && <Footer/>}

</Ct.Provider>

</BrowserRouter>
    );
};
export default App;