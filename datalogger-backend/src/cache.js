import knexConnect from 'knex';
import redisCache from './core/redisCache.js';

import config from '../config.js';

const knex = knexConnect(config.database);

const cache = {
    version : '1.0',
};


cache.loadSettings = async () => {

    const settings = await knex('setting').select();

    for await (const setting of settings) {
        redisCache.set(`settings.${setting.group}.${setting.key}`, setting.value);
    }
    
    const executionTime = await redisCache.get('settings.system.executionTime');
    redisCache.set('system.executionTime', executionTime ?? 30000 )

    return cache;
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

    if ( enableDataLogger ){


        const dataLogger = await knex('data_logger'). where({ deleted : '0' });

        dataLogger.map( async item => {
            await redisCache.set(`dataLoggers.${item.id}`, JSON.stringify(item)  )
        });
    }


    if (enableDeviceType) {

        const structures = {};

        const devicetypeDataStructure = await knex('devicetype_data_structure')
            .select()
            .orderBy('modbusAddress');

        devicetypeDataStructure.forEach(element => {

            // element.bitmask = bitmaskMap.has(element.id) ? bitmaskMap.get(element.id) : undefined
            // element.enumeration = enumerationkMap.has(element.id) ? enumerationkMap.get(element.id) : undefined

            if( structures.hasOwnProperty(element.deviceTypeId) ) {
                structures[element.deviceTypeId].push(element);
            }
            else{
                structures[element.deviceTypeId] = [element];
            } 
        });
        

        const deviceTypes = await knex('device_type').where({ deleted : '0' }).select();
             
        deviceTypes.forEach(async item => {

            if (structures[item.id]){

                const {createdAt, updateAt} = item; 

                await redisCache.set(`deviceTypes.${item.id}`, JSON.stringify( {
                    ...item,
                    cacheTime :  Math.max(createdAt, updateAt),
                    structures : structures[item.id]
                })  );
            }
        });

         
        redisCache.deleteCache(`deviceTypes.*`, deviceTypes.map( item => `deviceTypes.${item.id}` ));

    }
  


    if (enableDevices){


        const devices = await knex('device')
            .join('rel_device_interfaces', 'device.id', '=', 'rel_device_interfaces.deviceId')
            .leftJoin('device_interface', 'rel_device_interfaces.interfaceId', '=', 'device_interface.id')

            .select('device.*', 'rel_device_interfaces.protocol', 'rel_device_interfaces.pollingPeriod', 
                'rel_device_interfaces.config',
                'device_interface.host', 'device_interface.port', 
            )

            .where({ 'device.enabled' : '1' })
            .where({ 'device.deleted' : '0' })
            .orderBy('device.name');

        let bufferBatchSize = 0;
        let executionTime = await redisCache.get('settings.system.executionTime');

        const deviceType = await this.getGroup('deviceTypes');

        //redisCache.deleteCache(`devices.*`);

        devices.filter( item => {    
            return  deviceType[ `deviceTypes.${item.deviceTypeId}`] !== undefined ? item : null 
        } ). map( item => {

            try {
                item.config = JSON.parse(item.config);    
                return item;
            } catch (error) {
                console.error( error );
            }
            
            return undefined
            
        }).filter( item => item !== undefined).forEach( async item => {

            await redisCache.set(`devices.${item.id}`, JSON.stringify(item) )

            executionTime = Math.min(executionTime, item.pollingPeriod) ;
            bufferBatchSize +=  Math.ceil(60 * 1000 / item.pollingPeriod) 
        });   


        redisCache.deleteCache(`devices.*`, devices.map( item => `devices.${item.id}` ));

        // const alarms = await knex('configuration_alarms').where({'deleted' : '0' });

        // alarms.map( async item => {
        //     await redisCache.set(`alarms.${item.id}`, JSON.stringify(item)  )
        // });


        const bufferBatchMinute = await redisCache.get('settings.saf.bufferBatchMinute');

        redisCache.set('settings.system.bufferBatchSize', Math.ceil(bufferBatchMinute * bufferBatchSize) )
        redisCache.set('settings.system.executionTime', executionTime )
    }    

    // const fileName = './cache.json';
    // const jsonData = JSON.stringify(cache, null, 4); // `null` per omettere la funzione di replacer, `4` per l'indentazione
    // fs.writeFileSync(fileName, jsonData);

    //return cache;
}


cache.get = async function (key, defaultValue = undefined) {

    const value = await redisCache.hget(key);

    return value ?? defaultValue;
}

export default cache;


async function main(params) {
    
    await cache.load();


    //const data = await cache.getSettings('mqtt');
   // console.log( data );

    // const dataLoggers = await cache.getGroup('dataLoggers');
    // console.log( dataLoggers );

    // const deviceTypes = await cache.getGroup('deviceTypes');
    // console.log( deviceTypes );

    const devices = await cache.getGroup('devices');

    for (const key in devices) {
        if (Object.prototype.hasOwnProperty.call(devices, key)) {
            const element = devices[key];

            console.log( element.protocol, element.host, element.config );       
        }
    }
    
}

//main();

