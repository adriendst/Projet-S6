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
import {changeUrl, loadGames, loadGenres} from "../Slice/Slice";


const SearchPage = () => {
    const displayTable = useSelector((state: State) => state.steam.displayType);

    const dispatch = useDispatch()

    const handleClick = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }


    const games = useSelector((state: State) => state.steam.game);
    useEffect(() => {
        if (games.length === 0) {
            fetch("http://localhost:9090/v1/genre/all")
                .then(response => response.json())
                .then(response => {
                    dispatch(loadGenres(response));
                })
                .catch(error => alert("Erreur : " + error));
        }
    }, []);


    const url = useSelector((state: State) => state.steam.url)

    const filters = useSelector((state: State) => state.steam.filter);
    useEffect(() => {
        let test = 'http://localhost:9090/v1/game/filter/1?'
        const filtersRecord = filters as Record<string, any>
        for (let filtersKey in filters) {
            // console.log(filtersKey)
            // console.log(filtersRecord[filtersKey])
            // console.log(typeof filtersRecord[filtersKey])
            // console.log(filters)
            if (typeof filtersRecord[filtersKey] !== "boolean") {
                if (filtersRecord[filtersKey] !== undefined && filtersRecord[filtersKey].length !== 0) {
                    if(filtersRecord[filtersKey].isArray){
                        for(let i = 0; i<filtersRecord[filtersKey].length; i++){
                            test = test + `&${filtersKey}=${filtersRecord[filtersKey][i]}}`
                            console.log(test)


                        }
                    }
                    else{
                        test = test + `&${filtersKey}=${filtersRecord[filtersKey]}`

                    }
                    console.log(test)
                    // dispatch(changeUrl(url + `&${filtersKey}=${filtersRecord[filtersKey]}`))
                }
            }
        }

        if (test === 'http://localhost:9090/v1/game/filter/1?') {
            // dispatch(changeUrl(test))
        }


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
