import React from 'react';
import {Card} from "antd";
import {State} from "../../store";
import {useSelector} from "react-redux";
import './TileData.css'
import {FaLinux, FaWindows, FaApple} from 'react-icons/fa';
import {AiOutlineStop} from 'react-icons/ai'
import {Link} from "react-router-dom";
import AutoSizer from "react-virtualized-auto-sizer";
import {VariableSizeGrid as Grid} from "react-window";

const Cell = ({
                  columnIndex,
                  rowIndex,
                  style
              }: { columnIndex: number, rowIndex: number, style: React.CSSProperties }) => (
    <div
        className={
            columnIndex % 2
                ? rowIndex % 2 === 0
                    ? 'GridItemOdd'
                    : 'GridItemEven'
                : rowIndex % 2
                    ? 'GridItemOdd'
                    : 'GridItemEven'
        }
        style={style}
    >
        r{rowIndex}, c{columnIndex}
    </div>
);

const TileData = () => {

    const games = useSelector((state: State) => state.steam.game);
    const columnWidths = new Array(1000)
        .fill(true)
        .map(() => 100 + Math.round(Math.random() * 50));

    const columnCount = () => {
        if(window.innerWidth < 1200){
            if(window.innerWidth < 600){
                return 1
            }
            return 2
        }
        else{
            return 3
        }
    }

    const rowCount = () => {
        console.log(games.length)
        console.log(games.length / columnCount())
        return games.length / columnCount()
    }

    const rowHeights = new Array(1000)
        .fill(true)
        .map(() => 25 + Math.round(Math.random() * 50));

    return (
        <div className={'tilePage'}>
            <AutoSizer className={'dqsdqs'}>
                {({height, width}) => (
                    <Grid
                        className="Grid"
                        columnCount={columnCount()}
                        columnWidth={index => columnWidths[index]}
                        height={height}
                        rowCount={rowCount()}
                        rowHeight={index => rowHeights[index]}
                        width={width}
                    >
                        {({columnIndex, rowIndex, style}) => {
                            const index = columnIndex + rowIndex*3;
                            console.log(width)

                            return (
                                <div style={style}>{index}</div>
                            );
                        }}
                    </Grid>
                )}
            </AutoSizer>
        </div>
    );
}


export default TileData;
