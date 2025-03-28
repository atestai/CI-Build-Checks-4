import Redis from 'ioredis';
import knexConnect from 'knex';

import { MongoClient } from "mongodb";


import config from '../../../config.js';
import cache from '../../cache.js';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

import redisCache from '../redisCache.js';

// Gestione di operatori di confronto
const compareOperators = {
    $gt: (a, b) => a > b,
    $lt: (a, b) => a < b,
    $gte: (a, b) => a >= b,
    $lte: (a, b) => a <= b,
    $eq: (a, b) => { return a == b },
    $ne: (a, b) => a != b
};

const knex = knexConnect(config.database);

let status = 0;
let redis 

//const structuresMap = new Map();

export default function ( options ){


    // async function logOffDb(params) {
        
    //     const {deviceId, alarm, currentTime} = params;
     
    //     //console.log(logOffDb, {deviceId, alarm, currentTime});

    //     return await knex.transaction(async (trx) => {
    
    //         const results = await trx('alarms').where({
    //             deviceId,
    //             configurationAlarmId : alarm.id
    //         })  .whereNotNull('timestampActive')
    //             .whereNull('timestampDeactive')
    //             .first();
            
    //         if ( results ){

    //             await trx('alarms').update({
    //                 timestampDeactive : new Date(currentTime)
    //             }).where({ id : results.id });

    //             return true;
    //         }

    //         return false;
    //     });

    // }

    // async function logOnDb(params) {

    //     const {deviceId, alarm, currentTime} = params;

    //     //console.log(logOnDb, {deviceId, alarm, currentTime});
        
    //     return await knex.transaction(async (trx) => {
    
    //         const results = await trx('alarms').where({
    //             deviceId,
    //             configurationAlarmId : alarm.id
    //         })  .whereNotNull('timestampActive')
    //             .whereNull('timestampDeactive')
    //             .first();
            
    //         if ( !results ){

    //             await trx('alarms').insert({
    //                 deviceId,
    //                 configurationAlarmId : alarm.id,
    //                 severity : alarm.severity,
    //                 message : alarm.message,
    //                 name : alarm.name,
    //                 timestampActive : new Date(currentTime)
    //             })

    //             return true;
    //         }
    //         else{
    //             console.log( (currentTime - results.timestampActive) / 1000  );
    //             return false;
    //         }


    //     });
    // }

    async function logOffDb(params) {
        const {deviceId, alarm, currentTime} = params;
     
        const client = new MongoClient(config.mongo.url);

        try {   
            const db = client.db(config.mongo.db);
            const alarms = db.collection(config.mongo.alarms);

            const exists = await alarms.findOne({  
                deviceId,
                alarmId : alarm.id, 
                timestampActive : { $ne : null },
                timestampDeactive : null,
            });

            console.log('logOffDb', {exists} );

            if (exists){
                const newAlarm = await alarms.updateOne({
                    deviceId,
                    alarmId : alarm.id,
                    timestampActive : { $ne : null },
                    timestampDeactive : null,
                }, {
                    $set : { timestampDeactive : new Date(currentTime) }
                });

                // Print result
                // console.log(`${newAlarm} document were inserted`);

                return newAlarm;
            }
        } catch (error) {

            console.error('Error saving alarm:', error);
            chunk.map(item => {
                buffer.data.push(item);
            });
        }
        finally{
            client.close();
        }

        return false;

    }

    async function logOnDb(params) {    

        const {deviceId, alarm, currentTime} = params;

        const client = new MongoClient(config.mongo.url);

        try {   
            const db = client.db(config.mongo.db);
            const alarms = db.collection(config.mongo.alarms);

            const exists = await alarms.findOne({  
                deviceId,
                alarmId : alarm.id,

                timestampActive : { $ne : null },
                timestampDeactive : null,
            });

            console.log('logOnDb', {exists} );
            

            if (!exists){
                const newAlarm = await alarms.insertOne({
                    deviceId,
                    alarmId : alarm.id,
                    severity : alarm.severity,
                    message : alarm.message,
                    name : alarm.name,
                    timestampActive : new Date(currentTime)
                });

                // Print result
                // console.log(`${newAlarm} document were inserted`);

                return newAlarm;
            }
       

        } catch (error) {

            console.error('Error saving alarm:', error);
            chunk.map(item => {
                buffer.data.push(item);
            });
        }
        finally{
            client.close();
        }

        return false;
    }
    

    async function onCheckAllarm(message){
        
        // if ( message.deviceId == 12){
        //     console.log("+++++++++++++++++++++++++++++++++++++++++alarm", message.deviceId, message.timestamp);
        // }

       
        const alarms = await redisCache.lrange(`alarmsMap.${message.deviceId}`, 0, -1);

        // if ( message.deviceId == 12){
        //     console.log( message.deviceId,  alarms );
        // }
            
        //console.log( message.deviceId,  alarms );


        if ( alarms ){

            for (const alarm of alarms) {
              
                const res = await parseQuery({
                    deviceId : message.deviceId, 
                    rule : alarm.rule, 
                    data : message.data
                });

                const currentTime = Date.now();

                //console.log( res, alarm );
                
                if ( res ){

                    if ( !alarm.timestampActive ){
                        
                        alarm.timestampActive = currentTime;
                        alarm.timestampDeactive = undefined;
                        
                        await redisCache.lset(`alarmsMap.${message.deviceId}`, alarm);
                    }

                    if ( !alarm.activeTime || (alarm.activeTime && ( currentTime - Number(alarm.timestampActive)) / 1000 > alarm.activeTime)  ){
                        
                        const condition = await logOnDb({deviceId: message.deviceId, alarm, currentTime});

                        if (condition) {
                            await redisCache.publish( `alarm.${message.deviceId}`,  {
                                deviceId : message.deviceId,
                                timestamp : currentTime,
                                data : alarm
                            } )
                        }
                       
                    }
                }

                else if (alarm.timestampActive){ //close

                    //console.log( alarm );
                    
                    if ( !alarm.timestampDeactive ){
                        alarm.timestampDeactive = currentTime;
                        await redisCache.lset(`alarmsMap.${message.deviceId}`, alarm);
                    }

                    if ( !alarm.deactiveTime || (alarm.deactiveTime && ( currentTime - Number(alarm.timestampDeactive)) / 1000 > alarm.deactiveTime)  ){
                        const condition = await logOffDb({deviceId: message.deviceId, alarm, currentTime});

                        if (condition) {
                            await redisCache.publish( `alarm.${message.deviceId}`,  {
                                deviceId : message.deviceId,
                                timestamp : currentTime,
                                data : alarm
                            } )
                        }
                    }

                }
                
            }
        }
    }

    
    async function loadAllarm(){

        const data = await knex('association_asset_alarm')
            .select('assetId', 'alarmId', 'condition', 'active_time', 'deactive_time', 'name', 'message', 'severity' )
            
            .join('configuration_alarms', 'association_asset_alarm.alarmId', '=', 'configuration_alarms.id')
            .where({'configuration_alarms.deleted' : '0' });


        await redisCache.deleteCache('alarmsMap.*');
        
        for await (const alarm of data){

            const obj =  { 
                id : alarm.alarmId,
                activeTime : alarm.active_time,
                deactiveTime : alarm.deactive_time,
                name : alarm.name,
                message : alarm.message,
                severity : alarm.severity,
                rule : JSON.parse( alarm.condition )
            }

            await redisCache.rpush(`alarmsMap.${alarm.assetId}`, JSON.stringify(obj));
        }

        


        // const client = new MongoClient(config.mongo.url);

        // try {
        //     const db = client.db(config.mongo.db);
        //     const signals = db.collection(config.mongo.configCollection);
    
        //     const alarmsData = (await signals.findOne({}, {configuration_alarms: 1, association_asset_alarm: 1, _id: 0}));
            
        //     const {
        //         configuration_alarms : alarms, 
        //         association_asset_alarm : associationAlarms ,
        //         device : devices
        //     } = alarmsData;
        //     //console.log( {alarms, associationAlarms} );



        //     await redisCache.deleteCache('alarmsMap.*');
    
        //     for await (const associationAlarm of associationAlarms) {
             
        //         const alarm = alarms.find( item => item.name === associationAlarm.alarmName && item.deleted === '0')
        //         const device = devices.find( item => item.name === associationAlarm.deviceName && item.deleted === '0' && item.enabled === '1') 

            
        //         if ( alarm &&  device ){
                    
        //             const obj =  { 
        //                 id : alarm.id,
        //                 activeTime : alarm.active_time,
        //                 deactiveTime : alarm.deactive_time,
        //                 name : alarm.name,
        //                 message : alarm.message,
        //                 severity : alarm.severity,
        //                 rule :  alarm.condition 
        //             }

        //             console.log( obj , `alarmsMap.${device.id}`);
                    

        //             await redisCache.rpush(`alarmsMap.${device.id}`, JSON.stringify(obj));

        //         }
        //     }
    
        // }
        // catch (error) {
        //     console.error(error);
        // }
        // finally {
        //     client.close();
        // }
    }


    // async function loadSignals(){
    //     const deviceTypes = await cache.getGroup('deviceTypes');

        

    //     for (const key in deviceTypes) {
    //         //console.log( key );
            
    //         if (Object.prototype.hasOwnProperty.call(deviceTypes, key)) {

              
                
    //             const {structures} = deviceTypes[key];

            
    //             if (structures){
    //                 //console.log( structures );

    //                 for (let index = 0; index < structures.length; index++) {
    //                     const {id, name} = structures[index];
                        
    //                     structuresMap.set(Number(id), String(name));
    //                 }
    //             }
    //         }
    //     }
    // }


    async function start(){

        if (status == 1){
            return;
        }

        console.log( ' ------------------- Alarm Start');

        status = 1;

        await loadAllarm();
        //await loadSignals();
        
        redis = new Redis(config.redis);

        const devices = await cache.getGroup('devices');

        for (const key in devices) {
            if (Object.prototype.hasOwnProperty.call(devices, key)) {
                const device = devices[key];

                await redis.subscribe(`realtime.${device.id}`) 
            }
        }

        redis.on('message', (channel, message) => {
            
            const data = JSON.parse(message);
            
            if ( data ){
                onCheckAllarm(data);
            }
        });
    }


    async function stop(params) {

        if (status == 0){
            return;
        }

        console.log( ' ------------------- Alarm Stop');
        
        status = 0; 

        if( redis){
            redis.unsubscribe();
            redis.disconnect();
            redis = null;
        }
    }

 

    async function parseQuery(options) {

        const { deviceId, rule, data } = options;


        async function evaluateCondition(deviceId, condition, item) {
        
            // if (deviceId == 12){ 
            //     console.log( deviceId  );
            // }
            

            // Gestione di operatori logici
            if (condition.$and) {

                const results = await Promise.all(
                    condition.$and.map(subCondition => 
                        evaluateCondition(deviceId, subCondition, item)
                    )
                );
                
                 return results.every(result => result === true);
            }
    
            if (condition.$or) {

                const results = await Promise.all(
                    condition.$or.map(subCondition => 
                        evaluateCondition(deviceId, subCondition, item)
                    )
                );

                return results.every(result => result === true);

                // return condition.$or.some(async subCondition => 
                //     await evaluateCondition(deviceId, subCondition, item)
                // );
            }
    
            // Gestione dei confronti diretti
            for (const [key, value] of Object.entries(condition)) {
                
                if ( key === 'assetCategory'){
                    continue
                }

                if (value !== null && typeof value === 'object' ) {
    
                    // Caso con operatori di confronto
                    for (const [op, compareValue] of Object.entries(value)) {

                        //console.log( key, value, op, compareValue );
                        
                        if (compareOperators[op]) {
    
                            const regex = /^(\d+)\./;
    
                            if (key.startsWith('#.')){
    
                                //const nkey = structuresMap.get( Number(key.substring(2)) ) ;
                                const nkey = key.substring(2).trim();

                                if (item[nkey]){
                                    return compareOperators[op](item[nkey], compareValue);
                                }
                            }
    
                            else if ( regex.test(key) ){

                                const match = key.match(regex);
    
                                if (match) {

                                    const idDevice = match[1];  // "123"

                                    const nkeyID =  key.replace(match[0], '') 

                                    //const nkey = structuresMap.get( Number( nkeyID ));                    
                                    
                                    const nkey = nkeyID;

                                    //console.log(idDevice, nkeyID,  nkey ); // 123 come stringa

                                    const result = await redisCache.get( 'realtime.' + idDevice ) 

                                  
                                
                                    if ( result ){

                                        const {data} = JSON.parse( result );
                                       
                                        return compareOperators[op](data[nkey], compareValue);
                                    }

                                    return false;
                                }
                            }
                            else if ( key === 'true'){
                                return true;
                            }
    
                            return false;
                        }
                    }
    
                } else {
                    return item[key] === value;
                }
            }
    
            return false;
        }
        
        const ret = await evaluateCondition( deviceId, rule, data );

        return ret;
    }


    return {
        start,
        stop,
        
        restart: async () => {
            await stop();
            await sleep(500);
            await start();
        },

        getName : () => 'Alarm',
        getStatus : () => status,

        //loadAllarm,
        //parseQuery 
    }

}



//import T from './alarm.js';

// async function main(params) {

//     try {
   
//         const options = {
//             deviceId : 1,
//             rule : {"$and":[
//                     {"assetCategory":38,"#.11956":{"$eq":20512}},
//                     {"assetCategory":38,"#.11877":{"$gt":100}}
//                 ]}, 
//             data : {
//                 'Protoco l version [Modb us]': 1344274442,
//                 'Model ID': 20512,
//                 'Numbe r of PV strings': 20512,
//                 'Numbe r of MPPTs': 20512,
//                 'Rated power': 1344274.44,
//                 'Maxim um active power (Pmax)': 1344274.44,
//                 'Maxim um appare nt (Smax)': 1344274.44,
//                 'Real- time maxim um reactive power (Qmax, fed to the power grid)': 1344274.44,
//                 'Real- time maxim um reactive power (â\x80\x93  Qmax, absorb ed from the power grid)': 1344274.44,
//                 'Maxim um active power (Pmax_ real)': 1344274.44,
//                 'Maxim um appare nt capabili ty (Smax_ real)': 1344274.44,
//                 'Device SN  signatu re': 20512,
//                 'PV1  voltage': 2051.2,
//                 'PV1  current': 205.12,
//                 'PV2  Voltage': 2051.2,
//                 'PV2  current': 205.12,
//                 'PV3  Voltage': 2051.2,
//                 'PV3  current': 205.12,
//                 'PV4  Voltage': 2051.2,
//                 'PV4  current': 205.12,
//                 'PV5  Voltage': 2051.2,
//                 'PV5  current': 205.12,
//                 'PV6  voltage': 2051.2,
//                 'PV6  current': 205.12,
//                 'PV7  Voltage': 2051.2,
//                 'PV7  current': 205.12,
//                 'PV8  Voltage': 2051.2,
//                 'PV8  current': 205.12,
//                 'PV9  Voltage': 2051.2,
//                 'PV9  current': 205.12,
//                 'PV10  Voltage': 2051.2,
//                 'PV10  current': 205.12,
//                 'PV11  Voltage': 2051.2,
//                 'PV11  current': 205.12,
//                 'PV12  Voltage': 2051.2,
//                 'PV12  current': 205.12,
//                 'PV13  Voltage': 2051.2,
//                 'PV13  current': 205.12,
//                 'PV14  Voltage': 2051.2,
//                 'PV14  current': 205.12,
//                 'PV15  Voltage': 2051.2,
//                 'PV15  current': 205.12,
//                 'PV16  voltage': 2051.2,
//                 'PV16  current': 205.12,
//                 'PV17  Voltage': 2051.2,
//                 'PV17  current': 205.12,
//                 'PV18  Voltage': 2051.2,
//                 'PV18  current': 205.12,
//                 'PV19  Voltage': 2051.2,
//                 'PV19  current': 205.12,
//                 'PV20  Voltage': 2051.2,
//                 'PV20  current': 205.12,
//                 'PV21  Voltage': 2051.2,
//                 'PV21  current': 205.12,
//                 'PV22  Voltage': 2051.2,
//                 'PV22  current': 205.12,
//                 'PV23  Voltage': 2051.2,
//                 'PV23  current': 205.12,
//                 'PV24  Voltage': 2051.2,
//                 'PV24  current': 205.12,
//                 'DC  power': 1344274.44,
//                 'Power grid line A and B voltage': 2051.2,
//                 'Power grid B/C line voltage': 2051.2,
//                 'Power grid CA line voltage': 2051.2,
//                 'Power grid phase A  voltage': 2051.2,
//                 'Power grid phase B  voltage': 2051.2,
//                 'Power grid phase C  voltage': 2051.2,
//                 'Power grid phase A  current': 1344274.44,
//                 'Power grid phase B  current': 1344274.44,
//                 'Power grid phase C  current': 1344274.44,
//                 'Peak active power of the current day': 1344274.44,
//                 'Active power': 1344274.44,
//                 'reactive power': 1344274.44,
//                 'Power factor': 20.52,
//                 'Grid frequen cy': 205.12,
//                 'Inverter efficien cy': 205.12,
//                 'Internal temper ature': 2051.2,
//                 'Insulati on impeda nce': 20.51,
//                 'Device Status': 20512,
//                 'Fault Code': 20512,
//                 'Startup time': 1344274442,
//                 'Shutdo wn time': 1344274442,
//                 'Active power [fast]': 1344274.44,
//                 'Accum ulated power generat ion': 13443399.78,
//                 'Total DC  Input Power': 13443399.78,
//                 'Time when the current energy yield is collecte d.': 1344339978,
//                 'Current Hour Electrici ty': 13443399.78,
//                 'Current  -day power generat ion': 13443399.78,
//                 'Electrici ty generat ed in the current month': 13443399.78,
//                 'Electrici ty generat ed in the current year': 13443399.78,
//                 'Alarm clearan ce SN': 20513,
//                 'Last Hour Power Statisti cs Time': 1344339978,
//                 'Electrici ty generat ed in the previou s hour': 13443399.78,
//                 'Electrici ty statistic s time of the previou s day': 1344339978,
//                 'Electrici ty generat ed in the previou s day': 13443399.78,
//                 'Statisti cal time of the previou s month.': 1344339978,
//                 'Electrici ty generat ed in the previou s month': 13443399.78,
//                 'Electrici ty statistic s time of the previou s year': 1344339978,
//                 'Electrici ty generat ed in the previou s year': 13443399.78,
//                 'Serial number of the latest active alarm': 1344339978,
//                 'Latest Historic al Alarm Serial Numbe r': 1344339978,
//                 'Total bus voltage': 2051.3,
//                 'Maxim um PV voltage': 2051.3,
//                 'Minimu m PV voltage': 2051.3,
//                 'Averag e PV negativ e-to- ground voltage': 2051.3,
//                 'Maxim um PV positive  -to- ground voltage': 2051.3,
//                 'Minimu m PV negativ e-to- ground voltage': 2051.3,
//                 'Inverter  -to-PE withsta nd voltage': 20513,
//                 'Runnin g status of the built-in PID': 20514,
//                 'PV  negativ e voltage to ground': 2051.4,
//                 'Total DC  energy yield of MPPT1': 13444055.14,
//                 'Total DC  energy yield of the MPPT2': 13444055.14,
//                 'MPPT3 DC  Total Energy Yield': 13444055.14,
//                 'MPPT4 DC  Total Energy Yield': 13444055.14,
//                 'MPPT5 DC  Total Energy Yield': 13444055.14,
//                 'MPPT6 DC  Total Energy Yield': 13444055.14,
//                 'String 1 access status': 20515,
//                 'String 2 access status': 20515,
//                 'String 3 access status': 20515,
//                 'String 4 access status': 20515,
//                 'String 5 access status': 20515,
//                 'Connec tion status of string 6': 20515,
//                 'String 7 access status': 20515,
//                 'String 8 access status': 20515,
//                 'String 9 access status': 20515,
//                 'String 10  access status': 20515,
//                 'Connec tion status of string 11': 20515,
//                 'String 12  access status': 20515,
//                 'Connec tion status of string 13': 20515,
//                 'String 14  access status': 20515,
//                 'Connec tion status of string 15': 20515,
//                 'Connec tion status of string 16': 20515,
//                 'Connec tion status of string 17': 20515,
//                 'Connec tion status of string 18': 20515,
//                 'Connec tion status of string 19': 20515,
//                 'Connec tion status of string 20': 20515,
//                 'Connec tion status of string 21': 20515,
//                 'Connec tion status of string 22': 20515,
//                 'Connec tion status of string 23': 20515,
//                 'Connec tion status of string 24': 20515,
//                 'MPPT1  Total Input Power': 1344471.05,
//                 'MPPT2  total input power': 1344471.05,
//                 'MPPT3  Total Input Power': 1344471.05,
//                 'MPPT4  total input power': 1344471.05,
//                 'MPPT5  Total Input Power': 1344471.05,
//                 'MPPT6  Total Input Power': 1344471.05,
//                 'MPPT7  Total Input Power': 1344471.05,
//                 'MPPT8  Total Input Power': 1344471.05,
//                 'Total MPPT9  Input Power': 1344471.05,
//                 'PV25  Voltage': 2051.5,
//                 'PV25  current': 205.15,
//                 'PV26  Voltage': 2051.5,
//                 'PV26  current': 205.15,
//                 'PV27  Voltage': 2051.5,
//                 'PV27  current': 205.15,
//                 'PV28  Voltage': 2051.5,
//                 'PV28  current': 205.15,
//                 'Connec tion status of string 25': 20516,
//                 'Connec tion status of string 26': 20516,
//                 'Connec tion status of string 27': 20516,
//                 'Connec tion status of string 28': 20516,
//                 'Tilt angle 1 sampli ng': 205.16,
//                 'Azimut h 1 sampli ng': 205.16,
//                 'Tilt angle 2 sampli ng': 205.16,
//                 'Azimut h 2 sampli ng': 205.16,
//                 'Tilt angle 3 sampli ng': 205.16,
//                 'Azimut h 3 sampli ng': 205.16,
//                 'Tilt angle 4 sampli ng': 205.16,
//                 'Azimut h 4 sampli ng': 205.16,
//                 'Tilt angle 5 sampli ng': 205.16,
//                 'Azimut h 5 sampli ng': 205.16,
//                 'Tilt angle 6 sampli ng': 205.16,
//                 'Azimut h 6 sampli ng': 205.16,
//                 'Tilt angle 7 sampli ng': 205.16,
//                 'Azimut h 7 sampli ng': 205.16,
//                 'Tilt angle 8 sampli ng': 205.16,
//                 'Azimut h 8 sampli ng': 205.16,
//                 'Tilt angle 9 sampli ng': 205.16,
//                 'Azimut h 9 sampli ng': 205.16,
//                 'Tilt angle 10  sampli ng': 205.16,
//                 'Azimut h 10 sampli ng': 205.16,
//                 'Tilt angle 11  sampli ng': 205.16,
//                 'Azimut h 11 sampli ng': 205.16,
//                 'Tilt angle 12  sampli ng': 205.16,
//                 'Azimut h 12 sampli ng': 205.16,
//                 'Tilt angle 13  sampli ng': 205.16,
//                 'Bearing 13  sampli ng': 205.16,
//                 'Tilt angle 14  sampli ng': 205.16,
//                 'Azimut h 14 sampli ng': 205.16,
//                 'Tilt angle 15  sampli ng': 205.16,
//                 'Bearing angle 15  sampli ng': 205.16,
//                 'Tilt angle 16  sampli ng': 205.16,
//                 'Bearing 16  sampli ng': 205.16,
//                 'Trackin g system controll er': 20516,
//                 'Suppor t System Type': 20538,
//                 'Operati ng mode': 20538,
//                 'Total number of stents': 20516,
//                 'Suppor t 1 General Fault Status': 20517,
//                 'Suppor t 1 user- defined fault status': 20517,
//                 'Suppor t 2 General Fault Status': 20517,
//                 'Suppor t 2 Custom Fault Status': 20517,
//                 'Suppor t 3 General Fault Status': 20517,
//                 'Suppor t 3 user- defined fault status': 20517,
//                 'Suppor t 4 General Fault Status': 20517,
//                 'Suppor t 4 Custom Fault Status': 20517,
//                 'Suppor t 5 General Fault Status': 20517,
//                 'Suppor t 5 Custom Fault Status': 20517,
//                 'Suppor t 6 General Fault Status': 20517,
//                 'Suppor t 6 Custom Fault Status': 20517,
//                 'Suppor t 7 General Fault Status': 20517,
//                 'Suppor t 7 Custom Fault Status': 20517,
//                 'Suppor t 8 General Fault Status': 20517,
//                 'Suppor t 8 Custom Fault Status': 20517,
//                 'Suppor t 9 General Fault Status': 20517,
//                 'Suppor t 9 Custom Fault Status': 20517,
//                 'Suppor t 10 General Fault Status': 20517,
//                 'Suppor t 10 Custom Fault Status': 20517,
//                 'Suppor t 11 General Fault Status': 20517,
//                 'Suppor t 11 Custom Fault Status': 20517,
//                 'Suppor t 12 General Fault Status': 20517,
//                 'Suppor t 12 Custom Fault Status': 20517,
//                 'Suppor t 13 General Fault Status': 20517,
//                 'Suppor t 13 Custom Fault Status': 20517,
//                 'Suppor t 14 General Fault Status': 20517,
//                 'Suppor t 14 Custom Fault Status': 20517,
//                 'Suppor t 15 General Fault Status': 20517,
//                 'Suppor t 15 Custom Fault Status': 20517,
//                 'Suppor t 16 General Fault Status': 20517,
//                 'Suppor t 16 Custom Fault Status': 20517,
//                 'Capacit or bank run time': 134460212.2,
//                 'Internal fan 1 running time': 134460212.2,
//                 'Internal fan 2 running time': 134460212.2,
//                 'Internal fan 3 running time': 134460212.2,
//                 'Runnin g time of internal fan 4': 134460212.2,
//                 'I-V  scan status': 20518,
//                 'I-V  scannin g capabili ty': 20518,
//                 'Deferre d activati on state': 20518,
//                 'Smart I-V-V-  Diagno sis (Licens e) Status': 20519,
//                 '[Smart I-V-V-  Diagno sis] License expirati on date': 1344733194,
//                 'License loading time': 1344733194,
//                 'License Deregis tration Time': 1344733194,
//                 'Q-U  Schedul ing Trigger Power Percent age': 20519,
//                 'Active power is derated by a fixed value.': 1344798730,
//                 'Reactiv e power compe nsation (Q/S)  [low precisio n]': 20.52,
//                 'Reactiv e power adjust ment time': 20520,
//                 'Active power percent age deratin g (low precisio n)': 2052,
//                 'Night reactive power compe nsation (Q/S)': 20.52,
//                 'Fixed value of reactive power at  night': 1344798.73,
//                 '[Charac teristic curve] Reactiv e power adjust ment time': 20521,
//                 'Appare nt Power Percent age': 2052.1,
//                 'Q-U  Schedul ing Exit Power Percent age': 20521,
//                 'Active power percent age control (low precisio n)': 2052.1,
//                 'Q-U  charact eristic curve minimu m PF limit': 20.52,
//                 'Q-U  charact eristic curve validity delay time': 20521,
//                 'Power grid standar d code': 20522,
//                 'Output mode': 20522,
//                 'Voltage level': 20522,
//                 'Freque ncy Class': 20522,
//                 'Remote power schedul ing': 20522,
//                 'reactive power gradien t': 1344929.8,
//                 'Active power change gradien t': 1345388.55,
//                 'Schedul ed instruct ion hold time': 1344929802,
//                 'Maxim um appare nt power': 1344929.8,
//                 'Maxim um active power': 1344929.8,
//                 'appare nt power referen ce': 1344929.8,
//                 'Active power referen ce': 1344929.8,
//                 'Plant active power gradien t': 20522,
//                 'Filterin g time of the averag e active power of the plant': 1344929802,
//                 'PF-U  Voltage Detecti on Filterin g Time': 2052.2,
//                 'Filterin g time for frequen cy detecti on': 20523,
//                 'Freque ncy Active Power Deratin g Recover y Delay Time': 20524,
//                 'Freque ncy Active Power Deratin g Effectiv e Delay Time': 20524,
//                 'Freque ncy active power deratin g hystere sis': 20524,
//                 'Freque ncy modula tion control respons e dead zone': 20.52,
//                 'PQ  mode': 20524,
//                 'PV  Panel Type': 20524,
//                 'PID  compe nsation directio n': 20524,
//                 'String connect ion mode': 20524,
//                 'Isolatio n Setting s': 20524,
//                 'Freque ncy modula tion control power change gradien t': 20524,
//                 'Freque ncy modula tion control power change limiting amplitu de': 2052.4,
//                 'Delaye d respons e time of frequen cy modula tion control': 20524,
//                 'MPPT  multim odal scannin g': 20524,
//                 'MPPT  scannin g interval': 20524,
//                 'MPPT  predicti on power': 1345060.87,
//                 'Power grid fault recover y automa tic startup': 20525,
//                 'Power limit 0%  shutdo wn': 20525,
//                 'Autom atic power- off when commu nicatio n is disconn ected': 20525,
//                 'Autom atic power- on after commu nicatio n recover y': 20525,
//                 'Power Quality Optimi zation Mode': 20525,
//                 'RCD  Enhanc ement': 20525,
//                 'Night reactive power': 20525,
//                 'Night PID  protecti on': 20525,
//                 'Night reactive power parame ters take effect': 20525,
//                 'Comm unicati on Discon nection Detecti on Time': 20526,
//                 AFCI: 20526,
//                 'AFCI  detecti on adaptat ion mode': 20526,
//                 'Comm unicati on link failure protecti on': 20526,
//                 'Failure protecti on active power mode': 20526,
//                 'Active Power Limit for Failure Protecti on [kW]  [Low Precisio n]': 134519194.6,
//                 'Failure protecti on reactive power mode': 20526,
//                 'Freque ncy rate-of- change protecti on': 20526,
//                 'Freque ncy change rate protecti on point': 2052.6,
//                 'Freque ncy change rate protecti on time': 2052.6,
//                 'Reactiv e power limit for failure protecti on [Q/S]  [low precisio n]': 20.53,
//                 'Power- on voltage upper limit for grid connect ion': 2052.6,
//                 'Power- on voltage lower limit for grid connect ion': 2052.6,
//                 'Power- on frequen cy upper limit for grid connect ion': 205.26,
//                 'Power- on frequen cy lower limit for grid connect ion': 205.26,
//                 'Power grid reconn ection voltage upper limit': 2052.6,
//                 'Power grid reconn ection voltage lower limit': 2052.6,
//                 'Power grid reconn ection frequen cy upper limit': 205.26,
//                 'Power grid reconn ection frequen cy lower limit': 205.26,
//                 'Autom atic Power Grid Reconn ection Time': 20526,
//                 'Compo nent namepl ate short circuit current (Stc Isc)': 205.26,
//                 'Insulati on impeda nce protecti on point': 20.53,
//                 'Voltage unbala nce protecti on thresho ld': 2052.6,
//                 'Phase protecti on point': 2052.6,
//                 'Power- on Soft Start Time due to Power Grid Fault': 20526,
//                 'Cos?- P/Pn trigger voltage': 20526,
//                 'Cos?- P/Pn exit voltage': 20526,
//                 'Startup soft start time': 20526,
//                 'Power grid fault recover y time': 20526,
//                 'Time for determi ning short- term power grid interru ption': 1345191946,
//                 'Shutdo wn gradien t': 1345191.95,
//                 'Line loss compe nsation': 2052.6,
//                 'Grid fault zero current mode': 20526,
//                 'Grid Voltage Jump Trigger Thresh old': 2052.6,
//                 HVRT: 20526,
//                 'HVRT  Trigger Thresh old': 2052.6,
//                 'HVRT  positive sequen ce reactive power compe nsation factor': 2052.6,
//                 'Short- term power grid interru ption and quick startup': 20527,
//                 'LVRT  active current mainte nance coeffici ent': 205.27,
//                 LVRT: 20527,
//                 'LVRT  Trigger Thresh old': 2052.7,
//                 'Power grid voltage protecti on shield during VRT': 20527,
//                 'LVRT  positive sequen ce reactive power compe nsation factor': 2052.7,
//                 'VRT  exit hystere sis thresho ld': 2052.7,
//                 'VRT  active current limiting percent age': 20527,
//                 'VRT  active power recover y gradien t': 20527,
//                 'HVRT  negativ e sequen ce reactive compe nsation factor': 2052.7,
//                 'LVRT  negativ e sequen ce reactive power compe nsation factor': 2052.7,
//                 'phase angle deviati on protecti on': 20527,
//                 'Active Islandin g Protecti on': 20527,
//                 'Passive Islandin g Protecti on': 20527,
//                 'OVGR  Associa ted Shutdo wn': 20527,
//                 'Dry Contact Functio n': 20527,
//                 'LVRT  reactive current limiting percent age': 20527,
//                 'LVRT  zero current mode thresho ld': 2052.7,
//                 'LVRT  mode': 20527,
//                 'Voltage rise suppres sion': 20528,
//                 'Voltage rise suppres sion reactive power adjust ment point': 2052.8,
//                 'Voltage rise suppres sion active power deratin g thresho ld': 2052.8,
//                 'frequen cy modula tion control': 20528,
//                 'frequen cy modula tion control differen tial modula tion rate': 20528,
//                 'Overfre quency deratin g': 20528,
//                 'Cutoff frequen cy for overfre quency deratin g': 205.28,
//                 'Overfre quency deratin g cutoff power': 20528,
//                 'Triggeri ng frequen cy of overfre quency deratin g': 205.28,
//                 'Overfre quency deratin g exit frequen cy': 205.28,
//                 'Overfre quency deratin g power recover y gradien t': 20528,
//                 'Underfr equenc y Power Increas e': 20528,
//                 'Underfr equenc y  Power Increas e Recover y Gradien t': 20528,
//                 'Cut-off frequen cy of underfr equenc y power increas e': 205.29,
//                 'Cut-off power for underfr equenc y power increas e': 20529,
//                 'Underfr equenc y Power Increas e Triggeri ng Freque ncy': 205.29,
//                 'Underfr equenc y Power Increas e Exit Freque ncy': 205.29,
//                 'Built-in PID  operati ng mode': 20529,
//                 'PID  output voltage': 2052.9,
//                 PID: 20529,
//                 'P-U  curve adjust ment time': 205.3,
//                 'Ten- minute overvol tage protecti on thresho ld': 2053,
//                 'Ten- minute overvol tage protecti on time': 1345454090,
//                 'Level-1 overvol tage protecti on thresho ld': 2053,
//                 'Level-1 Overvol tage Protecti on Time': 1345454090,
//                 'Level-2 overvol tage protecti on thresho ld': 2053,
//                 'Level 2 Overvol tage Protecti on Time': 1345454090,
//                 'Level-3 overvol tage protecti on thresho ld': 2053,
//                 'Level-3 overvol tage protecti on time': 1345454090,
//                 'Level-4 overvol tage protecti on thresho ld': 2053,
//                 'Level-4 overvol tage protecti on time': 1345454090,
//                 'Level-5 overvol tage protecti on thresho ld': 2053,
//                 'Level-5 overvol tage protecti on time': 1345454090,
//                 'Level-6 overvol tage protecti on thresho ld': 2053,
//                 'Level-6 overvol tage protecti on time': 1345454090,
//                 'Level-1 underv oltage protecti on thresho ld': 2053,
//                 'Level-1 Underv oltage Protecti on Time': 1345454090,
//                 'Level-2 underv oltage protecti on thresho ld': 2053,
//                 'Level 2 Underv oltage Protecti on Time': 1345454090,
//                 'Level-3 underv oltage protecti on thresho ld': 2053,
//                 'Level-3 Underv oltage Protecti on Time': 1345454090,
//                 'Level-4 underv oltage protecti on thresho ld': 2053,
//                 'Level-4 Underv oltage Protecti on Time': 1345454090,
//                 'Level-5 underv oltage protecti on thresho ld': 2053,
//                 'Level-5 Underv oltage Protecti on Time': 1345454090,
//                 'Level-6 underv oltage protecti on thresho ld': 2053,
//                 'Level-6 Underv oltage Protecti on Time': 1345454090,
//                 'Level-1 overfre quency protecti on thresho ld': 205.3,
//                 'Level-1 overfre quency protecti on time': 1345454090,
//                 'Level-2 overfre quency protecti on thresho ld': 205.3,
//                 'Level-2 overfre quency protecti on time': 1345454090,
//                 'Level-3 overfre quency protecti on thresho ld': 205.3,
//                 'Level-3 overfre quency protecti on time': 1345454090,
//                 'Level-4 overfre quency protecti on thresho ld': 205.3,
//                 'Level-4 overfre quency protecti on time': 1345454090,
//                 'Level-5 overfre quency protecti on thresho ld': 205.3,
//                 'Level-5 overfre quency protecti on time': 1345454090,
//                 'Level-6 overfre quency protecti on thresho ld': 205.3,
//                 'Six- level overfre quency protecti on time': 1345454090,
//                 'Level-1 underfr equenc y protecti on thresho ld': 205.3,
//                 'Level-1 Underfr equenc y Protecti on Time': 1345454090,
//                 'Level-2 underfr equenc y protecti on thresho ld': 205.3,
//                 'Level-2 Underfr equenc y Protecti on Time': 1345454090,
//                 'Level-3 underfr equenc y protecti on thresho ld': 205.3,
//                 'Level-3 underfr equenc y protecti on time': 1345454090,
//                 'Level-4 underfr equenc y protecti on thresho ld': 205.3,
//                 'Level-4 Underfr equenc y Protecti on Time': 1345454090,
//                 'Level-5 underfr equenc y protecti on thresho ld': 205.3,
//                 'Level-5 Underfr equenc y Protecti on Time': 1345454090,
//                 'Level-6 underfr equenc y protecti on thresho ld': 205.3,
//                 'Level-6 Underfr equenc y Protecti on Time': 1345454090,
//                 'Output impeda nce enhanc ement': 20531,
//                 'Output impeda nce enhanc ement frequen cy point': 2053.1,
//                 'Underfr equenc y Power Increas e Effectiv e Delay Time': 20531,
//                 'Altitud e': 20532,
//                 'Delaye d Upgrad e': 20532,
//                 'Sleepin g at night': 20532,
//                 'Intellig ent string monito ring': 20533,
//                 'String detecti on referen ce asymm etry coeffici ent': 205.33,
//                 'String detecti on start power percent age': 20533,
//                 'Comm unicati on Interru ption Time': 20533,
//                 'Comm unicati ons': 20533,
//                 '[RS485  -2]  Comm unicati on': 20533,
//                 PMI: 20533,
//                 'IV  Curve Scannin g': 20534,
//                 '[Syste m time] year': 20534,
//                 '[Syste m Time] Month': 20534,
//                 '[Syste m time] day': 20534,
//                 '[Syste m time] hour': 20534,
//                 '[Syste m Time] Min.': 20534,
//                 '[Syste m time] second': 20534,
//                 'Inverter Installa tion Positio n Longitu de': 134.58,
//                 'Inverter Installa tion Positio n Latitud e': 134.58,
//                 '[RS485  -1]  Protoco l Type': 20535,
//                 '[RS485  -1]  Comm unicati on address': 20535,
//                 '[RS485  -1]  Baud Rate': 20535,
//                 '[RS485  -1]  Verifica tion mode': 20535,
//                 '[RS485  -1] Port mode': 20535,
//                 '[RS485  -2]  Protoco l Type': 20535,
//                 '[RS485  -2]  Comm unicati on address': 20535,
//                 '[RS485  -2]  Baud Rate': 20535,
//                 '[RS485  -2]  Verifica tion mode': 20535,
//                 '[RS485  -2] Port mode': 20535,
//                 'Protoco l Type': 20536,
//                 'Box- type transfor mer number': 20536,
//                 'Windin g No.': 20536,
//                 'Mac Offset': 20536,
//                 '[App] Initial power- on flag': 20537,
//                 'String access detecti on': 20537,
//                 'Start- up current': 205.37,
//                 'Two-in- one detecti on starting current': 205.37,
//                 'String 1 access type': 20537,
//                 'String 2 Access Type': 20537,
//                 'String 3 Access Type': 20537,
//                 'String 4 Access Type': 20537,
//                 'String 5 Access Type': 20537,
//                 'String 6 Access Type': 20537,
//                 'String 7 Access Type': 20537,
//                 'String 8 Access Type': 20537,
//                 'String 9 Access Type': 20537,
//                 'String 10  Access Type': 20537,
//                 'String 11  Access Type': 20537,
//                 'String 12  Access Type': 20537,
//                 'String 13  Access Type': 20537,
//                 'String 14  Access Type': 20537,
//                 'String 15  Access Type': 20537,
//                 'String 16  access type': 20537,
//                 'String 17  Access Type': 20537,
//                 'String 18  Access Type': 20537,
//                 'String 19  Access Type': 20537,
//                 'String 20  Access Type': 20537,
//                 'String 21  Access Type': 20537,
//                 'String 22  Access Type': 20537,
//                 'String 23  Access Type': 20537,
//                 'String 24  Access Type': 20537,
//                 'String 25  Access Type': 20537,
//                 'String 26  Access Type': 20537,
//                 'String 27  Access Type': 20537,
//                 'String 28  Access Type': 20537,
//                 'Control period': 20538
//             }
//         }
    
//         //parseQuery(options);
//         const t = T();
    
//         await t.loadAllarm();


    
//         // let i = 0;
    
//         setInterval(async () => {
    
            
//             const alarms = await redisCache.lrange(`alarmsMap.${12}`, 0, -1);

//             //console.log( {alarms} );

//             const alarm =
//             {
//                 id: 15,
//                 activeTime: 1,
//                 deactiveTime: 1,
//                 name: 'Test 1',
//                 message: 'test message',
//                 severity: 1,
//                 rule: { '$and': [Array] }
//             };
            

//             alarm.timestampActive =  Date.now();
//             alarm.timestampDeactive = undefined;
            
//             await redisCache.lset(`alarmsMap.${12}`, alarm);
            
//         }, 2000);
    
//     } catch (error) {
//         console.error( error );
//     }
// }

// try {
//     main();
// } catch (error) {
    
// }
