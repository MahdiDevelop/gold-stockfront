import React, { useState, useEffect } from "react";
import axios from "axios";
import App1 from './App1';
import Login from "./Login";
import "./assets/bootstrap-5.3.2-dist/css/bootstrap.min.css";
import bootjs from "./assets/bootstrap-5.3.2-dist/js/bootstrap.min.js";
import './login.css';
import Source from "./Source.js";
import { useSelector, useDispatch } from 'react-redux';
import Loginfinal from './login/Loginfinal.js';
export default function App() {
    const dispatch = useDispatch();
    const [correct, setCorrect] = useState(false);
    const [error, setError] = useState(null);
    const [loguser, setLoguser] = useState({});
    const [type, setType] = useState('simple');
    const check = async (user) => {
        try {
            const res = await axios.post(Source.getAddress()+'/api/login', user);
            localStorage.setItem('access', res.data.token);
            localStorage.setItem('userTokenname',res.data.user.category);
            localStorage.setItem('userTokenid',res.data.user.id);
            localStorage.setItem('userToken',res.data.user.name);
            localStorage.setItem('isTransactionsExpanded', false);
            localStorage.setItem('toggle', 'true');
            setCorrect(true);
            localStorage.setItem("draftCollapseState", true);
            localStorage.setItem("transactionCollapseState", true);
                localStorage.setItem("StockCollapseState", true);
                localStorage.setItem("ReportCollapseState", true);
                localStorage.setItem("transactionCollapseState", true);
                localStorage.setItem("ReportCollapseState", true);
                localStorage.setItem("draftCollapseState", true);
                window.location.pathname = '/';
        } catch (err) {
            setCorrect(false);
            setError('Invalid username or password');
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
        }
    };

    let Component;
    if (localStorage.getItem('access')||correct) {
        Component = <App1 type={type} setLoguser={setLoguser} loguser={loguser} setCorrect={setCorrect} setError={setError} />;
    } else {
        switch (window.location.pathname) {
            case '/':
                Component = <Loginfinal check={check} error={error} />;
                break;
            default:
                Component=<Loginfinal check={check} error={error}/>;
        }
    }
    return (
        <div className={`App ${localStorage.getItem("language") === "en" ? "" : "afgFont"}`}>
            {Component}
        </div>
    );
}
