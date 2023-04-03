import React, {useEffect} from 'react';
import DisplayButton from "../Filter/DisplayButton";
import TableData from "./TableData";
import {useDispatch, useSelector} from "react-redux";
import {State} from "../store";
import TileData from "./TileData/TileData";
import Filter from "../Filter/Filter";
import Layout from "../Layout/Layout";
import './SearchPage.css'
import {FaArrowAltCircleUp} from 'react-icons/fa'
import {loadGames} from "../Slice/Slice";


const SearchPage = () => {
    const displayTable = useSelector((state: State) => state.steam.displayType);

    const dispatch = useDispatch()

    const handleClick = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }


    const games = useSelector((state: State) => state.steam.game);
    useEffect(() => {
        if (games.length === 0) {
            fetch("http://localhost:9090/v1/game/filter/1")
                .then(response => response.json())
                .then(response => dispatch(loadGames(response)))
                .catch(error => alert("Erreur : " + error));
        }
    }, []);



    return (
        <div>
        <div className={'searchLayout'}>
            <Layout/>
            <div className={'filterLayout'}>
            <Filter></Filter>
            <div className={'displayButton'}>
                <DisplayButton></DisplayButton>
            </div>
            </div>
        </div>
            <div className={'data'}>
            {!displayTable ? <TileData/> : <TableData/>}
            <FaArrowAltCircleUp size={40} className={'arrow'} onClick={handleClick}/>
            </div>
        </div>
    );
};

export default SearchPage;
