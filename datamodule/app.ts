import fs from 'fs';
import { parse } from 'csv-parse';
import { Client } from '@elastic/elasticsearch';
import type { Client as TypedClient } from '@elastic/elasticsearch/api/new';
import { GAME_PROPERTIES } from './schemas/games';
import { IGame } from './interfaces/game';
import csv from 'csv-parser';
import { ANALYZER_SETTINGS } from './schemas/settings';

const NUMBER_OF_GAMES = 100;

console.log('Starting');

interface IIndex {
    name: string;
    file: string;
    properties: any;
    type: string;
    listFields: Array<string>;
    booleanFields: Array<string>;
}

const indices = [
    {
        name: 'games',
        file: 'steam.csv',
        properties: GAME_PROPERTIES,
        type: 'game_type',
        listFields: ['platforms', 'categories', 'steamspy_tags', 'genres'],
        booleanFields: ['english'],
    },
] as Array<IIndex>;

const elasticUrl = process.env.ELASTIC_URL || 'http://localhost:9200';
// @ts-expect-error @elastic/elasticsearch
const esclient: TypedClient = new Client({ node: elasticUrl });

const prepare = async (indexData: IIndex) => {
    const { body: exists } = await esclient.indices.exists({ index: indexData.name });
    if (exists) return;

    await esclient.indices.create({
        index: indexData.name,
        body: {
            mappings: {
                dynamic: 'strict',
                properties: indexData.properties,
            },
            //settings: ANALYZER_SETTINGS
        },
    });
    console.log(`Created index ${indexData.name}`);
};

const index = async (indexData: IIndex) => {
    const datasource = fs.createReadStream(`./data/${indexData.file}`).pipe(csv());
    await esclient.helpers.bulk<IGame>({
        datasource,
        onDocument(doc) {
            return {
                index: { _index: indexData.name, _id: doc.appid },
            };
        },
        onDrop(doc) {
            console.log(`Can't index document with id ${doc.document.appid}!`, doc.error);
            process.exit(1);
        },
        refreshOnCompletion: indexData.name,
    });
};

const run = async () => {
    for (let indexData of indices) {
        try {
            await prepare(indexData);
            await index(indexData);
        } catch (err) {
            console.error(`An error occurred while creating the index "${index}":`);
            console.error(err);
        }
    }
};

run();

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
                        row.findIndex((value: string) => value === field),
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

// scanData('steam.csv', ['platforms', 'categories', 'steamspy_tags', 'owners', 'genres']);
