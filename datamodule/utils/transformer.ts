import { Transform } from 'stream';
import JSON5 from 'json5';

const booleanFields = ['english'];
const numberFields = ['required_age', 'achievements', 'positive_ratings', 'negative_ratings', 'average_playtime', 'median_playtime', 'price'];
const listFields = ['platforms', 'categories', 'steamspy_tags', 'genres'];
const jsonFields = ['screenshots', 'movies', 'pc_requirements', 'mac_requirements', 'linux_requirements'];

export function transformer(): Transform {
    return new Transform({
        objectMode: true,
        transform(chunk, encoding, callback) {
            const transformedChunk = { ...chunk };
            if (chunk.appid === undefined) {
                transformedChunk.appid = chunk.steam_appid;
                delete transformedChunk.steam_appid;
            }
            for (let jsonField of jsonFields) {
                if (chunk[jsonField] !== undefined) {
                    if (chunk[jsonField].length === 0) transformedChunk[jsonField] = [];
                    else transformedChunk[jsonField] = JSON5.parse(chunk[jsonField].replace(/True/g, 'true').replace(/False/g, 'false'));
                }
            }
            for (let booleanField of booleanFields) {
                if (chunk[booleanField] !== undefined) {
                    transformedChunk[booleanField] = chunk[booleanField] === '1';
                }
            }
            for (let listField of listFields) {
                if (chunk[listField] !== undefined) {
                    transformedChunk[listField] = chunk[listField].split(';');
                }
            }
            for (let numberField of numberFields) {
                if (chunk[numberField] !== undefined) {
                    transformedChunk[numberField] = Number(chunk[numberField]);
                }
            }
            callback(null, transformedChunk);
        },
    });
}
