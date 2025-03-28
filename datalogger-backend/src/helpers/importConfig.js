import knexConnect from 'knex';
import config from '../../config.js';

import xlsx from "xlsx";
import fs from "fs";
import alarm from '../core/modules/alarm.js';


const knex = knexConnect(config.database);

const localCache = {
    data_logger : {},
    device_type : {},
    device_modbus : {},
    devicetype_data_structure : {}
}

const allowEntity = [
    // 'data_logger',
    
    // 'device_type',
    // 'devicetype_data_structure',

    // 'device_interface',
    
    'device',

    'alarms',

    //'bitmask' da revisionare,
    //'enumeration' da revisionare
    
    //'setting' da revisionare,
    //user manca da implementare 

];  



const errors = {
    data_logger : [],

    device_type : [],
    devicetype_data_structure : [],

    device_interface : [],
    
    device : [],
    
    bitmask : [],
    enumeration : [],

    alarms : [],
}


function removeLineBreaks(str) {
    if (!str){
        return str;
    }

    return str.replace(/\r\n/g, '');
}


async function upsertData(tableName, data, uniqueColumn = 'id') {

    try {
        // Esegui l'insert con il comando ON DUPLICATE KEY UPDATE
        const t = await knex(tableName)
            .insert(data)
            .onConflict(uniqueColumn) // Sostituisci 'id' con la tua colonna univoca o chiave primaria
            .merge()
            //.returning(returnColumns); // Unisce i nuovi dati con quelli esistenti in caso di conflitto

        console.log('Operazione di upsert completata con successo', t);

        return t;

    } catch (error) {
        console.error('Errore durante l\'upsert:', error);
    } finally {
        // Chiudi la connessione con il database
        //await knex.destroy();
    }
}


async function multipleUpsert(tableName, dataArray, uniqueColumns = ['id']) {

    const [uniqueColumn1, uniqueColumn2] = uniqueColumns; 

    try {
        // Metodo 1: Usando transazioni

        const result = await knex.transaction(async (trx) => {
            
            const queries = dataArray.map(data => {
                return trx(tableName)
                    .insert(data)
                    .onConflict(uniqueColumn1, uniqueColumn2)
                    .merge();
            });
            
            return Promise.all(queries);
        });
        
        //console.log('Operazione di upsert multiplo completata con successo', result);
        return result;
        
        // Metodo 2: Usando un singolo comando INSERT ... ON CONFLICT
        /* 
        const result = await knex(tableName)
            .insert(dataArray)
            .onConflict(uniqueColumn)
            .merge();
        
        return result;
        */
        
    } catch (error) {
        console.error('Errore durante l\'upsert multiplo:', error);
        throw error;
    }
}

async function multipleUpsertRelDeviceInterface(tableName, dataArray, uniqueColumns = ['id']) {

    const [uniqueColumn1] = uniqueColumns; 

    try {
        // Metodo 1: Usando transazioni

        const result = await knex.transaction(async (trx) => {
            
            const queries = dataArray.map(data => {

                console.log( data );
                
                return trx(tableName)
                    .insert(data)
                    .onConflict('deviceId')
                    .merge();
            });
            
            return Promise.all(queries);

        });
        
        //console.log('Operazione di upsert multiplo completata con successo', result);
        return result;
        
        // Metodo 2: Usando un singolo comando INSERT ... ON CONFLICT
        /* 
        const result = await knex(tableName)
            .insert(dataArray)
            .onConflict(uniqueColumn)
            .merge();
        
        return result;
        */
        
    } catch (error) {
        console.error('Errore durante l\'upsert multiplo:', error);
        throw error;
    }
}


export default {

    async importJson( jsonData ) {

        /*** data_logger START*/
        try {
            if ( allowEntity.includes('data_logger') && jsonData['data_logger'] ){

                const dataArray = jsonData['data_logger'].map( item => {

                    const {id, name, host, description, location, enabled, deleted } = item;

                    if (name && host){

                        try {
                            return {
                                id,
                                name : name.toString().trim(),
                                host : host.toString().trim(),

                                description : description ? description.toString().trim() : undefined,
                                location : location ? location.toString().trim() : undefined,

                                enabled : enabled ? enabled + '' : '0',
                                deleted: deleted ? deleted + '' : '0'
                            }
                        } catch (error) {

                            console.log( {error, nome} );
                        }
                    }

                    errors.data_logger.push(item);
                    return null

                }).filter( item => item !== null);

                await multipleUpsert ( 'data_logger', dataArray, ['id']);
            }
        } catch (error) {
            console.log( error );
        }
        

        try {
        
            const tableName = 'data_logger';
            localCache[tableName] = {}

            const rows = await knex(tableName).select('*').where({'deleted': '0'});

            if (rows.length > 0) {

                for await (const row of rows) {
                    localCache[tableName][ row.name ] = row;
                }
            } 
        } catch (error) {
            console.log( error );
        }
        /*** data_logger END*/


        /*** device_type START*/

        try {
            if ( allowEntity.includes('device_type') && jsonData['device_type'] ){

                const dataArray = jsonData['device_type'].map( item => {

                    const {id, model, manufacturer, description, firmwareRev, deleted } = item;

                    if (model){

                        try {
                            return {
                                id,
                                model : model.toString().trim(),
                                manufacturer : manufacturer ? manufacturer.toString().trim() : undefined,
                                description : description ? description.toString().trim() : undefined,
                                firmwareRev : firmwareRev ? firmwareRev.toString().trim() : undefined,
                                deleted: deleted ? deleted + '' : '0'
                            }
                        } catch (error) {
                            console.log( {error, model} );
                        }
                       
                    }

                    errors.device_type.push(item);
                    return null

                }).filter( item => item !== null);

                await multipleUpsert ( 'device_type', dataArray, ['id']);

            }
        } catch (error) {
            console.log( error );
        }
        

        try {
        
            const tableName = 'device_type';
            localCache[tableName] = {}

            const rows = await knex(tableName).select('*').where({'deleted': '0'});

            if (rows.length > 0) {

                for await (const row of rows) {
                    localCache[tableName][ row.model ] = row;
                }
            } 
        } catch (error) {
            console.log( error );
        }
        /*** device_type END*/


        /*** device_interface START*/

        try {
            if ( allowEntity.includes('device_interface') && jsonData['device_interface'] ){

                const dataArray = jsonData['device_interface'].map( item => {

                    const {id, name, host, port,  deleted } = item;


                    if (name && host && port){

                        try {
                            return {
                                id,
                                name : name.toString().trim(),
                                host : host.toString().trim(),
                                port : parseInt(port),
                                deleted: deleted ? deleted + '' : '0'
                            }
                        } catch (error) {
                            console.log( {error, name} );
                        }
                    }

                    errors.device_interface.push( item );
                    return null;

                }).filter( item => item !== null);

                await multipleUpsert ( 'device_interface', dataArray, ['id']);

            }
        } catch (error) {
            console.log( error );
        }


        try {
            const tableName = 'device_interface';
            localCache[tableName] = {}

            const rows = await knex(tableName).select('*').where({'deleted': '0'});

            if (rows.length > 0) {

                for await (const row of rows) {
                    localCache[tableName][ row.name ] = row;
                }
            } 
        } catch (error) {
            console.log( error );
        }
        /*** device_interface END*/

        

        /*** devicetype_data_structure */ 

        if ( allowEntity.includes('devicetype_data_structure') && jsonData['devicetype_data_structure'] ){

            const tableName = 'devicetype_data_structure';

            const ids = [];
            
            await knex(tableName).del();

            const dataArray = jsonData[tableName].map( item => {

                const {id, deviceTypeModel, deviceTypeId, name, description, modbusFunction, modbusAddress, modbusType, modbusAccess, measureUnit, gain, diff} = item;

                let deviceType;

                if (deviceTypeModel){
                    deviceType = localCache.device_type[deviceTypeModel.toString().trim()];
                }
                else if (!deviceTypeId){
                    errors.devicetype_data_structure.push( item );
                    return null;
                }

                if ( (deviceTypeId || deviceType) && name && modbusFunction && modbusAddress){

                
                    try {
                        ids.push ( id )

                        return {
                            id,
                            deviceTypeId : deviceTypeId ?? deviceType.id,
                            name : name.toString().trim(),
                            description : description ? description.toString().trim() : undefined,
                            modbusFunction: parseInt(modbusFunction),
                            modbusAddress : parseInt(modbusAddress),
                            modbusType ,
                            modbusAccess,
                            measureUnit,
                            gain : parseFloat(gain ?? 1),
                            diff : parseFloat(diff ?? 0)
                        }
                    } catch (error) {
                        console.log( {error, name} );
                    }
                }

                errors.devicetype_data_structure.push( item );
                return null;

            }).filter( item => item !== null);

        
            const insertIds = await multipleUpsert ( tableName, dataArray, ['id']);
         
            //const t =  [...ids, ...insertIds.map( item => item[0])].filter( item => item);

            // console.log( t );
            // await knex(tableName).whereNotIn('id', 
            //    t
            // ).del();
        }


        try {
            const tableName = 'devicetype_data_structure';
            localCache[tableName] = {}

            const rows = await knex(tableName).select('devicetype_data_structure.*', 'device_type.model').join('device_type', 'devicetype_data_structure.deviceTypeId', 'device_type.id') ;

            if (rows.length > 0) {

                for await (const row of rows) {
                    localCache[tableName][ `${row.model}:${row.name}` ] = row;
                }
            } 
        } catch (error) {
            console.log( error );
        }
        /*** devicetype_data_structure END*/ 


        /*** bitmask */
        try {
            if ( allowEntity.includes('bitmask') && jsonData['bitmask'] ){

                const tableName = 'bitmask'; 

                const array = jsonData[tableName];
                const ids = [];

                for (let index = 0; index < array.length; index++) {
    
                    const data = array[index];

                    //console.log( data );

                    if (data) {
                        
                        const devicetypeDataStructure = localCache.devicetype_data_structure[`${data.device_type_model}:${data.devicetype_data_structure_name}`];

                        if (devicetypeDataStructure){
                            data.device_type_data_structure_id = devicetypeDataStructure.id; 

                            delete data.device_type_model;
                            delete data.devicetype_data_structure_name;

                            data.position = data.position ? data.position + '' : '0';

                            //console.log( data );
                            const [id] = await upsertData(tableName, data );    

                            if ( data.id ){
                                ids.push ( data.id )
                            }
                            else if (id !== 0) {
                                ids.push ( id );
                            }   
                        }
                        
                        else{
                            errors.bitmask.push( data );
                        }
                    }
                }


                await knex(tableName).whereNotIn('id', ids).del();

            }
        } catch (error) {
            console.log( error );
        }
        /*** bitmask END*/



        /*** enumeration */
        try {
            if (allowEntity.includes('enumeration') && jsonData['enumeration']) {

                const tableName = 'enumeration';

                const array = jsonData[tableName];

                const ids = [];

                for (let index = 0; index < array.length; index++) {

                    const data = array[index];

                    //console.log( data );

                    if (data) {

                        const devicetypeDataStructure = localCache.devicetype_data_structure[`${data.device_type_model}:${data.devicetype_data_structure_name}`];

                        if (devicetypeDataStructure) {
                            data.device_type_data_structure_id = devicetypeDataStructure.id;

                            delete data.device_type_model;
                            delete data.devicetype_data_structure_name;

                            //data.position = data.position ? data.position + '' : '0';
                            //console.log( data );

                            const [id] = await upsertData(tableName, data);

                            if (data.id) {
                                ids.push(data.id)
                            }
                            else if (id !== 0) {
                                ids.push(id);
                            }
                        }

                        else {
                            errors.bitmask.push(data);
                        }
                    }
                }

                await knex(tableName).whereNotIn('id', ids).del();

            }
        } catch (error) {
            console.log(error);
        }
        /*** enumeration END*/


        /*** alarm */

        if ( allowEntity.includes('alarms') /*&& jsonData['alarm']*/ ){

            console.log( ' ---- ------------------ ---- alarms', jsonData['configuration_alarms']);

            try {
                
                const dataArray = jsonData['configuration_alarms'].map( item => {

                    const{
                        id,
                        name,
                        condition, 
                        active_time,
                        deactive_time,
                        message,
                        severity,
                        deleted
                    } = item;

                    
                    if (name && condition){

                        try {
                            return {
                                id,
                                name : name.toString().trim(),
                                condition : condition,

                                active_time,
                                deactive_time,
                                message  : message ? message.toString().trim() : undefined ,
                                severity,

                                deleted: deleted ? deleted + '' : '0'
                            }
                        } catch (error) {

                            console.log( {error, name} );
                        }
                    }

                    errors.alarms.push(item);
                    return null

                }).filter( item => item !== null);

                await multipleUpsert ( 'configuration_alarms', dataArray, ['id']);
                
            } catch (error) {
                console.log( error );
            }                
       

            try {
            
                const tableName = 'configuration_alarms';
                localCache[tableName] = {}

                const rows = await knex(tableName).select('*').where({'deleted': '0'});

                if (rows.length > 0) {

                    for await (const row of rows) {
                        localCache[tableName][ row.name ] = row;
                    }
                } 
            } catch (error) {
                console.log( error );
            }

    
         
        }


        /*** alarm END*/

        /*** Setting START*/
        try {
            if ( allowEntity.includes('setting') && jsonData['setting'] ){

                const dataArray = jsonData['setting'];

                await multipleUpsert ( 'setting', dataArray, ['id']);              
            }
        } catch (error) {
            console.log( error );
        }
        /*** Setting END*/


        try {

            const tableName = 'device';

            if ( allowEntity.includes(tableName) && jsonData[tableName] ){

                const dataArray = jsonData[tableName].map( item => {

                    const { id, name, 
                            dataLoggerId, dataLoggerName, 
                            deviceTypeId, deviceTypeModel, 
                            deviceInterfaceId, deviceInterfaceName,

                            description, enabled, deleted,
                            protocol, pollingPeriod, unitId, byteOrder , wordOrder 
                        } = item ;

                    let dataLogger;
                    let deviceType;
                    let deviceInterface;


                    if (dataLoggerName){
                        dataLogger = localCache.data_logger[dataLoggerName.toString().trim()];
                    }
                    else if (!dataLoggerId){
                        errors.device.push( item );
                        return null;
                    }

                    if (deviceTypeModel){
                        deviceType = localCache.device_type[deviceTypeModel.toString().trim()];
                    }
                    else if (!deviceTypeId){
                        errors.device.push( item );
                        return null;
                    }

                    if (deviceInterfaceName){
                        deviceInterface = localCache.device_interface[deviceInterfaceName.toString().trim()];
                    }
                    else if (deviceInterfaceId){
                        deviceInterface = localCache.device_interface.find( item => item.id == deviceInterfaceId);
                    }
                    

                    try {

                        return {
                            id,
                            dataLoggerId : dataLoggerId ?? dataLogger.id,
                            deviceTypeId : deviceTypeId ?? deviceType.id,
                            name : name.toString().trim(),
                            description : description ? description.toString().trim() : undefined,
                            enabled : enabled ? enabled + '' : '0',
                            deleted: deleted ? deleted + '' : '0',
                            deviceInterface : deviceInterface ? {
                                deviceId: id,
                                deviceName : name.toString().trim(),
                                interfaceId : deviceInterface.id,
                                protocol : protocol ? protocol.toString().trim() : 'TCP',
                                pollingPeriod : pollingPeriod ? parseInt(pollingPeriod) : 30000,
                                config : JSON.stringify({
                                    unitId,
                                    byteOrder,
                                    wordOrder,
                                })

                            } : undefined
                        }

                    } catch (error) {
                        console.log( error);
                    }

                    errors.device.push( item );
                    return null;

                });

                console.log( 'dataArray',  dataArray );

                const deviceData = [];
                const interfaceData = [];

                for (const item of dataArray) {
                    
                    const { id, name, enabled, description, deleted, dataLoggerId, deviceTypeId } = item;
                    deviceData.push({ id, name, enabled, description, deleted, dataLoggerId, deviceTypeId });

                    interfaceData.push({ ...item.deviceInterface });
                }

                await multipleUpsert (tableName, deviceData, ['id']);

                try {
                    
                    localCache[tableName] = {}
        
                    const rows = await knex(tableName).select('*').where({'deleted': '0'});
        
                    if (rows.length > 0) {
        
                        for await (const row of rows) {
                            localCache[tableName][ row.name ] = row;
                        }
                    } 
                } catch (error) {
                    console.log( error );
                }

                const relData = interfaceData.map( item => {

                    const { interfaceId, protocol, pollingPeriod, config} = item;
                    
                    return {
                        deviceId : item.deviceId ?? localCache[tableName][item.deviceName], 
                        interfaceId, 
                        protocol, 
                        pollingPeriod, 
                        config
                    }

                }).filter( item => item.deviceId && item.interfaceId) ;

                await multipleUpsertRelDeviceInterface ('rel_device_interfaces', relData, ['deviceId']);

            }


        } catch (error) {
            console.log( error );
        }


        try {
                    

            console.log(  localCache.configuration_alarms );
            const tableName = 'association_asset_alarm';    
            
            const dataArray = jsonData[tableName].map( item => {

                const{
                    id,
                    deviceName,
                    alarmName
                } = item;

                
                if (deviceName && alarmName){

                    try {
                        return {
                            id,
                            assetId : localCache.device[deviceName].id,
                            alarmId : localCache.configuration_alarms[alarmName].id
                            
                        }
                    } catch (error) {

                        console.log( {error, deviceName, alarmName} );
                    }
                }

                //errors.alarms.push(item);
                return null

            }).filter( item => item !== null);

            //console.log( dataArray);
            
            await knex(tableName).del();

            await multipleUpsert ( 'association_asset_alarm', dataArray, ['id']);
            
        } catch (error) {
            console.log( error );
        }    

        return {localCache, errors}; 
    },


    async importExcel( data) {

        const excelDataSheets = [];

        const workbook = xlsx.read( data, {type: 'buffer'});

        workbook.SheetNames.forEach(function (sheetName) {

            const sheet = workbook.Sheets[sheetName];
            excelDataSheets[sheetName] = xlsx.utils.sheet_to_json(sheet);

        });

        return this.importJson(excelDataSheets);

    },


    // async import(fileName) {

    //     const allowEntity = [
    //         'data_logger',
    //         'device_type',
    //         'device_modbus',
    //         'devicetype_data_structure',
    //         'setting',
    //         'device',
    //         'bitmask',
    //         'enumeration'
    //     ];  

    //     const errors = {
    //         devicetype_data_structure : [],
    //         device : [],
    //         bitmask : [],
    //         enumeration : []
    //     }

    //     const excelDataSheets = [];

    //     const workbook = xlsx.readFile(fileName);

    //     workbook.SheetNames.forEach(function (sheetName) {

    //         const sheet = workbook.Sheets[sheetName];
    //         excelDataSheets[sheetName] = xlsx.utils.sheet_to_json(sheet);

    //     });


    //     /*** data_logger START*/
    //     try {
    //         if ( allowEntity.includes('data_logger') && excelDataSheets['data_logger'] ){

    //             const array = excelDataSheets['data_logger'];
    
    //             for (let index = 0; index < array.length; index++) {
    
    //                 const data = array[index];
                    
    //                 if (data) {
    //                     data.deleted = data.deleted ? data.deleted + '' : '0';
    //                     await upsertData( 'data_logger', data );    
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.log( error );
    //     }
       

    //     try {
        
    //         const tableName = 'data_logger';
    //         localCache[tableName] = {}

    //         const rows = await knex(tableName).select('*').where({'deleted': '0'});

    //         if (rows.length > 0) {

    //             for await (const row of rows) {
    //                 localCache[tableName][ row.name ] = row;
    //             }
    //         } 
    //     } catch (error) {
    //         console.log( error );
    //     }
    //     /*** data_logger END*/


       
    //     /*** device_type START*/

    //     try {
    //         if ( allowEntity.includes('device_type') && excelDataSheets['device_type'] ){

    //             const array = excelDataSheets['device_type'];
    
    //             for (let index = 0; index < array.length; index++) {
    
    //                 const data = array[index];
                    
    //                 if (data) {
    //                     data.deleted = data.deleted ? data.deleted + '' : '0';
    //                     await upsertData( 'device_type', data );    
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.log( error );
    //     }
       

    //     try {
        
    //         const tableName = 'device_type';
    //         localCache[tableName] = {}

    //         const rows = await knex(tableName).select('*').where({'deleted': '0'});

    //         if (rows.length > 0) {

    //             for await (const row of rows) {
    //                 localCache[tableName][ row.model ] = row;
    //             }
    //         } 
    //     } catch (error) {
    //         console.log( error );
    //     }
    //     /*** device_type END*/

                
    //     /*** device_modbus START*/

    //     try {
    //         if ( allowEntity.includes('device_modbus') && excelDataSheets['device_modbus'] ){

    //             const array = excelDataSheets['device_modbus'];
    
    //             for (let index = 0; index < array.length; index++) {
    
    //                 const data = array[index];
                    
    //                 if (data) {
    //                     data.deleted = data.deleted ? data.deleted + '' : '0';
    //                     await upsertData( 'device_modbus', data );    
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.log( error );
    //     }


    //     try {
    //         const tableName = 'device_modbus';
    //         localCache[tableName] = {}

    //         const rows = await knex(tableName).select('*').where({'deleted': '0'});

    //         if (rows.length > 0) {

    //             for await (const row of rows) {
    //                 localCache[tableName][ row.name ] = row;
    //             }
    //         } 
    //     } catch (error) {
    //         console.log( error );
    //     }
    //      /*** device_modbus END*/


    //     /*** devicetype_data_structure */ 

    //     if ( allowEntity.includes('devicetype_data_structure') && excelDataSheets['devicetype_data_structure'] ){

    //         const tableName = 'devicetype_data_structure';

    //         const array = excelDataSheets[tableName];
    
    //         const ids = [];

    //         for (let index = 0; index < array.length; index++) {

    //             const data = array[index];

    //             if (data){

    //                 const deviceType = localCache.device_type[data.deviceTypeModel];

    //                 if (deviceType){
    
    //                     data.deviceTypeId = deviceType.id;
    //                     delete data.deviceTypeModel

    //                     //console.log( data );
    //                     const [id] = await upsertData(tableName, data );    

    //                     if ( data.id ){
    //                         ids.push ( data.id)
    //                     }
    //                     else if (id !== 0) {
    //                         ids.push ( id );
    //                     }   
    //                 }

    //                 else{
    //                     errors.devicetype_data_structure.push( data );
    //                 }
    //             }
    //         }

    //         //console.log( ids );

    //         await knex(tableName).whereNotIn('id', ids).del();
    //     }


    //     try {
    //         const tableName = 'devicetype_data_structure';
    //         localCache[tableName] = {}

    //         const rows = await knex(tableName).select('devicetype_data_structure.*', 'device_type.model').join('device_type', 'devicetype_data_structure.deviceTypeId', 'device_type.id') ;

    //         if (rows.length > 0) {

    //             for await (const row of rows) {
    //                 localCache[tableName][ `${row.model}:${row.name}` ] = row;
    //             }
    //         } 
    //     } catch (error) {
    //         console.log( error );
    //     }


    //     /*** devicetype_data_structure END*/ 


    //     /*** bitmask */
    //     try {
    //         if ( allowEntity.includes('bitmask') && excelDataSheets['bitmask'] ){

    //             const tableName = 'bitmask'; 

    //             const array = excelDataSheets[tableName];
    
    //             const ids = [];

    //             for (let index = 0; index < array.length; index++) {
    
    //                 const data = array[index];

    //                 //console.log( data );

    //                 if (data) {
                      
    //                     const devicetypeDataStructure = localCache.devicetype_data_structure[`${data.device_type_model}:${data.devicetype_data_structure_name}`];

    //                     if (devicetypeDataStructure){
    //                         data.device_type_data_structure_id = devicetypeDataStructure.id; 

    //                         delete data.device_type_model;
    //                         delete data.devicetype_data_structure_name;

    //                         data.position = data.position ? data.position + '' : '0';

    //                         //console.log( data );
    //                         const [id] = await upsertData(tableName, data );    

    //                         if ( data.id ){
    //                             ids.push ( data.id )
    //                         }
    //                         else if (id !== 0) {
    //                             ids.push ( id );
    //                         }   
    //                     }
                     
    //                     else{
    //                         errors.bitmask.push( data );
    //                     }
    //                 }
    //             }


    //             await knex(tableName).whereNotIn('id', ids).del();

    //         }
    //     } catch (error) {
    //         console.log( error );
    //     }


    //     try {
    //         if ( allowEntity.includes('setting') && excelDataSheets['setting'] ){

    //             const array = excelDataSheets['setting'];
    
    //             for (let index = 0; index < array.length; index++) {
    
    //                 const data = array[index];
                    
    //                 if (data) {
    //                     await upsertData( 'setting', data );    
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.log( error );
    //     }

    //     /*** bitmask END*/


    //     /*** enumeration */
    //     try {
    //         if (allowEntity.includes('enumeration') && excelDataSheets['enumeration']) {

    //             const tableName = 'enumeration';

    //             const array = excelDataSheets[tableName];

    //             const ids = [];

    //             for (let index = 0; index < array.length; index++) {

    //                 const data = array[index];

    //                 //console.log( data );

    //                 if (data) {

    //                     const devicetypeDataStructure = localCache.devicetype_data_structure[`${data.device_type_model}:${data.devicetype_data_structure_name}`];

    //                     if (devicetypeDataStructure) {
    //                         data.device_type_data_structure_id = devicetypeDataStructure.id;

    //                         delete data.device_type_model;
    //                         delete data.devicetype_data_structure_name;

    //                         //data.position = data.position ? data.position + '' : '0';
    //                         //console.log( data );

    //                         const [id] = await upsertData(tableName, data);

    //                         if (data.id) {
    //                             ids.push(data.id)
    //                         }
    //                         else if (id !== 0) {
    //                             ids.push(id);
    //                         }
    //                     }

    //                     else {
    //                         errors.bitmask.push(data);
    //                     }
    //                 }
    //             }

    //             await knex(tableName).whereNotIn('id', ids).del();

    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }


    //     try {
    //         if ( allowEntity.includes('setting') && excelDataSheets['setting'] ){

    //             const array = excelDataSheets['setting'];
    
    //             for (let index = 0; index < array.length; index++) {
    
    //                 const data = array[index];
                    
    //                 if (data) {
    //                     await upsertData( 'setting', data );    
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.log( error );
    //     }

    //     /*** bitmask END*/

    //     try {

    //         if ( allowEntity.includes('device') && excelDataSheets['device'] ){

    //             const array = excelDataSheets['device'];
    
    //             for (let index = 0; index < array.length; index++) {
    
    //                 const data = array[index];
                    
    //                 if (data) {

    //                     const deviceType = localCache.device_type[data.deviceTypeModel];

    //                     if ( !deviceType ){
    //                         errors.device.push( data );
    //                         continue;
    //                     }

    //                     data.deviceTypeId = deviceType.id;
                       
    //                     const deviceModbus = localCache.device_modbus[data.deviceModbusName];
                        
    //                     if (!deviceModbus){
    //                         errors.device.push( data );
    //                         continue;
    //                     }

    //                     data.deviceModbusId = deviceModbus.id;

    //                     const data_logger = localCache.data_logger[data.cpuName];

    //                     if (!data_logger){
    //                         errors.device.push( data );
    //                         continue;
    //                     }

    //                     data.dataLoggerId = data_logger.id;

    //                     data.enabled = data.enabled ? data.enabled + '' : '0';
    //                     data.deleted = data.deleted ? data.deleted + '' : '0';

    //                     delete data.deviceTypeModel;
    //                     delete data.deviceModbusName;
    //                     delete data.cpuName;

    //                     //console.log( data );
                        
    //                     await upsertData( 'device', data );    
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.log( error );
    //     }


    //     return {localCache, errors}; 
    // },


    async export(fileName, options) {

        const {
            contentType = 'excel',
            tables = null,
        } = options; 



        try {
         
            const workbook = contentType === 'excel' ? xlsx.utils.book_new() : {};

            if (tables == null || tables.includes('data_logger')){

                try {
                    const tableName = 'data_logger';
                    let rows = await knex(tableName).select('*').where( { 'deleted' : '0'} );
                    rows = rows.map(row => { delete row.updateAt; delete row.createdAt; return row; });
                    if (rows.length > 0) {

                        if ( contentType === 'excel' ){
                            const worksheet = xlsx.utils.json_to_sheet(rows);
                            xlsx.utils.book_append_sheet(workbook, worksheet, tableName);
                        }
                        else{
                            workbook[tableName] = rows;
                        }
                       
                    } else {
                        console.log(`La tabella ${tableName} è vuota.`);
                    }

                } catch (error) {
                    console.log( error );
                }
            }


            if (tables == null || tables.includes('device_type')){

                try {
                    const tableName = 'device_type';
                    let rows = await knex(tableName).select('*').where( { 'deleted' : '0'} );
                    rows = rows.map(row => { delete row.updateAt; delete row.createdAt; return row; });

                    if (rows.length > 0) {

                        if ( contentType === 'excel' ){
                            const worksheet = xlsx.utils.json_to_sheet(rows);
                            xlsx.utils.book_append_sheet(workbook, worksheet, tableName);
                        }
                        else{
                            workbook[tableName] = rows;
                        }

                    } else {
                        console.log(`La tabella ${tableName} è vuota.`);
                    }


                    if ( contentType === 'excel' ){
                        const worksheet = xlsx.utils.json_to_sheet(rows);
                        xlsx.utils.book_append_sheet(workbook, worksheet, tableName);
                    }
                    else{
                        workbook[tableName] = rows;
                    }

                } catch (error) {
                    console.log( error );
                }
            }
          

            if (tables == null || tables.includes('devicetype_data_structure')){

                try {
                    const tableName = 'devicetype_data_structure';

                    let rows = await knex(tableName).
                        join('device_type', 'devicetype_data_structure.deviceTypeId', '=', 'device_type.id').
                        select('devicetype_data_structure.*', 'device_type.model as deviceTypeModel' );
                    rows = rows.map(row => { delete row.updateAt; delete row.createdAt; return row; });

                    if (rows.length > 0) {

                        const data = rows.map( item => {
                            delete item.deviceTypeId
                            return item;
                        });
        
                        
                        if ( contentType === 'excel' ){
                            const worksheet = xlsx.utils.json_to_sheet(data);
                            xlsx.utils.book_append_sheet(workbook, worksheet, tableName);
                        }
                        else{
                            workbook[tableName] = data;
                        }


                    } else {
                        console.log(`La tabella ${tableName} è vuota.`);
                    }
                } catch (error) {
                    console.log( error );
                }
            }
           

            if (tables == null || tables.includes('bitmask')){

                try {
                    const tableName = 'bitmask';
                    const rows = await knex(tableName)
                        .select('bitmask.*', 'device_type.model as device_type_model', 'devicetype_data_structure.name as devicetype_data_structure_name')
                        .join('devicetype_data_structure', 'bitmask.device_type_data_structure_id' , 'devicetype_data_structure.id') 
                        .join('device_type', 'devicetype_data_structure.deviceTypeId' , 'device_type.id') 
                        ;
                    
                    if (rows.length > 0) {

                        const data = rows.map( item => {                            
                            delete item.device_type_data_structure_id
                            return item;
                        });
                        
                        
                        if ( contentType === 'excel' ){
                            const worksheet = xlsx.utils.json_to_sheet(data);
                            xlsx.utils.book_append_sheet(workbook, worksheet, tableName);
                        }
                        else{
                            workbook[tableName] = data;
                        }
                    


                    } else {
                        console.log(`La tabella ${tableName} è vuota.`);
                    }
                } catch (error) {
                    console.log( error );
                }
            }
           

            if (tables == null || tables.includes('enumeration')){
                try {
                    const tableName = 'enumeration';

                    const rows = await knex(tableName)
                        .select('enumeration.*', 'device_type.model as device_type_model', 'devicetype_data_structure.name as devicetype_data_structure_name')
                        .join('devicetype_data_structure', 'enumeration.device_type_data_structure_id' , 'devicetype_data_structure.id') 
                        .join('device_type', 'devicetype_data_structure.deviceTypeId' , 'device_type.id') ;
                    
                    if (rows.length > 0) {

                        const data = rows.map( item => {
                            delete item.device_type_data_structure_id
                            return item;
                        });

                        if ( contentType === 'excel' ){
                            const worksheet = xlsx.utils.json_to_sheet(data);
                            xlsx.utils.book_append_sheet(workbook, worksheet, tableName);
                        }
                        else{
                            workbook[tableName] = data;
                        }

                    } else {
                        console.log(`La tabella ${tableName} è vuota.`);
                    }
                } catch (error) {
                    console.log( error );
                }
            }


            if (tables == null || tables.includes('device_interface')){
                try {
                    const tableName = 'device_interface';
                    let rows = await knex(tableName).select('*').where( { 'deleted' : '0'} );
                    rows = rows.map(row => { delete row.updateAt; delete row.createdAt; return row; });

                    
                    if (rows.length > 0) {

                        if ( contentType === 'excel' ){
                            const worksheet = xlsx.utils.json_to_sheet(rows);
                            xlsx.utils.book_append_sheet(workbook, worksheet, tableName);
                        }
                        else{
                            workbook[tableName] = rows;
                        }


                    } else {
                        console.log(`La tabella ${tableName} è vuota.`);
                    }
                } catch (error) {
                    console.log( error );
                }
            }

            //console.log( tables );
            
            
            if (tables == null || tables.includes('device')){
                try {
                    const tableName = 'device';
                    const rows = await knex(tableName)
                        .select('device.id', 'data_logger.name as dataLoggerName', 
                            'device_type.model as deviceTypeModel',
                            'device.*',
                            'device_interface.name as deviceInterfaceName', 
                            'rel_device_interfaces.protocol',
                            'rel_device_interfaces.pollingPeriod',
                            'rel_device_interfaces.config'
                        )

                        .join('device_type', 'device.deviceTypeId', 'device_type.id' )
                        
                        .join('rel_device_interfaces', 'device.id', '=', 'rel_device_interfaces.deviceId')
                        .join('device_interface', 'rel_device_interfaces.interfaceId', '=', 'device_interface.id')


                        .join('data_logger', 'device.dataLoggerId', 'data_logger.id' )
                        .where( { 'device.deleted' : '0', 'device_type.deleted' : '0'} );
                    
                    if (rows.length > 0) {

                        const data = rows.map( item => {

                            delete item.deviceTypeId
                            delete item.deviceModbusId
                            delete item.dataLoggerId
                            delete item.updateAt
                            delete item.createdAt


                            if (item.config){

                                const t = JSON.parse( item.config);
                                delete item.config

                                return {
                                    ...item,
                                    ...t
                                }
                            }

                            return item;
                        })

                        if ( contentType === 'excel' ){
                            const worksheet = xlsx.utils.json_to_sheet(data);
                            xlsx.utils.book_append_sheet(workbook, worksheet, tableName);
                        }
                        else{
                            workbook[tableName] = data;
                        }

                    } else {
                        console.log(`La tabella ${tableName} è vuota.`);
                    }
                } catch (error) {
                    console.log( error );
                }
            }


            if (tables == null || tables.includes('setting')){
                try {
                    const tableName = 'setting';
                    let rows = await knex(tableName).select('*');
                    rows = rows.map(row => { delete row.updateAt; delete row.createdAt; return row; });

                    if (rows.length > 0) {

                        if ( contentType === 'excel' ){
                            const worksheet = xlsx.utils.json_to_sheet(rows);
                            xlsx.utils.book_append_sheet(workbook, worksheet, tableName);
                        }
                        else{
                            workbook[tableName] = rows;
                        }

                    } else {
                        console.log(`La tabella ${tableName} è vuota.`);
                    }
                } catch (error) {
                    console.log( error );
                }
            }

            if (tables == null || tables.includes('user')){
                try {
                    const tableName = 'user';
                    let rows = await knex(tableName).select('*').where( { 'deleted' : '0'} );;
                    rows = rows.map(row => { delete row.updateAt; delete row.createdAt; return row; });

                    if (rows.length > 0) {

                        if ( contentType === 'excel' ){
                            const worksheet = xlsx.utils.json_to_sheet(rows);
                            xlsx.utils.book_append_sheet(workbook, worksheet, tableName);
                        }
                        else{
                            workbook[tableName] = rows;
                        }

                    } else {
                        console.log(`La tabella ${tableName} è vuota.`);
                    }
                } catch (error) {
                    console.log( error );
                }
            }


            if (tables == null || tables.includes('alarms_list')){
                try {
                    const tableName = 'configuration_alarms';
                    let rows = await knex(tableName).select('*').where( { 'deleted' : '0'} );
                    rows = rows.map(row => { delete row.updateAt; delete row.createdAt; return row; });

                    
                    if (rows.length > 0) {

                        if ( contentType === 'excel' ){
                            const worksheet = xlsx.utils.json_to_sheet(rows);
                            xlsx.utils.book_append_sheet(workbook, worksheet, tableName);
                        }
                        else{
                            
                            workbook[tableName] = rows.map( item => {

                                try {
                                    item.condition = JSON.parse( item.condition);
                                } catch (error) {
                                    console.error( error );
                                }
                                
                                return item;
                            });
                        }


                    } else {
                        console.log(`La tabella ${tableName} è vuota.`);
                    }
                } catch (error) {
                    console.log( error );
                }
            }


            if ( tables?.includes('alarms_historical')){
                try {
                    const tableName = 'alarms';
                    let rows = await knex(tableName).select('*');
                    rows = rows.map(row => { delete row.updateAt; delete row.createdAt; return row; });

                    
                    if (rows.length > 0) {

                        if ( contentType === 'excel' ){
                            const worksheet = xlsx.utils.json_to_sheet(rows);
                            xlsx.utils.book_append_sheet(workbook, worksheet, tableName);
                        }
                        else{
                            workbook[tableName] = rows;
                        }


                    } else {
                        console.log(`La tabella ${tableName} è vuota.`);
                    }
                } catch (error) {
                    console.log( error );
                }
            }


            if ( tables == null || tables?.includes('alarms_association') ){

          
                try {
                    const tableName = 'association_asset_alarm';
                    const rows = await knex(tableName)
                    .select('association_asset_alarm.id', 'device.name as deviceName', 'configuration_alarms.name as alarmName')

                    .join('device', 'association_asset_alarm.assetId', 'device.id')
                    .join('configuration_alarms', 'association_asset_alarm.alarmId', 'configuration_alarms.id');


                    if (rows.length > 0) {

                        if ( contentType === 'excel' ){
                            const worksheet = xlsx.utils.json_to_sheet(rows);
                            xlsx.utils.book_append_sheet(workbook, worksheet, tableName);
                        }
                        else{
                            workbook[tableName] = rows;
                        }


                    } else {
                        console.log(`La tabella ${tableName} è vuota.`);
                    }
                } catch (error) {
                    console.log( error );
                }
            }

            
            if (fileName !== null){
                if (contentType === 'excel' ){
                    xlsx.writeFile(workbook, `${fileName}`);  
                }
                else{

                    const jsonData = JSON.stringify(workbook, null, 4); // `null` per omettere la funzione di replacer, `4` per l'indentazione
                    fs.writeFileSync(fileName, jsonData);
                }
            }

            else{
                return JSON.stringify(workbook, null, 4);
            }
  
            console.log(`Esportazione completata: ${fileName}`);

        } catch (error) {
            console.error('Errore durante l\'esportazione:', error);
        } finally {
            //await knex.destroy();
        }
    }
}

