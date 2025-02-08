import { csv } from 'csv-parse';
import {createReadStream} from 'fs';

createReadStream('data.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

exports.readAndParseCSV = async function readAndParseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const data = [];
        createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            data.push(row);
        })
        .on('end', () => {
            resolve(data);
        });

    });
};