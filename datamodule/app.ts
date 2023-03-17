import fs from 'fs';
import { parse } from 'csv-parse';
import { Client } from '@elastic/elasticsearch';
import { GAME_SCHEMA } from './schemas/games';
import { IGame } from './interfaces/game';
import { ANALYZER_SETTINGS } from './schemas/settings';

const NUMBER_OF_GAMES = 100;

console.log('Starting');

interface IIndex {
    name: string;
    type: string;
    file: string;
    mapping: any;
    listFields: Array<string>;
    booleanFields: Array<string>;
}

const indices = [
    {
        name: 'games',
        type: 'game_type',
        file: 'steam.csv',
        mapping: GAME_SCHEMA,
        listFields: ['platforms', 'categories', 'steamspy_tags', 'genres'],
        booleanFields: ['english']
    }
] as Array<IIndex>;

const elasticUrl = process.env.ELASTIC_URL || 'http://localhost:9200';
const esclient = new Client({ node: elasticUrl });

const createIndex = async (index: IIndex) => {
    await esclient.indices.create({
        index: index.name,
        body: {
            mappings: index.mapping
            //settings: ANALYZER_SETTINGS
        }
    });
    console.log(`Created index ${index.name}`);
};

const insertRows = (index: IIndex) => {
    let dataFields = [] as Array<string>;
    let count = 0;
    fs.createReadStream(`./data/${index.file}`)
        .pipe(parse({ delimiter: ',', to_line: NUMBER_OF_GAMES + 1 }))
        .on('data', async (row) => {
            if (dataFields.length === 0) dataFields = row;
            else {
                let game: { [key: keyof IGame | string]: any } = {} as IGame;
                for (let i = 0; i < dataFields.length; i++) {
                    if (index.booleanFields.includes(dataFields[i])) game[dataFields[i]] = row[i] === '1';
                    else if (index.listFields.includes(dataFields[i])) game[dataFields[i]] = row[i].split(';');
                    else if (Number.isNaN(Number(row[i]))) game[dataFields[i]] = row[i];
                    else {
                        game[dataFields[i]] = Number(row[i]);
                    }
                }
                const res = await esclient.index({
                    index: index.name,
                    id: game.appid,
                    body: game
                });
                count++;
                console.log(`${count}/${NUMBER_OF_GAMES}`, game.name, 'inserted');
            }
        })
        .on('end', async () => {
            console.log('finished');
            await esclient.indices.refresh({ index: 'games' });
        })
        .on('error', (error) => {
            console.log(error.message);
        });
};

const handleInsert = async () => {
    for (let index of indices) {
        try {
            await createIndex(index);
            insertRows(index);
        } catch (err) {
            console.error(`An error occurred while creating the index "${index}":`);
            console.error(err);
        }
    }
};

const scanData = (fileName: string, fields: Array<string>) => {
    const arrayIndiciesMap: Map<string, number> = new Map();
    const fieldValuesMap: Map<string, Set<string>> = new Map();
    let isSet = false;
    fs.createReadStream(`./data/${fileName}`)
        .pipe(parse({ delimiter: ',' }))
        .on('data', async (row: Array<string>) => {
            if (!isSet) {
                for (const field of fields) {
                    arrayIndiciesMap.set(
                        field,
                        row.findIndex((value: string) => value === field)
                    );
                    fieldValuesMap.set(field, new Set());
                }
                isSet = true;
            } else {
                for (const field of fields) {
                    for (const value of row[arrayIndiciesMap.get(field)!].split(';')) {
                        fieldValuesMap.get(field)?.add(value);
                    }
                }
            }
        })
        .on('end', async () => {
            for (const field of fields) {
                let values = Array.from(fieldValuesMap.get(field) ?? []);
                values = values.sort((a, b) => a.localeCompare(b));
                console.log(field, values.length);
                console.log(field, values.join('" | "'));
                console.log('\n');
            }
            console.log('finished');
        })
        .on('error', (error) => {
            console.log(error.message);
        });
};

handleInsert();

// scanData('steam.csv', ['platforms', 'categories', 'steamspy_tags', 'owners', 'genres']);
