import React from 'react';
import {Provider, useDispatch} from "react-redux";
import store from "./store";
import SearchPage from "./SearchPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Register/Register";
import DetailPage from './DetailPage';
import {userConnection} from "./Slice/Slice";

const SteamWrapper = () => {
    const dispatch = useDispatch()
    const refreshToken = localStorage.getItem('refreshToken')
    if(refreshToken !== null){
        dispatch(userConnection(refreshToken))
    }
    return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<SearchPage/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/game/:gameid" element={<DetailPage/>}/>
                </Routes>
            </BrowserRouter>
    );
};

export default SteamWrapper;
