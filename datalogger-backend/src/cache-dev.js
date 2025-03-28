
import redisCache from './core/redisCache.js';

import config from '../config.js';
import { MongoClient } from 'mongodb';

const cache = {
    version : '1.0',
};


cache.loadSettings = async () => {

    const client = new MongoClient(config.mongo.url);

    try {
        const db = client.db(config.mongo.db);
        const signals = db.collection(config.mongo.configCollection);

        const settings = (await signals.findOne({}, {setting: 1, _id: 0}))?.setting;

        await redisCache.deleteCache('settings.*');

        for await (const setting of settings) {
            redisCache.set(`settings.${setting.group}.${setting.key}`, setting.value);

            if (setting.group === 'system' && setting.key === 'executionTime') {
                redisCache.set('system.executionTime', setting.value);
            }
        }

        return cache;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
    finally {
        client.close();
    }
}


cache.getSettings = async function ( group = undefined ){

    const ret = {};

    try {
        
        const keys =  group ? await redisCache.keys(`settings.${group}.*`) : await redisCache.keys(`settings.*`);

        if ( keys.length === 0 ){
            return ret;
        }
    
        const values = await redisCache.mget(keys);
    
        for (let index = 0; index < keys.length; index++) {
            ret[keys[index]] = values[ index ];
        }
    
        return ret;

    } catch (error) {
        console.error( error );
    }

    return ret;
   
}

cache.getGroup = async function ( group ){

    const ret = {};

    try {
        
        const keys = await redisCache.keys(`${group}.*`) 

        if ( keys.length === 0 ){
            return ret;
        }
        
        const values = await redisCache.mget(keys);

    
        for (let index = 0; index < keys.length; index++) {
            ret[keys[index]] = JSON.parse( values[ index ]);;
        }
        
        return ret;

    } catch (error) {
        console.error( error );
    }

    return ret;
   
}


cache.load = async function (options = undefined){

    console.log( ' + cache.load + ' );
    
    const bitmaskMap = new Map();
    const enumerationkMap = new Map();

    const enableSettings = !options || options.settings;
    const enableBitmasks = !options || options.bitmask;
    const enableEnumerations = !options || options.enumerations;

    const enableDataLogger = !options || options.dataLogger;
    const enableDeviceType = !options || options.deviceType;
    const enableDevices = !options || options.devices;
    

    if (enableSettings){
        await this.loadSettings();
    }
    
    //const system = await this.getSettings('system');

    // if ( system?.enableBitmask && enableBitmasks  ){
    //     cache.bitmasks = {};

    //     const bitmask = await knex('bitmask').select();
        
    //     bitmask.forEach(item => {
    
    //         cache.bitmasks[item.id] = item;
    
    //         if ( bitmaskMap.has(item.device_type_data_structure_id) ){
    
    //             const list = bitmaskMap.get(item.device_type_data_structure_id);
    //             list.push( item );
    
    //             bitmaskMap.set(item.device_type_data_structure_id, list); 
    //         }
    //         else{
    //             bitmaskMap.set(item.device_type_data_structure_id, [ item ]) 
    //         }
    //     });
    // }
    // else{
       
    //     Object.keys(cache.bitmasks).forEach(key => {

    //         const item = cache.bitmasks[key];

    //         if ( bitmaskMap.has(item.device_type_data_structure_id) ){

    //             const list = bitmaskMap.get(item.device_type_data_structure_id);
    //             list.push( item );
    
    //             bitmaskMap.set(item.device_type_data_structure_id, list); 
    //         }
    //         else{
    //             bitmaskMap.set(item.device_type_data_structure_id, [ item ]) 
    //         }
    //     })        
    // }
   

    // if ( system?.enableEnumeration && enableEnumerations ){
    //     cache.enumerations = {};

    //     const enumeration = await knex('enumeration').select();
       
    //     enumeration.forEach(item => {

    //         cache.enumerations[item.id] = item;

    //         if ( enumerationkMap.has(item.device_type_data_structure_id) ){

    //             const list = enumerationkMap.get(item.device_type_data_structure_id);
    //             list.push( item );

    //             enumerationkMap.set(item.device_type_data_structure_id, list); 

    //         }
    //         else{
    //             enumerationkMap.set(item.device_type_data_structure_id, [ item ]) 
    //         }
    //     });
    // }else{

    //     Object.keys(cache.enumerations).forEach(key => {

    //         const item = cache.enumerations[key];

    //         if ( enumerationkMap.has(item.device_type_data_structure_id) ){

    //             const list = enumerationkMap.get(item.device_type_data_structure_id);
    //             list.push( item );

    //             enumerationkMap.set(item.device_type_data_structure_id, list); 

    //         }
    //         else{
    //             enumerationkMap.set(item.device_type_data_structure_id, [ item ]) 
    //         }

    //     });
    // }

    const client = new MongoClient(config.mongo.url);
    let dataConfig = null;
    try {
        const db = client.db(config.mongo.db);
        const signals = db.collection(config.mongo.configCollection);
    
        dataConfig = await signals.findOne();

    } catch (error) {
        console.error( error );
        return null;
    }
    finally {
        client.close();
    }



    //return;
    

    if ( enableDataLogger && dataConfig.data_logger){

        try {
            await redisCache.deleteCache('dataLoggers.*');

            for await (const item of dataConfig.data_logger.filter( item => item.enabled === '1' && item.deleted === '0' ) ) {
                await redisCache.set(`dataLoggers.${item.id}`, JSON.stringify(item)  )
            }
    
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }


    if (enableDeviceType && dataConfig.devicetype_data_structure && dataConfig.device_type) {

        const structures = {};

        // const devicetypeDataStructure = await knex('devicetype_data_structure')
        //     .select()
        //     .orderBy('modbusAddress');

        const devicetypeDataStructure = dataConfig.devicetype_data_structure;
       
        devicetypeDataStructure.forEach(element => {

            // element.bitmask = bitmaskMap.has(element.id) ? bitmaskMap.get(element.id) : undefined
            // element.enumeration = enumerationkMap.has(element.id) ? enumerationkMap.get(element.id) : undefined

            if( structures.hasOwnProperty(element.deviceTypeModel) ) {
                structures[element.deviceTypeModel].push(element);
            }
            else{
                structures[element.deviceTypeModel] = [element];
            } 
        });



        await redisCache.deleteCache(`deviceTypes.*`);

        for await (const item of dataConfig.device_type.filter( item => item.deleted === '0' ) ) {
            await redisCache.set(`deviceTypes.${item.id}`, JSON.stringify({
                ...item,
                structures : structures[item.model]
            })  )
        }
    }
  
   

    if (enableDevices && dataConfig.device_interface && dataConfig.device){

        const deviceInterfaces = dataConfig.device_interface;
        const deviceTypes = dataConfig.device_type;

        //console.log( deviceInterface.find( item => item.id == 6) );
        
        await redisCache.deleteCache(`devices.*`);

        let bufferBatchSize = 0;
        let executionTime = await redisCache.get('settings.system.executionTime');


        for await (const device of dataConfig.device.filter(  item => item.enabled === '1' && item.deleted === '0' ) ) {
           
            const deviceInterface = deviceInterfaces.find( item => item.name === device.deviceInterfaceName && item.deleted === '0')
            const deviceType = deviceTypes.find( item => item.model === device.deviceTypeModel && item.deleted === '0')

            if (deviceInterface && deviceType){

                const {host, port} = deviceInterface;

                const {unitId, wordOrder, byteOrder} = device;
                
                delete device.dataLoggerName;
                delete device.deviceTypeModel;

                delete device.deviceInterfaceName;
                delete device.unitId;
                delete device.wordOrder;
                delete device.byteOrder;

                // console.log( {
                //     ...device,
                //     deviceTypeId: deviceType.id,
                //     host,
                //     port,
                //     config : {
                //         unitId,
                //         wordOrder,
                //         byteOrder
                //     }
                // } );

                await redisCache.set(`devices.${device.id}`, JSON.stringify( {
                    ...device,
                    deviceTypeId: deviceType.id,
                    host,
                    port,
                    config : {
                        unitId,
                        wordOrder,
                        byteOrder
                    }
                }) )

                executionTime = Math.min(executionTime, device.pollingPeriod) ;
                bufferBatchSize +=  Math.ceil(60 * 1000 / device.pollingPeriod) 
            }
    
        }

        const bufferBatchMinute = await redisCache.get('settings.saf.bufferBatchMinute');

        redisCache.set('settings.system.bufferBatchSize', Math.ceil(bufferBatchMinute * bufferBatchSize) )
        redisCache.set('settings.system.executionTime', executionTime )
    }
}


cache.get = async function (key, defaultValue = undefined) {

    const value = await redisCache.hget(key);

    return value ?? defaultValue;
}

export default cache;


async function main(params) {
    
    await cache.load();


    const data = await cache.getSettings();
    console.log( data );

    // const dataLoggers = await cache.getGroup('dataLoggers');
    // console.log( dataLoggers );

    // const deviceTypes = await cache.getGroup('deviceTypes');
    // console.log( deviceTypes );

    // const devices = await cache.getGroup('devices');

    // for (const key in devices) {
    //     if (Object.prototype.hasOwnProperty.call(devices, key)) {
    //         const element = devices[key];

    //         console.log(element.name, element.protocol, element.host, element.config );       
    //     }
    // }
}


// try {
//     main();
// } catch (error) {
//     console.error( error );
    
// }
