import React from 'react';
import './App.css';
import SteamWrapper from "./SteamWrapper";
import store from "./store";
import {Provider} from "react-redux";

function App() {
    return (
        <Provider store={store}>
            <SteamWrapper/>
        </Provider>

    );
}

export default App;
