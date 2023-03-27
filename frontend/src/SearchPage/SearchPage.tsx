import React from 'react';
import DisplayButton from "../Filter/DisplayButton";
import TableData from "./TableData";
import {useSelector} from "react-redux";
import {State} from "../store";
import TileData from "./TileData/TileData";
import Filter from "../Filter/Filter";
import Layout from "../Layout/Layout";
import './SearchPage.css'
import {FaArrowAltCircleUp} from 'react-icons/fa'


const SearchPage = () => {
    const displayTable = useSelector((state: State) => state.steam.displayType);

    const handleClick = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

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
