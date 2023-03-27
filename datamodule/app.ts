import fs from 'fs';
import { parse } from 'csv-parse';
import { Client } from '@elastic/elasticsearch';
import type { Client as TypedClient } from '@elastic/elasticsearch/api/new';
import csv from 'csv-parser';
import JSON5 from 'json5';
import { Transform } from 'stream';
import { GAME_PROPERTIES } from './schemas/games';
import { ANALYZER_SETTINGS } from './schemas/settings';
import { DESCRIPTION_PROPERTIES } from './schemas/description';
import { SUPPORT_PROPERTIES } from './schemas/support';
import { MEDIA_PROPERTIES } from './schemas/media';
import { REQUIREMENTS_PROPERTIES } from './schemas/requirements';

const NUMBER_OF_GAMES = 100;

interface IIndex {
    name: string;
    file: string;
    properties: any;
    // type: string;
    // listFields: Array<string>;
    // booleanFields: Array<string>;
}

const indices = [
    {
        name: 'games',
        file: 'steam.csv',
        properties: GAME_PROPERTIES,
    },
    {
        name: 'description',
        file: 'steam_description_data.csv',
        properties: DESCRIPTION_PROPERTIES,
    },
    // {
    //     name: 'media',
    //     file: 'steam_media_data.csv',
    //     properties: MEDIA_PROPERTIES,
    // },
    // {
    //     name: 'requirements',
    //     file: 'steam_requirements_data.csv',
    //     properties: REQUIREMENTS_PROPERTIES,
    // },
    // {
    //     name: 'support',
    //     file: 'steam_support_info.csv',
    //     properties: SUPPORT_PROPERTIES,
    // },
    // {
    //     name: 'steamspy',
    //     file: 'steamspy_tag_data.csv',
    //     properties: DESCRIPTION_PROPERTIES,
    // },
] as Array<IIndex>;

const elasticUrl = process.env.ELASTIC_URL || 'http://localhost:9200';
// @ts-expect-error @elastic/elasticsearch
const esclient: TypedClient = new Client({ node: elasticUrl });

const prepare = async (indexData: IIndex, deleteIfExists: boolean): Promise<boolean> => {
    const { body: exists } = await esclient.indices.exists({ index: indexData.name });
    if (exists) {
        if (!deleteIfExists) return false;
        await esclient.indices.delete({ index: indexData.name });
    }

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
    return true;
};

const transformer = new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
        const transformedChunk = { ...chunk };
        if (chunk.appid === undefined) {
            transformedChunk.appid = chunk.steam_appid;
            delete transformedChunk.steam_appid;
        }
        for (let json of ['screenshots', 'movies', 'pc_requirements', 'mac_requirements', 'linux_requirements']) {
            if (chunk[json] !== undefined) {
                if (chunk[json].length === 0) transformedChunk[json] = [];
                else transformedChunk[json] = JSON5.parse(chunk[json].replace(/True/g, 'true').replace(/False/g, 'false'));
            }
        }
        callback(null, transformedChunk);
    },
});

async function index(indexData: IIndex) {
    console.log(`Indexing data from ${indexData.file}`);
    const datasource = fs.createReadStream(`./data/${indexData.file}`).pipe(csv()).pipe(transformer);
    const body = await esclient.helpers.bulk<{ appid: string }>({
        datasource,
        onDocument(doc) {
            return {
                index: { _index: indexData.name, _id: doc.appid },
            };
        },
        onDrop(doc) {
            console.log(`Can't index document with id ${doc.document.appid}!`, doc);
            process.exit(1);
        },
        // refreshOnCompletion: indexData.name,
    });
    console.log(`Indexed ${body.total} documents from ${indexData.file} in ${body.time / 1000} seconds`);
}

const run = async () => {
    console.log('Starting...');
    for (let indexData of indices) {
        try {
            if (await prepare(indexData, true)) await index(indexData);
        } catch (err) {
            console.error(`An error occurred while creating the index "${indexData.name}":`);
            console.error(err);
        }
    }
    console.log('Completed!');
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
