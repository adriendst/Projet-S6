import {createSlice} from '@reduxjs/toolkit'
import data from '../data.json'

export interface Filter {
    name: string | undefined,
    dateByYear: boolean,
    dateByRange: boolean
    release_date: string[],
    developers: string[],
    publishers: string[],
    platforms: string[],
    required_age: number | undefined,
    categories: string[],
    genres: string[],
    steamspy: string[],
    order_by : string | undefined,
    order_type : string | undefined,
    and_platforms : string | undefined
}

export interface Game {
    appid: number,
    name: string,
    release_date: string,
    english: boolean,
    developer: string,
    publisher: string,
    platforms: string[],
    required_age: number,
    categories: string[],
    genres: string[],
    steamspy_tags: string[],
    achievements: number,
    positive_ratings: number,
    negative_ratings: number,
    average_playtime: number,
    median_playtime: number,
    owners: string,
    price: number
}

export interface Steam {
    filter: Filter
    displayType: boolean
    game: Game[],
    developers: [],
    publishers: [],
    platforms: [],
    categories: [],
    genres: [],
    steamspy: [],
    searchPage: number,
    url : string,
    refreshToken : string | undefined
}


export const Slice = createSlice({
    name: 'steam',
    initialState: {
        filter: {
            name: undefined,
            dateByYear: false,
            dateByRange: false,
            release_date: [],
            developers: [],
            publishers: [],
            platforms: [],
            required_age: undefined,
            categories: [],
            genres: [],
            steamspy: [],
            order_by : undefined,
            order_type: undefined,
            and_platforms : undefined
        },
        displayType: false,
        game: [],
        developers: [],
        publishers: [],
        platforms: ['windows','linux', 'mac'],
        categories: [],
        genres: [],
        steamspy: [],
        searchPage: 2,
        url : 'http://localhost:9090/v1/game/filter/1?',
        refreshToken : undefined
    },
    reducers: {
        changeDisplayType: (state: { displayType: boolean }) => {
            state.displayType = !state.displayType;
        },
        updateFilters: (state: { filter: Filter}, action: { payload: Filter }) => {
            state.filter = action.payload
        },
        changeDateByYear: (state: { filter: Filter }) => {
            state.filter.dateByYear = !state.filter.dateByYear
        },
        changeDateByRange: (state: { filter: Filter }) => {
            state.filter.dateByRange = !state.filter.dateByRange
            state.filter.release_date = []
        },
        loadGames: (state: { game: Game[], searchPage: number }, action: { payload: [Game[], number] }) => {
            if (action.payload[1] < 3) {
                state.game = action.payload[0]
            } else {
                state.game = state.game.concat(action.payload[0]);
            }
            state.searchPage = action.payload[1]

        },
        loadGenres: (state: { genres: string[] }, action: { payload: [] }) => {
            state.genres = action.payload
        },
        loadCategories: (state: { categories: string[] }, action: { payload: [] }) => {
            state.categories = action.payload
        },
        changeUrl : (state : {url : string}, action : {payload : string})=> {
            state.url = action.payload
        },
        userConnection : (state : {refreshToken : string | undefined}, action : {payload : string | undefined}) => {
            state.refreshToken = action.payload
        }
    },
});


export const {
    changeDisplayType,
    updateFilters,
    changeDateByYear,
    changeDateByRange,
    loadGames,
    loadGenres,
    loadCategories,
    changeUrl,
    userConnection
} = Slice.actions;

export default Slice.reducer;
