import React from 'react';
import Layout from '../Layout';
import './PageNotFound.css';

const PageNotFound = () => {
    return (
        <div>
            <Layout />
            <div className="container">
                <h1>Error 404</h1>
                <h2>Page not found</h2>
            </div>
        </div>
    );
};

export default PageNotFound;
