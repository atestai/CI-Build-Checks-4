import path from "path";
import os from "os";
import fs from "fs";
import importConfig from "../../helpers/importConfig.js";
import SystemInfo from '../../helpers/systemInfo.js';
import validators from '../../helpers/validators.js';
import cache from "../../cache.js";
import redisCache from "../../core/redisCache.js";

import knexConnect from 'knex';
import config from '../../../config.js';




export default {

    async exportData(req, res) {

        const { contentType = 'excel', table } = req.query; // Aggiunto parametro "table"
        const tempFileName = 'export.' + ((contentType === 'excel') ? 'xlsx' : 'json');
        const tempFilePath = path.join(os.tmpdir(), tempFileName);

        try {
            // Configuriamo le opzioni per l'esportazione
            const exportOptions = {
                contentType
            };

            // Se viene passato il parametro "table", lo usiamo. Altrimenti esportiamo tutte le tabelle.
            if (table) {
                exportOptions.tables = [table];
            }

            await importConfig.export(tempFilePath, exportOptions);



            if (contentType === 'excel') {
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename="export.xlsx"');
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Content-Disposition', 'attachment; filename="export.json"');
            }
    
            
            res.download(tempFilePath, (err) => {

                if (err) {
                    console.error('Download error:', err);
                    res.status(500).send('Error downloading file');
                } else {
                    fs.unlink(tempFilePath, () => { });
                }

            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error });
        }
    },


    async importDataV2(req, res) {

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files loaded.');
        }

        const file = req.files.file;

        try {

            const contentString = file.data.toString('utf8');

            try {

                const { localCache, errors } = (file.mimetype === 'application/json') ?
                    await importConfig.importJson(JSON.parse(contentString)) :
                    await importConfig.importExcel(file.data);


                await cache.load(); // Ricarica la cache

                await redisCache.publish( 'settings.reconfigure' ,  true );
          
                return res.json({
                    localCache,
                    errors
                });

            } catch (err) {
                console.error('Errore durante il parsing del contenuto:', err);
                res.status(500).send('Error reading or parsing the file.');
            }
        

        } catch (error) {

            console.log(error);
            return res.status(500).json(
                { error }
            );

        }
    },


    async importData(req, res) {

        const { localCache, errors } = await importConfig.import(`./geko5-configuration_v1_export.xlsx`);

        res.status(200).send({
            localCache,
            errors
        });
    },


    async getPlcStatus(req, res) {

        try {

            const { core } = req;

            const data = await core.getPlcStatus()

            //console.log( data.value );

            if (data?.value) {
                return res.status(200).json({
                    value: data.value
                });
            }
        } catch (error) {
            console.log(error);
        }

        res.status(500).send();
    },


    async setPlcStatus(req, res) {

        const { value = undefined } = req.body

        if (value !== undefined) {

            try {

                const { core } = req;

                await core.setPlcStatus(value)

                return res.status(204).send();

            } catch (error) {
                console.log(error);
                res.status(500).json({ error });
            }

        }


    },


    async setSystemStatus(req, res) {

        const { status } = req.params;


        if (['start', 'stop', 'restart'].includes(status)) {

            const { core } = req;

            //console.log( status );

            switch (status) {

                case 'start':
                    core.start();
                    break;

                case 'stop':
                    core.stop();
                    break;

                case 'restart':
                    core.restart();
                    break;


                default:
                    break;
            }
        }

        res.status(500).send();
    },


    async getSystemInfo(req, res) {

        try {
            const systemInfo = await SystemInfo.getSystemInfo();

            res.status(200).json({
                systemInfo
            });

        } catch (error) {

            console.log(error);
            res.status(500).json({
                error
            });

        }



    },


    async setSystemInfo(req, res) {

        const { parameter, value } = req.body;

        console.log(parameter);

        if (!validators.validateSystemParameter(parameter)) {

            return res.status(400).json({
                code: 300,
                message: 'Invalid parameter: parameter'
            });
        }


        res.status(200).json({
            parameter,
            value
        })
    },


    async reconfigureAds(req, res) {

        await redisCache.publish( 'settings.reconfigure' ,  true );
        
        // const data = await importConfig.export( null, {contentType : 'json'})
        
        // if ( data ){
                    
        //     const knex = knexConnect(config.database);

        //     await knex('datalogger_configuration').insert({ 
        //         dataloggerId : 1,
        //         userId : req.auth.id,
        //         configuration:  data
        //     });

        //     //console.log( data );
        //     //await 
        // }

        return res.status(204).send();
    },


    // async exportHistoricalData(req, res) {
    //     const { device, startTime, endTime } = req.body;
    //     let dataFound = false; // Flag per verificare se ci sono dati

    //     if (isProcessing) {
    //         return res.status(400).json({ error: 'An export operation is already in progress. Please try again later.' });
    //     }

    //     const diffTime = Math.abs(new Date(endTime) - new Date(startTime));



    //     try {

    //         isProcessing = true;

    //         if (diffTime / (1000 * 3600 * 24) > 30) {
    //             return res.status(400).json({ error: 'The requested duration cannot exceed 30 days.' });
    //         }


    //         const nameFile = device + '_' + startTime + '_' + endTime + '.json';
    //         console.log("Nome File+++++++++++++++++++++++++++++++++++++++", nameFile);


    //         const filePath = path.join(process.cwd(), "historical_data.json");

    //         let fileData = [];
    //         fs.existsSync(filePath) && fs.unlinkSync(filePath);

         

    //         let count = 1;
    //         while (true) {

    //             const options = {
    //                 type: "store",
    //                 devicesIds: [device],
    //                 startTime: startTime,
    //                 endTime: endTime,
    //                 pageNumber: count,
    //             };


    //             try {
    //                 const p = await store.getMessages(options);

    //                 if (!p?.messages || p.messages.length === 0) {
    //                     if (!dataFound) {
    //                         return res.status(404).json({ error: 'No data found for the selected period.' });
    //                     }
    //                     break;
                        
    //                 }

    //                 if (!dataFound) {
    //                     req.core.downloadStart({
    //                         export: 1,
    //                         message: { device: device, startTime: startTime, endTime: endTime, }
    //                     });
    //                     res.status(200).json({ message: 'Export started', device, startTime, endTime });
    //                     dataFound = true;
    //                 }


    //                 const map = new Map();
    //                 p.messages.forEach((item) => {
    //                     if (!map.has(item.timestamp)) {
    //                         map.set(item.timestamp, item.data);
    //                     }
    //                 });

    //                 const newData = Array.from(map).map(([timestamp, data]) => ({ timestamp, data }));
    //                 fileData.push(...newData);

    //                 // Riscrivi il file con i nuovi dati
    //                 fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');
    //                 console.log(`Dati aggiunti al file: ${filePath}, pagina: ${count}`);
    //             } catch (error) {
    //                 console.error("Errore durante l'elaborazione:", error);
                  
    //                 break;
    //             }

    //             count++;
    //             await delay(500); // Ritardo di 500ms
    //         }

    //         req.core.downloadReady();

    //     } catch (error) {
    //         console.error("Errore nell'elaborazione:", error);
    //     } finally {
    //         isProcessing = false;
    //     }


    // },





    // async downloadHistoricalData(req, res) {
    //     try {
    //         // Percorso del file JSON
    //         const inputFilePath = path.join(process.cwd(), 'historical_data.json');

    //         // Leggere il contenuto del file
    //         const fileContent = fs.readFileSync(inputFilePath, 'utf8');

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



    //         console.log(Object.keys(historicalData));



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
    //         const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
    //         const workbook = xlsx.utils.book_new();
    //         xlsx.utils.book_append_sheet(workbook, worksheet, 'Historical Data');

    //         // Scrivi il file Excel
    //         const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    //         // Rispondi con il file Excel
    //         res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //         res.setHeader('Content-Disposition', 'attachment; filename="historical_data.xlsx"');
    //         req.core.downloadFinish();

    //         res.status(200).send(excelBuffer);
    //         console.log('File Excel inviato con successo');
    //     } catch (error) {
    //         console.error('Errore durante la generazione dell\'Excel:', error);
    //         res.status(500).send({ status: 'error', message: 'Impossibile generare il file Excel' });
    //     }

    // }





}

