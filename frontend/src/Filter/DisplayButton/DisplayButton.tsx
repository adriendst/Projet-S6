import {Button} from 'antd';
import React from 'react';
import {useDispatch} from "react-redux";
import {changeDisplayType} from "../../Slice/Slice";


const DisplayButton = () => {
    const dispatch = useDispatch()
    const onClick = () => {
        dispatch(changeDisplayType())
    };

    return (
            <Button onClick={onClick}>Change display</Button>
    );
};

export default DisplayButton;
