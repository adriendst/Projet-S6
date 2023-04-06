import {Select} from 'antd';
import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {Filter, updateFilters} from "../../Slice/Slice";


interface MultipleSelectInterface{
    filters : Filter,
    selectParam : string
}

const MultipleSelectWithFuzzySearch = ({filters, selectParam} : MultipleSelectInterface) => {

    const dispatch = useDispatch()

    const filtersRecord = filters as Record<string,any>
    let filter = filtersRecord[selectParam.toLowerCase()]

    const [value, setValue] = useState<string[]>(filter)


    const placeholder = `Search a game by his ${selectParam.toLowerCase()}`

    const handleChange = (value: string[]) => {
        const newFilters = {...filters, [selectParam.toLowerCase()]: value};
        dispatch(updateFilters(newFilters));
        setValue(value);
    };

    const [filteredOptions, setFilteredOptions] = useState<{ value: string; label: string; }[]>([]);
    const test = (value: string)=> {
        let url;
        if(selectParam === 'Developers') {
             url = `http://localhost:9090/v1/developer/complete?searchText=${value}&results=20`;
        }
        else{
             url = `http://localhost:9090/v1/publisher/complete?searchText=${value}&results=20`
        }
        fetch(url)
            .then(response => response.json())
            .then(response => {
                setFilteredOptions(response.results ? response.results.map((r : string) => ({value : r, label : r})) : undefined);
            })
            .catch(error => alert("Erreur : " + error));
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
                options={filteredOptions}
            />
        </div>
    );
};

export default MultipleSelectWithFuzzySearch;
