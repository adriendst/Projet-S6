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
    steamspy: string[]
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
    url : string
}


function getListeDeveloppeurs(data: Array<any>) {
    let listeDeveloppeurs: Array<string> = [];

    for (let i = 0; i < data.length; i++) {
        let developpeur = data[i].developer;
        if (!listeDeveloppeurs.includes(developpeur)) {
            listeDeveloppeurs.push(developpeur);
        }
    }

    return listeDeveloppeurs;
}

function getListePublishers(data: Array<any>) {
    let publishersList: Array<string> = [];

    for (let i = 0; i < data.length; i++) {
        let publisher = data[i].publisher;
        if (!publishersList.includes(publisher)) {
            publishersList.push(publisher);
        }
    }

    return publishersList;
}

function getListePlatforms(data: Array<any>) {
    let platformsList: Array<string> = [];
    for (let i = 0; i < data.length; i++) {
        const platforms = data[i].platforms
        for (let j = 0; j < platforms.length; j++) {
            if (!platformsList.includes(platforms[j])) {
                platformsList.push(platforms[j])
            }
        }
    }

    return platformsList;
}

function getListeCategories(data: Array<any>) {
    let platformsList: Array<string> = [];
    for (let i = 0; i < data.length; i++) {
        const platforms = data[i].categories
        for (let j = 0; j < platforms.length; j++) {
            if (!platformsList.includes(platforms[j])) {
                platformsList.push(platforms[j])
            }
        }
    }

    return platformsList;
}

function getListGenres() {
    let list: Array<string> = ['coucou'];
    fetch("http://localhost:9090/v1/genre/all")
        .then(response => response.json())
        .then(response => {
            list = list.concat(response);
            console.log(list);
            return list;
        })
        .catch(error => alert("Erreur : " + error));

}

function getListSteamSpy(data: Array<any>) {
    let platformsList: Array<string> = [];
    for (let i = 0; i < data.length; i++) {
        const platforms = data[i].steamspy
        for (let j = 0; j < platforms.length; j++) {
            if (!platformsList.includes(platforms[j])) {
                platformsList.push(platforms[j])
            }
        }
    }

    return platformsList;
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
            steamspy: []
        },
        displayType: false,
        game: [],
        developers: getListeDeveloppeurs(data),
        publishers: getListePublishers(data),
        platforms: ['windows','linux', 'mac'],
        categories: [],
        genres: [],
        steamspy: getListSteamSpy(data),
        searchPage: 2,
        url : 'http://localhost:9090/v1/game/filter/1?'
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
    changeUrl
} = Slice.actions;

export default Slice.reducer;
