import fs from 'fs';
import { Client } from '@elastic/elasticsearch';
import type { Client as TypedClient } from '@elastic/elasticsearch/api/new';
import csv from 'csv-parser';
import { GAME_PROPERTIES } from './schemas/games';
import { ANALYZER_SETTINGS } from './schemas/settings';
import { DESCRIPTION_PROPERTIES } from './schemas/description';
import { SUPPORT_PROPERTIES } from './schemas/support';
import { MEDIA_PROPERTIES } from './schemas/media';
import { REQUIREMENTS_PROPERTIES } from './schemas/requirements';
import { transformer } from './utils/transformer';

interface IIndex {
    name: string;
    file: string;
    properties: any;
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
    {
        name: 'media',
        file: 'steam_media_data.csv',
        properties: MEDIA_PROPERTIES,
    },
    {
        name: 'requirements',
        file: 'steam_requirements_data.csv',
        properties: REQUIREMENTS_PROPERTIES,
    },
    {
        name: 'support',
        file: 'steam_support_info.csv',
        properties: SUPPORT_PROPERTIES,
    },
] as Array<IIndex>;

const elasticUrl = process.env.ELASTIC_URL || 'http://localhost:9200';
// @ts-expect-error @elastic/elasticsearch
const esclient: TypedClient = new Client({ node: elasticUrl });

async function prepare(indexData: IIndex, deleteIfExists: boolean): Promise<boolean> {
    const { body: exists } = await esclient.indices.exists({ index: indexData.name });
    if (exists) {
        if (!deleteIfExists) return false;
        await esclient.indices.delete({ index: indexData.name });
        console.log(`Deleted index ${indexData.name}`);
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
}

async function index(indexData: IIndex) {
    console.log(`Indexing data from ${indexData.file}`);
    const datastream = fs.createReadStream(`./data/${indexData.file}`);
    const datasource = datastream.pipe(csv()).pipe(transformer());

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
        refreshOnCompletion: indexData.name,
    });
    console.log(`Indexed ${body.total} documents from ${indexData.file} in ${body.time / 1000} seconds`);
}

async function run() {
    console.log('Starting...');
    for (let indexData of indices) {
        try {
            if (await prepare(indexData, false)) await index(indexData);
        } catch (err) {
            console.error(`An error occurred while with the index "${indexData.name}":`);
            console.error(err);
        }
    }
    console.log('Completed!');
}

run();
