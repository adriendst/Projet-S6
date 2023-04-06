import React from 'react';
import {Link} from "react-router-dom";
import './Layout.css'
import {useDispatch, useSelector} from "react-redux";
import {State} from "../store";
import {userConnection} from "../Slice/Slice";
import axios from "axios";

const Layout = () => {
    const refreshToken = useSelector((state: State) => state.steam.refreshToken)
    const dispatch = useDispatch();

    const logout = () => {
        axios.post("http://localhost:9090/v1/auth/logout", {refreshToken})
            .then(response => {
                localStorage.removeItem('refreshToken')
                dispatch(userConnection(undefined))
                delete axios.defaults.headers.common['authorization']
            })

    }
    return (
        <div className={'layout'}>
            <div className={'layoutContent'}>
                <Link to={'/'} className={'link'}>Home</Link>
                {refreshToken === undefined ? <Link to={'/login'} className={'link'}>Login</Link> :
                    <Link to={'/'} onClick={() => {
                        logout()
                    }} className={'link'}>Logout</Link>}

            </div>
        </div>
    );
};

export default Layout;
