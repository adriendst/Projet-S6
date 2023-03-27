import { configureStore } from '@reduxjs/toolkit';
import Reducer, {Steam} from './Slice/Slice';

export interface State {
    steam: Steam;
}

export default configureStore({
    reducer: {
        steam: Reducer,
    },
});
