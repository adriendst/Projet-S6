import React, {useState} from 'react';
import {Checkbox, Collapse, Select, DatePicker, Input} from "antd";
import {State} from "../store";
import {useDispatch, useSelector} from "react-redux";
import {
    changeDateByRange,
    changeDateByYear,
    changeUrl,
    changeUserOnly,
    loadGames,
    updateFilters,
    userConnection
} from "../Slice/Slice";
import './Filter.css'
import MultipleSelect from "./MultipleSelect/MultipleSelect";
import Fuse from "fuse.js";
import MultipleSelectWithFuzzySearch from "./MultipleSelectWithFuzzySearch/MultipleSelectWithFuzzySearch";
import type {Dayjs} from 'dayjs';
import dayjs from 'dayjs';
import {RangeValue} from 'rc-picker/lib/interface';

import customParseFormat from 'dayjs/plugin/customParseFormat';
import {Link} from "react-router-dom";


const Filter = () => {

    dayjs.extend(customParseFormat);

    const dispatch = useDispatch()

    const {Panel} = Collapse;
    const {RangePicker} = DatePicker;
    const [byYear, setByYear] = useState<boolean>(useSelector((state: State) => state.steam.filter.dateByYear));
    const [byRange, setByRange] = useState<boolean>(useSelector((state: State) => state.steam.filter.dateByRange));
    const [byUser, setByUser] = useState<boolean>(useSelector((state: State) => state.steam.filter.user_only));
    const filters = useSelector((state: State) => state.steam.filter);
    const [date, setDate] = useState<Dayjs[] | undefined>(undefined);
    const refreshToken = useSelector((state: State) => state.steam.refreshToken)


    const [filteredOptions, setFilteredOptions] = useState<{ value: string; label: string; }[]>([]);

    const onChangeName = (value: string) => {
        const newFilters = {...filters, name: value};
        dispatch(updateFilters(newFilters));
    };

    const onSearchName = (value: string) => {
        fetch(`http://localhost:9090/v1/game/complete?searchText=${value}&results=20`)
            .then(response => response.json())
            .then(response => {
                setFilteredOptions(response.results ? response.results.map((r: string) => ({
                    value: r,
                    label: r
                })) : undefined);
            })
            .catch(error => alert("Erreur : " + error));
        const newFilters = {...filters, name: value};
        dispatch(updateFilters(newFilters));
    }


    const onAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        const newFilters = {...filters, required_age: value};
        dispatch(updateFilters(newFilters))
    }

    const onRangeDateChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
        let date = [];
        let datejs = []
        for (let i = 0; i < dateStrings.length; i++) {
            date.push(dateStrings[i])
            datejs.push(dayjs(dateStrings[i], dateFormat))
        }
        console.log(dateStrings)
        const newFilters = {...filters, release_date: date};
        dispatch(updateFilters(newFilters))
        setDate(datejs)
    }

    const onDateChange = (value: Dayjs | null, dateString: string) => {
        console.log(value, dateString)
        const newFilters = {...filters, release_date: [dateString]};
        dispatch(updateFilters(newFilters))
        setDate([dayjs(dateString, dateFormat)])
    }


    const onByYearChange = () => {
        dispatch(changeDateByYear())
        setByYear(!byYear)
        console.log(byYear)
        let date = []
        let datejs = []
        if (byYear) {

            for (let i = 0; i < filters.release_date.length; i++) {
                const todayDate = new Date();
                let month = (todayDate.getMonth() + 1).toString()
                    .padStart(2, '0');
                let day = todayDate.getDate().toString()
                    .padStart(2, '0');
                const dateString = `${month}-${day}`;

                const newDate = filters.release_date[i].slice(0, 5)
                console.log(newDate + dateString);
                date.push(newDate + dateString)
                datejs.push(dayjs(newDate + dateString, dateFormat))
            }
        } else {
            for (let i = 0; i < filters.release_date.length; i++) {
                const newDate = filters.release_date[i].slice(0, 4)
                date.push(newDate)
                datejs.push(dayjs(newDate, dateFormat))

            }
        }
        setDate(datejs)
        const newFilters = {...filters, release_date: date, dateByYear: !byYear};
        dispatch(updateFilters(newFilters))
    }

    const onUserOnlyChange = () => {
        dispatch(changeUserOnly())
        setByUser(!byUser)

        const newFilters = {...filters, user_only: !byUser};
        dispatch(updateFilters(newFilters))
    }
    const onByRangeChange = () => {
        dispatch(changeDateByRange())
        setByRange(!byRange)
    }

    const dateFormat = 'YYYY-MM-DD';
    const yearFormat = 'YYYY';


    const onOrderByChange = (value: string) => {
        let newFilters;
        if (value) {
            newFilters = {...filters, order_by: value.toLowerCase()};
        } else {
            newFilters = {...filters, order_by: value};
        }
        dispatch(updateFilters(newFilters));
    };

    const onOrderTypeChange = (value: string) => {
        let newFilters;
        if (value) {
            newFilters = {...filters, order_type: value.toLowerCase()};
        } else {
            newFilters = {...filters, order_type: value};
        }
        dispatch(updateFilters(newFilters));
    };

    const onAndPlatformsChange = (value: string) => {
        let newFilters;
        if (value) {
            newFilters = {...filters, and_platforms: value.toLowerCase()};
        } else {
            newFilters = {...filters, and_platforms: value};
        }
        dispatch(updateFilters(newFilters));
    };


    return (
        <div className={'filterDiv'}>
            <div className={'name'}>
                <Select
                    allowClear
                    showSearch
                    defaultValue={filters.name !== "" ? filters.name : null}
                    className={'nameInputSize'}
                    placeholder="SearchPage a game by his name"
                    onChange={onChangeName}
                    onSearch={onSearchName}
                    filterOption={false}
                    options={filteredOptions}
                />
            </div>
            <Collapse>
                <Panel header="Show advanced filters" key={'Filters'}>
                    <div className={'filters'}>
                        <div>
                            <MultipleSelectWithFuzzySearch filters={filters} selectParam={'Developers'}/>
                            <MultipleSelectWithFuzzySearch filters={filters} selectParam={'Publishers'}/>
                        </div>
                        <div>
                            <MultipleSelect filters={filters} selectParam={'Platforms'}/>
                            <div className={'divInput'}>
                                <div>And Platforms</div>
                                <Select disabled={filters.platforms.length >= 2
                                }
                                        allowClear
                                        defaultValue={filters.and_platforms !== "" ? filters.and_platforms : null}
                                        placeholder={'And platforms'} className={'inputSize'}
                                        onChange={onAndPlatformsChange}
                                        options={[{label: 'True', value: 'True'}, {
                                            label: 'False',
                                            value: 'False'
                                        }]}></Select>
                            </div>
                        </div>
                        <div>
                            <MultipleSelect filters={filters} selectParam={'Genres'}/>
                            <div className={'divInput'}>
                                <div>Required Age</div>
                                <Input type={'number'} placeholder={'Required Age'} className={'inputSize'}
                                       value={filters.required_age} onChange={onAgeChange}></Input>
                            </div>
                        </div>
                        <div>
                            <MultipleSelect filters={filters} selectParam={'Categories'}/>
                            {refreshToken === undefined ? <div></div> :
                                <div className={'divInput'}>
                                    <div>Search on my games</div>
                                    <div>
                                        <Checkbox onChange={onUserOnlyChange}>My Games</Checkbox>
                                    </div>
                                </div>
                            }
                        </div>
                        <div>
                            <div className={'divInput'}>
                                <div>Order By</div>
                                <Select allowClear defaultValue={filters.order_by !== "" ? filters.order_by : null}
                                        placeholder={'Order by'} className={'inputSize'} onChange={onOrderByChange}
                                        options={[{label: 'Name', value: 'Name'}, {
                                            label: 'Release Date',
                                            value: 'Release_Date'
                                        }, {label: 'Developer', value: 'Developer'}, {
                                            label: 'Publisher',
                                            value: 'Publisher'
                                        }, {label: 'Required Age', value: 'Required_Age'}]}></Select>
                            </div>
                            <div className={'divInput'}>
                                <div>Order Type</div>
                                <Select allowClear defaultValue={filters.order_type !== "" ? filters.order_type : null}
                                        placeholder={'Order type'} className={'inputSize'} onChange={onOrderTypeChange}
                                        options={[{label: 'Asc', value: 'Asc'}, {
                                            label: 'Desc',
                                            value: 'Desc'
                                        }]}></Select>
                            </div>

                        </div>
                    </div>
                    <div className={'divInput'}>
                        <div style={{display: 'flex', justifyContent: "center"}}>Date</div>
                        <div className={'dateInput'}>
                            <div style={{display: "flex", marginBottom: '5px'}}>
                                <div>
                                    <Checkbox checked={filters.dateByYear} onChange={onByYearChange}>By year</Checkbox>
                                </div>
                                <div>
                                    <Checkbox checked={filters.dateByRange} onChange={onByRangeChange}>By
                                        range</Checkbox>
                                </div>
                            </div>
                            <div>
                                {
                                    byYear && byRange ? <RangePicker
                                        onChange={onRangeDateChange}
                                        picker={'year'} defaultValue={date as RangeValue<Dayjs>}
                                    /> : byYear && !byRange ?
                                        <DatePicker picker={'year'} onChange={onDateChange}
                                                    defaultValue={date ? date[0] : undefined}
                                        /> : !byYear && byRange ?
                                            <RangePicker onChange={onRangeDateChange}
                                                         defaultValue={date as RangeValue<Dayjs>}
                                            /> :
                                            <DatePicker onChange={onDateChange}
                                                        defaultValue={date ? date[0] : undefined}
                                            />
                                }
                            </div>
                        </div>
                    </div>

                </Panel>
            </Collapse>
        </div>
    );
};

export default Filter;
