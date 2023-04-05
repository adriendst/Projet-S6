import fs from 'fs';
import { Client } from '@elastic/elasticsearch';
import type { Client as TypedClient } from '@elastic/elasticsearch/api/new';
import csv from 'csv-parser';
import { transformer } from './utils/transformer';
import { GAME_MAPPINGS } from './schemas/games';
import { DESCRIPTION_MAPPINGS } from './schemas/description';
import { MEDIA_MAPPINGS } from './schemas/media';
import { REQUIREMENTS_MAPPINGS } from './schemas/requirements';
import { SUPPORT_MAPPINGS } from './schemas/support';
import { TypeMapping } from '@elastic/elasticsearch/api/types';
import { USER_MAPPINGS } from './schemas/user';

interface IIndex {
    name: string;
    file?: string;
    mappings: TypeMapping;
    settings?: Record<string, any>;
}

const indices: Array<IIndex> = [
    {
        name: 'games',
        file: 'steam.csv',
        mappings: GAME_MAPPINGS,
    },
    {
        name: 'description',
        file: 'steam_description_data.csv',
        mappings: DESCRIPTION_MAPPINGS,
    },
    {
        name: 'media',
        file: 'steam_media_data.csv',
        mappings: MEDIA_MAPPINGS,
    },
    {
        name: 'requirements',
        file: 'steam_requirements_data.csv',
        mappings: REQUIREMENTS_MAPPINGS,
    },
    {
        name: 'support',
        file: 'steam_support_info.csv',
        mappings: SUPPORT_MAPPINGS,
    },
    {
        name: 'user',
        mappings: USER_MAPPINGS,
    },
];

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
            mappings: indexData.mappings,
            settings: indexData.settings,
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
            if ((await prepare(indexData, true)) && indexData.file !== undefined) await index(indexData);
        } catch (err) {
            console.error(`An error occurred with the index "${indexData.name}":`);
            console.error(err);
            process.exit(1);
        }
    }
    console.log('Completed!');
}

run();
