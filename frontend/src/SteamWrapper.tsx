import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import SearchPage from './SearchPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login/Login';
import Register from './Register/Register';
import DetailPage from './DetailPage';
import PageNotFound from './PageNotFound/PageNotFound';

const SteamWrapper = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<SearchPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/game/:gameid" element={<DetailPage />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
};

export default SteamWrapper;
