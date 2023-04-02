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

const TileData = () => {
    fetch("http://localhost:9090/v1/game/10")
        .then(response => response.json())
        .then(response => alert(JSON.stringify(response)))
        .catch(error => alert("Erreur : " + error));

    const games = useSelector((state: State) => state.steam.game);

    const columnCount = (width: number) => {
        if (width < 1200) {
            if (width < 600) {
                return 1
            }
            return 2
        } else {
            return 3
        }

    }
    const [scrollTop, setScrollTop] = useState<number>(0);

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

    const addGamesOnScroll = (scrollTop: number, width: number) => {
        if (scrollTop > (rowHeight(width) * games.length) / columnCount(Number(width)) / 1.10) {
            console.log("caca")
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
                                    <Link to={`/game/${games[index].id}`} className={'Link'}>

                                        <Card cover={<img alt={games[index].name} src={games[index].header_image}/>}
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
                                                {games[index].steamspy.map(tag => {
                                                    if (tag === games[index].steamspy[games[index].steamspy.length - 1])
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
