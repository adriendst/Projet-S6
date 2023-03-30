import {createSlice} from '@reduxjs/toolkit'
import data from '../data.json'

export interface Filter {
    name: string,
    dateByYear : boolean,
    dateByRange : boolean
    release_date: Date[],
    developers: string[],
    publishers: string[],
    platforms: string[],
    required_age: number | undefined,
    categories: string[],
    genres: string[],
    steamspy: string[]
}

export interface Game {
    id: number,
    name: string,
    release_date: string,
    developer: string,
    publisher: string,
    platforms: string[],
    required_age: number,
    categories: string[],
    genres: string[],
    steamspy: string[],
    header_image : string,
}

export interface Steam {
    filter: Filter
    displayType : boolean
    game : Game[],
    developers : [],
    publishers : [],
    platforms : [],
    categories : [],
    genres: [],
    steamspy : []
}


function getListeDeveloppeurs(data : Array<any>) {
    let listeDeveloppeurs: Array<string> = [];

    for (let i = 0; i < data.length; i++) {
        let developpeur = data[i].developer;
        if (!listeDeveloppeurs.includes(developpeur)) {
            listeDeveloppeurs.push(developpeur);
        }
    }

    return listeDeveloppeurs;
}

function getListePublishers(data : Array<any>) {
    let publishersList: Array<string> = [];

    for (let i = 0; i < data.length; i++) {
        let publisher = data[i].publisher;
        if (!publishersList.includes(publisher)) {
            publishersList.push(publisher);
        }
    }

    return publishersList;
}

function getListePlatforms(data : Array<any>) {
    let platformsList: Array<string> = [];
    for(let i = 0; i<data.length; i++){
        const platforms = data[i].platforms
        for(let j = 0; j<platforms.length; j++){
            if(!platformsList.includes(platforms[j])){
                platformsList.push(platforms[j])
            }
        }
    }

    return platformsList;
}

function getListeCategories(data : Array<any>) {
    let platformsList: Array<string> = [];
    for(let i = 0; i<data.length; i++){
        const platforms = data[i].categories
        for(let j = 0; j<platforms.length; j++){
            if(!platformsList.includes(platforms[j])){
                platformsList.push(platforms[j])
            }
        }
    }

    return platformsList;
}

function getListGenres(data : Array<any>) {
    let platformsList: Array<string> = [];
    for(let i = 0; i<data.length; i++){
        const platforms = data[i].genres
        for(let j = 0; j<platforms.length; j++){
            if(!platformsList.includes(platforms[j])){
                platformsList.push(platforms[j])
            }
        }
    }

    return platformsList;
}

function getListSteamSpy(data : Array<any>) {
    let platformsList: Array<string> = [];
    for(let i = 0; i<data.length; i++){
        const platforms = data[i].steamspy
        for(let j = 0; j<platforms.length; j++){
            if(!platformsList.includes(platforms[j])){
                platformsList.push(platforms[j])
            }
        }
    }

    return platformsList;
}
let coucou = 0;
const test = () => {
    return coucou++
}

export const Slice = createSlice({
    name: 'steam',
    initialState: {
        filter : {
            name: '',
            dateByYear : false,
            dateByRange : false,
            release_date: [],
            developers: ['test', 'coucou'],
            publishers: [],
            platforms: [],
            required_age: undefined,
            categories: [],
            genres: [],
            steamspy: []
        },
        displayType : false,
        game : data,
        developers : getListeDeveloppeurs(data),
        publishers : getListePublishers(data),
        platforms : getListePlatforms(data),
        categories : getListeCategories(data),
        genres : getListGenres(data),
        steamspy : getListSteamSpy(data),
        test : test()
    },
    reducers: {
        changeDisplayType: (state: { displayType: boolean }) => {
            state.displayType = !state.displayType;
        },
        updateFilters : (state : {filter : Filter, test : number}, action: { payload : Filter}) => {
            state.filter = action.payload
            state.test = test()
        },
        changeDateByYear : (state : {filter : Filter}) => {
            state.filter.dateByYear = !state.filter.dateByYear
        },
        changeDateByRange : (state : {filter : Filter}) => {
            state.filter.dateByRange = !state.filter.dateByRange
        },
        // loadGames: (state: {game: Game[]}) => {
        //     state.game.push(...data);
        // },
    },
});


export const {changeDisplayType, updateFilters, changeDateByYear, changeDateByRange} = Slice.actions;

export default Slice.reducer;
