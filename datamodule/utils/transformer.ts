import { Transform } from 'stream';
import JSON5 from 'json5';

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
            callback(null, transformedChunk);
        },
    });
}
