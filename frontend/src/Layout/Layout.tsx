import React from 'react';
import {Link} from "react-router-dom";
import './Layout.css'


const Layout = () => {
    return (
        <div className={'layout'}>
            <div className={'layoutContent'}>
                <Link to={'/login'} className={'link'}>Login</Link>
            </div>
        </div>
    );
};

export default Layout;
