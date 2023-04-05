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
import {changeUrl, loadGames, loadGenres, loadCategories} from "../Slice/Slice";


const SearchPage = () => {
    const displayTable = useSelector((state: State) => state.steam.displayType);

    const dispatch = useDispatch()

    const handleClick = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }


    const games = useSelector((state: State) => state.steam.game);
    useEffect(() => {
        if(games) {
            if (games.length === 0) {
                fetch("http://localhost:9090/v1/genre/all")
                    .then(response => response.json())
                    .then(response => {
                        dispatch(loadGenres(response));
                    })
                    .catch(error => alert("Erreur : " + error));
                fetch("http://localhost:9090/v1/category/all")
                    .then(response => response.json())
                    .then(response => {
                        dispatch(loadCategories(response));
                    })
                    .catch(error => alert("Erreur : " + error));
            }
        }
    }, []);


    const filters = useSelector((state: State) => state.steam.filter);
    useEffect(() => {
        let test = 'http://localhost:9090/v1/game/filter/1?'
        const filtersRecord = filters as Record<string, any>
        // console.log(filtersRecord)
        for (let filtersKey in filters) {
            if (typeof filtersRecord[filtersKey] !== "boolean") {
                if (filtersRecord[filtersKey] !== undefined && filtersRecord[filtersKey].length !== 0 && filtersRecord[filtersKey] !== null) {
                    if (typeof filtersRecord[filtersKey] === 'object') {
                        if (filtersKey === 'release_date') {
                            if (filtersRecord[filtersKey][0]) {
                                if (filtersRecord[filtersKey][1]) {
                                    test = test + `&start_date=${filtersRecord[filtersKey][0]}&end_date=${filtersRecord[filtersKey][1]}`
                                } else {
                                    test = test + `&start_date=${filtersRecord[filtersKey][0]}`
                                }
                            }
                        } else {
                            for (let i = 0; i < filtersRecord[filtersKey].length; i++) {
                                test = test + `&${filtersKey}=${filtersRecord[filtersKey][i]}`
                            }
                        // &start_date=1999-01-01&end_date=2022-12-31
                        }
                    } else {
                        if(!isNaN(filtersRecord[filtersKey]))
                            console.log('coucouc')
                        test = test + `&${filtersKey}=${filtersRecord[filtersKey]}`
                    }
                }
            }
        }
        dispatch(changeUrl(test))

        console.log(test)

        fetch(test)
            .then(response => response.json())
            .then(response => {
                dispatch(loadGames([response.results, 2]));
            })
            .catch(error => alert("Erreur : " + error));

    }, [filters]);


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
