import {Select} from 'antd';
import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {State} from "../../store";
import {Filter, updateFilters} from "../../Slice/Slice";
import Fuse from "fuse.js";

interface MultipleSelectInterface{
    filters : Filter,
    selectParam : string
}

const MultipleSelectWithFuzzySearch = ({filters, selectParam} : MultipleSelectInterface) => {

    const dispatch = useDispatch()

    const steam =  useSelector((state: State) => state.steam) as Record<string, any>;
    const params = steam[selectParam.toLowerCase()]

    const filtersRecord = filters as Record<string,any>
    let filter = filtersRecord[selectParam.toLowerCase()]

    const [value, setValue] = useState<string[]>(filter)

    const options = {
        includeScore: true,
        keys:['name']
    };

    const fuse = new Fuse(params.map((param : string) => {
        return param
    }), options)

    const placeholder = `Search a game by his ${selectParam.toLowerCase()}`

    const handleChange = (value: string[]) => {
        console.log(`Selected: ${value}`);
        const newFilters = {...filters, [selectParam.toLowerCase()]: value};
        dispatch(updateFilters(newFilters));
        setValue(value);
    };

    const [filteredOptions, setFilteredOptions] = useState<{ value: string; label: string; }[]>([]);
    const [search, setSearch] = useState<string>('');
    const test = (value: string)=> {
        const result = fuse.search(value);
        const filteredOptions = result.map((r) => ({value: r.item as string, label: r.item as string}));
        setFilteredOptions(filteredOptions);
        setSearch(value)
    }

    return (
        <div className={'divInput'}>
            <div>{selectParam}</div>
            <Select
                mode={"multiple"}
                showSearch
                value={value}
                className={'inputSize'}
                placeholder= {placeholder}
                onChange={handleChange}
                onSearch={test}
                filterOption={false}
                options={search !== '' ? filteredOptions : params.map((param : string) => {
                    return {label : param, value : param}
                })}
            />
        </div>
    );
};

export default MultipleSelectWithFuzzySearch;
