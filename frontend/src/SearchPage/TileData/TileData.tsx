import React, {useEffect, useState} from 'react';
import {Card} from "antd";
import {State} from "../../store";
import {useDispatch, useSelector} from "react-redux";
import './TileData.css'
import {FaLinux, FaWindows, FaApple} from 'react-icons/fa';
import {AiOutlineStop} from 'react-icons/ai'
import {Link} from "react-router-dom";
import AutoSizer from "react-virtualized-auto-sizer";

import {FixedSizeGrid as Grid} from "react-window";
import {changeUrl, loadGames} from "../../Slice/Slice";

const TileData = () => {

    const dispatch = useDispatch()

    const games = useSelector((state: State) => state.steam.game);

    const columnCount = (width: number) => {
        if (games.length === 1 || games.length === 2) {
            return 1
        }
        if (width < 1200) {
            if (width < 600) {
                return 1
            }
            return 2
        } else {
            return 3
        }

    }

    const rowHeight = (width: number) => {


        if (1200 < width) {
            if (1400 > width) {
                return (Number(width) / columnCount(Number(width)) - 9) / (1.4)
            }
            const test = (Number(width) / columnCount(Number(width)) - 9) / (3 / 2)
            return test
        }
        if (width < 1200 && width > 1000) {
            return (Number(width) / columnCount(Number(width)) - 9) / (1.5)
        }
        if (width < 600 && width > 500) {
            return (Number(width) / columnCount(Number(width)) - 9) / (1.5)
        }

        if (width < 500) {
            return (Number(width) / columnCount(Number(width)) - 9) / (1.3)
        }
        return (Number(width) / columnCount(Number(width)) - 9) / (1.3)
    }

    const rowCount = (width: number) => {
        return games.length / columnCount(Number(width))
    }

    const [lastCall, setLastCall] = useState(0);
    const searchPage = useSelector((state: State) => state.steam.searchPage)

    const url = useSelector((state: State) => state.steam.url)

    const addGamesOnScroll = (scrollTop: number, width: number) => {
        const now = Date.now();
        const timeSinceLastCall = now - lastCall;
        const minimumInterval = 750;

        if (scrollTop > (rowHeight(width) * games.length) / columnCount(Number(width)) / 1.20 && timeSinceLastCall >= minimumInterval) {
            console.log(url)
            const split = url.split('?')
            console.log(split)
            let coucou;
            if (split[1] !== undefined && split[1] !== "") {
                coucou = "http://localhost:9090/v1/game/filter/" + 1  + '?' + split[1]
            } else {
                coucou = "http://localhost:9090/v1/game/filter/" + searchPage +'?'
            }
            console.log(coucou)

            dispatch(changeUrl(coucou))
            fetch(coucou)
                .then(response => response.json())
                .then(response => {
                    dispatch(loadGames([response.results, searchPage + 1]));
                })
                .catch(error => alert("Erreur : " + error));
            setLastCall(now);
        }
    }


    return (
        <div className={'tilePage'}>
            <AutoSizer className={'dqsdqs'}>
                {({height, width}) => (
                    <Grid
                        columnCount={columnCount(Number(width))}
                        columnWidth={Number(width) / columnCount(Number(width)) - 7.5}
                        height={Number(height)}
                        rowCount={rowCount(Number(width))}
                        rowHeight={rowHeight(Number(width))}
                        width={Number(width)}
                        onScroll={({scrollTop}) => {
                            addGamesOnScroll(scrollTop, Number(width))
                        }}
                    >
                        {({columnIndex, rowIndex, style}) => {
                            const index = columnIndex + rowIndex * columnCount(Number(width));
                            return (
                                <div style={{...style}}>
                                    <Link to={`/game/${games[index].appid}`} className={'Link'}>

                                        <Card cover={<img alt={games[index].name}
                                                          src={`https://steamcdn-a.akamaihd.net/steam/apps/${games[index].appid}/header.jpg`}/>}
                                              hoverable style={{width: "100%", height: "100%"}} bordered>
                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                                <div>
                                                    {games[index].name}
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    width: '100px',
                                                    justifyContent: "space-between"
                                                }}>
                                                    <div style={{display: "flex", alignItems: "center"}}>
                                                        {games[index].required_age !== 0 ?
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center"
                                                                }}>-{games[index].required_age}
                                                                <AiOutlineStop/></div> : ""}
                                                    </div>
                                                    <div style={{display: "flex", alignItems: "center"}}>
                                                        {games[index].platforms.map((platform, index) => {
                                                            if (platform === 'linux') {
                                                                return <FaLinux key={index}/>
                                                            } else if (platform === 'windows') {
                                                                return <FaWindows key={index}/>
                                                            } else {
                                                                return <FaApple key={index}/>
                                                            }
                                                        })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                {games[index].steamspy_tags.map(tag => {
                                                    if (tag === games[index].steamspy_tags[games[index].steamspy_tags.length - 1])
                                                        return tag
                                                    else {
                                                        return tag + ', '
                                                    }

                                                })
                                                }
                                            </div>
                                        </Card>
                                    </Link>
                                </div>
                            );
                        }}
                    </Grid>
                )}
            </AutoSizer>
        </div>
    );
}


export default TileData;
