import { BaseController } from './baseController.js';
import store from '../../core/mongoStore.js';

import path from "path";

import { stringify } from 'csv-stringify';


import fs, { createReadStream, createWriteStream, existsSync  } from "fs";
import { createGzip } from 'zlib';


import config from '../../../config.js';
import redisCache from '../../core/redisCache.js';
import validators from '../../helpers/validators.js';



const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const zipSingleFile = async (inputPath, outputPath) => {
    const read = createReadStream(inputPath);
    const write = createWriteStream(outputPath);
    const zip = createGzip();
    
    return new Promise((resolve, reject) => {
        read
            .pipe(zip)
            .pipe(write)
            .on('finish', resolve)
            .on('error', reject);
    });
};


export class Historical_download extends BaseController {

    constructor() {
        super(
            'historical_download',
            {
                parameters: [
                    'payload',
                    'status',
                ],
                sort: 'payload'
            }
        );
    }


    async add(req, res) {

        const { device, startTime, endTime } = req.body;

        let fileName = '';
        let new_file = null;
        let dataFound = false;

        const diffTime = Math.abs(new Date(endTime) - new Date(startTime));
        const arrayPayLoad = [device, startTime, endTime];

        const { isProcessing } = await this.knex(this.tableName).count('id as isProcessing').where({ status: 0 }).first();


        if (isProcessing) {

            return res.status(400).json({
                code: 400,
                message: 'An export operation is already in progress. Please try again later.'
            });
        }

        if (diffTime / (1000 * 3600 * 24) > 30) {
            return res.status(400).json({
                code: 400,
                message: 'The requested duration cannot exceed 30 days.'
            });
        }

        const historicalDir = path.join(config.workspaceDir, 'historical_download');

        // Controlla se la directory esiste, altrimenti la crea
        if (!fs.existsSync(historicalDir)) {
            fs.mkdirSync(historicalDir, { recursive: true }); // Crea la directory
        }


        try {
            
              // handshake

              const { totalItems } = await store.getCountMessages({
                devicesIds: [String(device)],
                startTime: startTime,
                endTime: endTime,
            });


            if (!totalItems) {

                if (!dataFound) {
                    return res.status(400).json({
                        code: 400,
                        message: 'No data found for the selected period.'

                    });
                }
            }
        } catch (error) {
            console.error( error );
        }


        try {

    

            const data = await this.knex(this.tableName).count('* as count');

            if (data[0].count > 4) {

                const oldestRecord = await this.knex(this.tableName).select('id').orderBy('createdAt', 'asc').first(); // Prendi il più vecchio

                await this.knex.transaction(async (trx) => {
                    const effectedEntity = this.paranoid
                        ? await trx(this.tableName)
                            .del()
                            .where('id', oldestRecord.id) // Usa where correttamente
                        : await trx(this.tableName)
                            .del()
                            .where('id', oldestRecord.id); // Usa where correttamente

                    if (!effectedEntity) {
                        throw new Error(`${this.tableName} delete error`);
                    }

                    // Aggiungi il log dell'operazione di delete
                    await trx('logs').insert({
                        userId: req.auth.id,
                        entity: this.tableName,
                        entityId: oldestRecord.id,
                        operation: 'delete'
                    });
                });
                const file_oldestRecord = `${historicalDir}/${oldestRecord.id}.json`;

                // Verifica se il file esiste prima di eliminarlo
                if (fs.existsSync(file_oldestRecord)) {
                    fs.unlinkSync(file_oldestRecord); // Elimina il file
                } else {
                    console.log(`File ${file_oldestRecord} does not exist.`);
                }
            }

            new_file = await this.addRow(req, {
                payload: JSON.stringify(arrayPayLoad),
            });

            

            if (!new_file) {

                return res.status(500).json({
                    code: 413,
                    message: 'Error during processing.',
                    error

                });
            }

            fileName = `${new_file.id}.csv`

            const filePath = path.join(historicalDir, fileName);

            //Create File

            redisCache.setStatus({ export: 1 }, 'upgrader');

            res.status(200).json({ message: 'Export started', device, startTime, endTime });

            let count = 1;
            //let fileData = [];

            const { headers } = await store.getHeadersMessages({
                devicesIds: [String(device)]
            });


            if ( headers ){

                const writableStream = fs.createWriteStream(filePath);

                const stringifier = stringify({
                    header: true,
                    columns: ['timestamp', ...headers ],
                    delimiter: ',',
                    quote: '"',
                    escape: '"'
                });

                stringifier.pipe(writableStream);


                //fs.writeFileSync(filePath, ['timestamp', ...headers ].join(','));

                while (true) {

                    const options = {
                        devicesIds: [String(device)],
                        startTime: startTime,
                        endTime: endTime,
                        pageNumber: count,
                        pageSize: 100
                    };
    
                    const p = await store.getMessages(options);
    
                    if (!p?.messages || p.messages.length === 0) {
                        break;
                    }
    
                
                    p.messages.map( item => {
    
                        const date = new Date(item.timestamp);
                        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    
                        const a = [ formattedDate ];
                        const {data} = item
    
                        for (const key in data) {
                            if (Object.prototype.hasOwnProperty.call(data, key)) {
    
                                const value = data[key];
                                a.push(`${value}`.trim() )
                            }
                        }
                        
                        stringifier.write( a );

                    } );

                    count++;
    
                    await delay(100);
                }

                stringifier.end();
            }

            redisCache.setStatus({ export: 2 }, 'upgrader');


        } catch (error) {

            console.error(error);

            return res.status(500).json({
                code: 410,
                message: 'Error during processing.',
                error

            });
        } finally {

            if (new_file?.id ){
                await this.editRow(req, new_file.id, { status: 1 })
            }
            
        }
    }
    

    // async add(req, res) {

    //     const { device, startTime, endTime } = req.body;

    //     let fileName = '';
    //     let new_file = null;
    //     let dataFound = false;

    //     const diffTime = Math.abs(new Date(endTime) - new Date(startTime));
    //     const arrayPayLoad = [device, startTime, endTime];

    //     const { isProcessing } = await this.knex(this.tableName).count('id as isProcessing').where({ status: 0 }).first();


    //     if (isProcessing) {

    //         return res.status(400).json({
    //             code: 400,
    //             message: 'An export operation is already in progress. Please try again later.'
    //         });
    //     }

    //     if (diffTime / (1000 * 3600 * 24) > 30) {
    //         return res.status(400).json({
    //             code: 400,
    //             message: 'The requested duration cannot exceed 30 days.'
    //         });
    //     }


    //     try {

    //         const historicalDir = path.join(config.workspaceDir, 'historical_download');

    //         // Controlla se la directory esiste, altrimenti la crea
    //         if (!fs.existsSync(historicalDir)) {
    //             fs.mkdirSync(historicalDir, { recursive: true }); // Crea la directory
    //         }


    //         // handshake

    //         const { totalItems } = await store.getCountMessages({
    //             devicesIds: [String(device)],
    //             startTime: startTime,
    //             endTime: endTime,
    //         });


    //         if (!totalItems) {

    //             if (!dataFound) {
    //                 return res.status(404).json({
    //                     code: 400,
    //                     message: 'No data found for the selected period.'

    //                 });
    //             }
    //         }


    //         const data = await this.knex(this.tableName).count('* as count');

    //         if (data[0].count > 4) {

    //             const oldestRecord = await this.knex(this.tableName).select('id').orderBy('createdAt', 'asc').first(); // Prendi il più vecchio

    //             await this.knex.transaction(async (trx) => {
    //                 const effectedEntity = this.paranoid
    //                     ? await trx(this.tableName)
    //                         .del()
    //                         .where('id', oldestRecord.id) // Usa where correttamente
    //                     : await trx(this.tableName)
    //                         .del()
    //                         .where('id', oldestRecord.id); // Usa where correttamente

    //                 if (!effectedEntity) {
    //                     throw new Error(`${this.tableName} delete error`);
    //                 }

    //                 // Aggiungi il log dell'operazione di delete
    //                 await trx('logs').insert({
    //                     userId: req.auth.id,
    //                     entity: this.tableName,
    //                     entityId: oldestRecord.id,
    //                     operation: 'delete'
    //                 });
    //             });
    //             const file_oldestRecord = `${historicalDir}/${oldestRecord.id}.json`;

    //             // Verifica se il file esiste prima di eliminarlo
    //             if (fs.existsSync(file_oldestRecord)) {
    //                 fs.unlinkSync(file_oldestRecord); // Elimina il file
    //             } else {
    //                 console.log(`File ${file_oldestRecord} does not exist.`);
    //             }

    //         }

    //         new_file = await this.addRow(req, {
    //             payload: JSON.stringify(arrayPayLoad),
    //         });

    //         if (!new_file) {

    //             return res.status(500).json({
    //                 code: 413,
    //                 message: 'Error during processing.',
    //                 error

    //             });
    //         }

    //         fileName = `${new_file.id}.xlsx`

    //         const filePath = path.join(historicalDir, fileName);

    //         //Create File

    //         redisCache.setStatus({ export: 1 }, 'upgrader');

    //         res.status(200).json({ message: 'Export started', device, startTime, endTime });

    //         let count = 1;
    //         //let fileData = [];


    //         const workbook = XLSX.utils.book_new();
            
    //         // Create the worksheet only once, before the loop
    //         const worksheet = XLSX.utils.aoa_to_sheet([]);

    //         XLSX.utils.book_append_sheet(workbook, worksheet, 'Historical Data');

    //         await XLSX.writeFile(workbook, `${filePath}`);  


    //         while (true) {

    //             const options = {
    //                 devicesIds: [String(device)],
    //                 startTime: startTime,
    //                 endTime: endTime,
    //                 pageNumber: count,
    //                 pageSize: 100
    //             };

    //             const p = await store.getMessages(options);

    //             if (!p?.messages || p.messages.length === 0) {
    //                 break;
    //             }

            
    //             const newData =  p.messages.map( item => {

    //                 const date = new Date(item.timestamp);
    //                 const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

    //                 const a = [ formattedDate ];
    //                 const {data} = item

    //                 for (const key in data) {
    //                     if (Object.prototype.hasOwnProperty.call(data, key)) {

    //                         const { value, measureUnit } = data[key];
    //                         a.push(`${value} ${measureUnit ?? '' }`.trim() )
    //                     }
    //                 }

    //                 return a;

    //             } );

    //             appendRowsToExcelStream( filePath, newData)


    //             count++;

    //             await delay(100);
    //         }

    //         //await this.editRow(req, new_file.id, { status: 1 })

    //         XLSX.writeFile(workbook, `${filePath}`);  

    //         redisCache.setStatus({ export: 2 }, 'upgrader');


    //     } catch (error) {

    //         console.error(error);

    //         return res.status(500).json({
    //             code: 410,
    //             message: 'Error during processing.',
    //             error

    //         });
    //     } finally {
    //         //isProcessing = false;
    //         await this.editRow(req, new_file.id, { status: 1 })
    //     }
    // }



    async getAll(req, res) {
        try {
            const allDownload = await this.knex(this.tableName);
            return res.status(200).json({
                data: allDownload
            });
        } catch (error) {
            console.log(error);
        }
    }


    async startDownload(req, res) {

        const { id } = req.params;

        if (!validators.validateId(id)) {
            return res.status(420).json({
                code: 420,
                message: `Invalid id`
            });
        }

        try {
            const obj = await this.knex(this.tableName).where({id}).first();

            if (!obj) {
                return res.status(404).json({
                    code: 404,
                    message: `A Element with this id: ${id} does not exist.`
                });
            }
        } catch (error) {

            console.error(error);

            return res.status(500).json(
                { error }
            );
        }


        const historicalDir = path.join(config.workspaceDir, 'historical_download');

        const filename = path.join(historicalDir, `${id}.gz`);

        if ( !existsSync(filename) ){

            try {
                await zipSingleFile( path.join(historicalDir, `${id}.csv`), filename);
            } catch (error) {
    
                console.error( error );
                
                return res.status(500).json(
                    { error }
                );
            }
        }


         // Imposta gli header per il download
        res.setHeader('Content-Type', 'application/gzip');
        res.setHeader('Content-Disposition', 'attachment; filename="historical-data.gz"');
        
        
        // Stream del file al client
        // const fileStream = createReadStream(filename);
        // fileStream.pipe(res);

        res.download(filename, (err) => {

            if (err) {
                console.error('Download error:', err);
                res.status(500).send('Error downloading file');
            }
            else{
                redisCache.setStatus({ export: 0 }, 'upgrader');
            }
        });
    }
    
        // async startDownload(req, res) {
    
        //     const { id } = req.params;
    
        //     const historicalDir = path.join(config.workspaceDir, 'historical_download');
            
        //     // Controlla se la directory esiste, altrimenti la crea
        //     if (!fs.existsSync(historicalDir)) {
        //         fs.mkdirSync(historicalDir, { recursive: true }); // Crea la directory
        //     }
    
    
        //     const file_name = `${historicalDir}/${id}.json`;
    
        //     if (!validators.validateId(id)) {
        //         return res.status(404).json({
        //             code: 404,
        //             message: `A Element with this id: ${id} does not exist.`
        //         });
    
        //     }
    
    
        //     try {
        //         const obj = await this.knex(this.tableName).where({id}).first();
    
        //         if (!obj) {
        //             return res.status(404).json({
        //                 code: 404,
        //                 message: `A Element with this id: ${id} does not exist.`
        //             });
        //         }
        //     } catch (error) {
    
        //         console.log(error);
        //         return res.status(500).json(
        //             { error }
        //         );
        //     }
    
        //     if (!fs.existsSync(file_name)) {
        //         return res.status(404).json({ error: 'File not found' });
        //     }
    
          
        //     try {
    
        //         // Leggere il contenuto del file
        //         const fileContent = fs.readFileSync(file_name, 'utf8');
    
        //         // Convertire il contenuto del file in un oggetto JSON
        //         const historicalData = JSON.parse(fileContent);
    
            
        //         // Array per memorizzare i dati del foglio di lavoro
        //         const worksheetData = [];
    
        //         // Set per raccogliere tutte le chiavi dei campi (es. DST Status, DST Status_copy, ecc.)
        //         const allKeys = new Set();
    
        //         // Estrazione di tutte le chiavi dai valori dei timestamp
        //         Object.values(historicalData).forEach(dataObject => {
    
        //             Object.keys(dataObject.data).forEach(key => {
        //                 allKeys.add(key); // Aggiungere la chiave alla lista delle colonne
        //             });
        //         });
    
    
    
        //         // La prima riga del foglio di lavoro contiene il timestamp e i nomi delle colonne
        //         const headers = ['Timestamp', ...Array.from(allKeys)];
        //         worksheetData.push(headers);
    
    
    
        //         //console.log(Object.keys(historicalData));
    
    
    
        //         // Itera su historicalData e costruisci le righe
        //         historicalData.forEach(dataObject => {
        //             const date = new Date(dataObject.timestamp);
        //             const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    
        //             // La prima colonna è la data formattata
    
        //             const row = [formattedDate];  // La prima colonna è il timestamp
    
        //             // Per ogni chiave (DST Status, Time zone, etc.)
        //             Array.from(allKeys).forEach(key => {
        //                 const value = dataObject.data[key]?.value;
        //                 // Se il valore è null, inserisci la stringa "null", altrimenti prendi il valore effettivo
        //                 const cellValue = value === null ? "null" : value;
    
        //                 row.push(cellValue);  // Aggiungi il valore (null rappresentato come "null", altrimenti il valore effettivo)
        //             });
    
    
        //             worksheetData.push(row);  // Aggiungi la riga al foglio di lavoro
        //         });
    
    
        //         // Crea il foglio Excel
        //         const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        //         const workbook = XLSX.utils.book_new();
        //         XLSX.utils.book_append_sheet(workbook, worksheet, 'Historical Data');
    
        //         // Scrivi il file Excel
        //         const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'XLSX' });
    
        //         // Rispondi con il file Excel
        //         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        //         res.setHeader('Content-Disposition', 'attachment; filename="historical_data.XLSX"');
    
        //         //req.core.downloadFinish();
        //         redisCache.setStatus({export : 0}, 'upgrader');
    
        //         res.status(200).send(excelBuffer);
    
        //         console.log('File Excel inviato con successo');
    
        //     } catch (error) {
        //         console.error('Errore durante la generazione dell\'Excel:', error);
        //         res.status(500).send({ status: 'error', message: 'Impossibile generare il file Excel' });
        //     }
        // }
    



}

export default new Historical_download();