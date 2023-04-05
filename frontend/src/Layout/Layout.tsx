import React from 'react';
import {Link} from "react-router-dom";
import './Layout.css'
import {useDispatch, useSelector} from "react-redux";
import {State} from "../store";
import {userConnection} from "../Slice/Slice";


const Layout = () => {
    const refreshToken = useSelector((state : State) => state.steam.refreshToken)
    const dispatch = useDispatch();
    return (
        <div className={'layout'}>
            <div className={'layoutContent'}>
                <Link to={'/'} className={'link'}>Home</Link>
                {refreshToken === undefined ? <Link to={'/login'} className={'link'}>Login</Link> :
                    <Link to={'/'} onClick={() => {
                        dispatch(userConnection(undefined))
                    }} className={'link'}>Logout</Link>}

            </div>
        </div>
    );
};

export default Layout;
