import React, {useState} from 'react';
import {Checkbox, Collapse, Select, DatePicker, Input} from "antd";
import {State} from "../store";
import {useDispatch, useSelector} from "react-redux";
import {changeDateByRange, changeDateByYear, updateFilters} from "../Slice/Slice";
import './Filter.css'
import MultipleSelect from "./MultipleSelect/MultipleSelect";
import Fuse from "fuse.js";
import MultipleSelectWithFuzzySearch from "./MultipleSelectWithFuzzySearch/MultipleSelectWithFuzzySearch";
import type {Dayjs} from 'dayjs';


const Filter = () => {

    const dispatch = useDispatch()

    const {Panel} = Collapse;
    const {RangePicker} = DatePicker;
    const [searchNameValue, setNameSearchValue] = useState<string>("");
    const [byYear, setByYear] = useState<boolean>(useSelector((state: State) => state.steam.filter.dateByYear));
    const [byRange, setByRange] = useState<boolean>(useSelector((state: State) => state.steam.filter.dateByRange));
    const game = useSelector((state: State) => state.steam.game);
    const filters = useSelector((state: State) => state.steam.filter);

    const options = {
        includeScore: true,
        keys: ['name'],
    };

    const fuse = new Fuse(game.map((game) => {
        return game.name
    }), options)

    const [filteredOptions, setFilteredOptions] = useState<{ value: string; label: string; }[]>([]);

    const onChangeName = (value: string) => {
        console.log(`selected ${value}`);
        setNameSearchValue(value);
        const result = fuse.search(value);
        const filteredOptions = result.map((r) => ({value: r.item, label: r.item}));
        setFilteredOptions(filteredOptions);
        const newFilters = {...filters, name: value};
        dispatch(updateFilters(newFilters));
    };


    const onAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        const newFilters = {...filters, required_age: value};
        dispatch(updateFilters(newFilters))
    }

    const onRangeDateChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
        let date = [];
        for (let i = 0; i < dateStrings.length; i++) {
            date.push(new Date(dateStrings[i]))
        }
        const newFilters = {...filters, release_date: date};
        dispatch(updateFilters(newFilters))
    }

    const onDateChange = (value: Dayjs | null, dateString: string) => {
        const newFilters = {...filters, release_date: [new Date(dateString)]};
        dispatch(updateFilters(newFilters))
    }


    const onByYearChange = () => {
        dispatch(changeDateByYear())
        setByYear(!byYear)
    }

    const onByRangeChange = () => {
        dispatch(changeDateByRange())
        setByRange(!byRange)
    }

    return (
        <div className={'filterDiv'}>
            <div className={'name'}>
                <Select
                    showSearch
                    defaultValue={filters.name !== "" ? filters.name : null}
                    className={'nameInputSize'}
                    placeholder="SearchPage a game by his name"
                    onChange={onChangeName}
                    onSearch={onChangeName}
                    filterOption={false}
                    options={searchNameValue.length > 0
                        ? filteredOptions.map((game) => ({value: game.value, label: game.label}))
                        : game.map((game) => ({value: game.name, label: game.name}))
                    }
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
                            <MultipleSelect filters={filters} selectParam={'Categories'}/>
                        </div>
                        <div>
                            <MultipleSelect filters={filters} selectParam={'Genres'}/>
                            <MultipleSelect filters={filters} selectParam={'Steamspy'}/>
                        </div>
                        <div>
                            <div className={'divInput'}>
                                <div>Required Age</div>
                                <Input type={'number'} placeholder={'Required Age'} className={'inputSize'}
                                       value={filters.required_age} onChange={onAgeChange}></Input>
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
                                                                     picker={'year'}/> : byYear && !byRange ?
                                        <DatePicker picker={'year'} onChange={onDateChange}
                                        /> : !byYear && byRange ?
                                            <RangePicker onChange={onRangeDateChange}
                                                         /> :
                                            <DatePicker onChange={onDateChange}
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
