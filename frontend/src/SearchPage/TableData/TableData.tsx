import React from 'react';
import {State} from "../../store";
import {useSelector} from "react-redux";
import {FixedSizeList as List} from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer'
import './TableData.css'
import {Link} from "react-router-dom";

const TableData = () => {

    const games = useSelector((state: State) => state.steam.game);

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
                        style={{overflowX:"hidden"}}
                        itemSize={100}
                        height={Number(height)}
                        width={Number(width)}
                    >
                        {({index, style}) => {
                            return (
                                <Link to={`/game/${games[index].id}`}>
                                    <li style={style}>
                                        <div className={'rowData'} key={games[index].id}>
                                            <div className={'element'}>{games[index].name}</div>
                                            <div className={'element'}>{games[index].developer}</div>
                                            <div className={'element'}>{games[index].publisher}</div>
                                            <div className={'element'}>{games[index].categories}</div>
                                            <div className={'element'}>{games[index].genres}</div>
                                            <div className={'element'}>{games[index].steamspy}</div>
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
