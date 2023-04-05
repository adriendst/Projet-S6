import fs from 'fs';
import { parse } from 'csv-parse';

/**
 * Gives a list of all the values for specific fields
 *
 * @param fileName The file to check
 * @param fields The fields for which to get all the possible values
 */
export const scanData = (fileName: string, fields: Array<string>) => {
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
