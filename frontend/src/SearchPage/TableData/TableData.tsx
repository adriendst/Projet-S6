import React, {useState} from 'react';
import {State} from "../../store";

import {useDispatch, useSelector} from "react-redux";
import {FixedSizeList as List} from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer'
import './TableData.css'

import {Link} from "react-router-dom";
import {loadGames} from "../../Slice/Slice";

const TableData = () => {

    const dispatch = useDispatch()

    const games = useSelector((state: State) => state.steam.game);

    const [lastCall, setLastCall] = useState(0);
    const searchPage = useSelector((state : State) => state.steam.searchPage)

    const addGamesOnScroll = (scrollTop: number, width: number) => {
        const now = Date.now();
        const timeSinceLastCall = now - lastCall;
        const minimumInterval = 750;

        if (scrollTop > 150 * games.length / 1.20 && timeSinceLastCall >= minimumInterval) {
            let url = "http://localhost:9090/v1/game/filter/" + searchPage
            console.log(url)

            fetch("http://localhost:9090/v1/game/filter/" + searchPage)
                .then(response => response.json())
                .then(response => {
                    dispatch(loadGames([response, searchPage+1]));
                })
                .catch(error => alert("Erreur : " + error));
            setLastCall(now);
        }    }

    return (
        <ul className={'table'}>
            <li className={'tableHeader'}>
                <div className={'header'}>
                    <div>Name</div>
                    <div>Developer</div>
                    <div>Publisher</div>
                    <div>Categories</div>
                    <div>Genres</div>
                    <div>Tag</div>
                    <div>Release Date</div>
                    <div>Required Age</div>
                    <div>Platforms</div>
                </div>
            </li>
            <AutoSizer>
                {({height, width}) => (
                    <List
                        innerElementType="ul"
                        itemCount={games.length}
                        style={{overflowX: "hidden"}}
                        itemSize={150}
                        height={Number(height)}
                        width={Number(width)}
                        onScroll={(scrollTop) => {
                            addGamesOnScroll(scrollTop.scrollOffset, Number(width))
                        }}
                    >
                        {({index, style}) => {
                            return (
                                <Link to={`/game/${games[index].appid}`}>
                                    <li style={style}>
                                        <div className={'rowData'} key={games[index].appid}>
                                            <div className={'element'}>{games[index].name}</div>
                                            <div className={'element'}>{games[index].developer}</div>
                                            <div className={'element'}>{games[index].publisher}</div>
                                            <div className={'element'}>{games[index].categories.map(tag => {
                                                if (tag === games[index].categories[games[index].categories.length - 1])
                                                    return tag
                                                else {
                                                    return tag + ' / '
                                                }

                                            })}
                                            </div>
                                            <div className={'element'}>{games[index].genres.map(tag => {
                                                if (tag === games[index].genres[games[index].genres.length - 1])
                                                    return tag
                                                else {
                                                    return tag + ' / '
                                                }

                                            })}</div>
                                            <div className={'element'}>{games[index].steamspy_tags.map(tag => {
                                                if (tag === games[index].steamspy_tags[games[index].steamspy_tags.length - 1])
                                                    return tag
                                                else {
                                                    return tag + ' / '
                                                }

                                            })}</div>
                                            <div className={'element'}>{games[index].release_date.toString()}</div>
                                            <div className={'element'}>{games[index].required_age}</div>
                                            <div className={'element'}>{games[index].platforms}</div>
                                        </div>
                                    </li>
                                </Link>
                            );
                        }}
                    </List>
                )}
            </AutoSizer>
        </ul>
    )
        ;
};

export default TableData;
