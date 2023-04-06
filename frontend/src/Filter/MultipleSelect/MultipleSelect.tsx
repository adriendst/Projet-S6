import {Select} from 'antd';
import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {State} from "../../store";
import {Filter, updateFilters} from "../../Slice/Slice";

interface MultipleSelectInterface{
    filters : Filter,
    selectParam : string
}

const MultipleSelect = ({filters, selectParam} : MultipleSelectInterface) => {

    const dispatch = useDispatch()

    const steam =  useSelector((state: State) => state.steam) as Record<string, any>;
    const params = steam[selectParam.toLowerCase()]

    const filtersRecord = filters as Record<string,any>
    let filter = filtersRecord[selectParam.toLowerCase()]

    const [value, setValue] = useState<string[]>(filter)

    const placeholder = `Search a game by his ${selectParam.toLowerCase()}`

    const handleChange = (value: string[]) => {
        const newFilters = {...filters, [selectParam.toLowerCase()]: value};
        dispatch(updateFilters(newFilters));
        setValue(value);
    };

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
                filterOption={(input, option) =>
                    (option?.value as string ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={params.map((param : string) => {
                    return {value: param, label: param}
                })}
            />
        </div>
    );
};

export default MultipleSelect;
