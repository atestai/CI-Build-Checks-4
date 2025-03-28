import knexConnect from 'knex';
import Redis from 'ioredis';

import path from 'path';
import fs from 'fs';

import mqtt from "mqtt";
import configDb from '../../../config.js';

import cache from '../../cache.js';

import Restore from '../restore.js';
import redisCache from '../redisCache.js';

import { MongoClient } from "mongodb";

//import Logger from '../helpers/logger.js';

const knex = knexConnect(configDb.database);

let redis;
let status = 0;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



export default function ( options ){

    //const logger = new Logger('app.log');

    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

    let client;
    let restore ;

    let lastTimestamp = 0;

    async function consume(signalData, options = {}){

        if (!client.connected){
            return;
        }

        const config = await cache.getSettings();
        const devices = await cache.getGroup('devices');

        const deviceName = devices[`devices.${signalData.deviceId}`].name ?? signalData.deviceId;

        const {topic} = options;
        
        const message = JSON.stringify({
            timestamp : String(signalData.timestamp),
            metrics : {...signalData.data}
        })

        // const message  = Buffer.from(JSON.stringify({
        //     timestamp: String(signalData.timestamp),
        //     metrics: { ...signalData.data }
        // })).toString('base64');


        try {

            // if (process.env.NODE_ENV !== 'production') {
            //     console.log({ 
            //         timestamp : String(signalData.timestamp), 
            //         topic : topic + deviceName,
            //     });
            // }


            lastTimestamp = signalData.timestamp;
            
            await client.publish(
                topic + deviceName,
                message, 
                {   
                    qos:  Number(config['settings.mqtt.qos']), 
                    retain :  Number( config['settings.mqtt.retain']), 
                    dup :   Number(config['settings.mqtt.dup'])
                }, 
                async (error) => {
                    if (error) {
                        console.error(' --------------------- Errore durante la pubblicazione:', error);
                    }  
                }
            );

        } catch (error) {
            console.log( error );
        }

        // if ( cache.settings.system.enableBitmask && signalData.bitmasks ) {

        //     //console.log( signalData.bitmasks );

        //     for (const key in signalData.bitmasks) {

        //         if (Object.prototype.hasOwnProperty.call(signalData.bitmasks, key)) {
        //             const element = signalData.bitmasks[key];


        //             element.forEach( async bit => {    
                        
        //                 const item = cache.bitmasks[bit.id];

        //                 try {
                            
        //                     await client.publish(
        //                         topic + '/bitmasks/' + key + '/' + item.position,

        //                         JSON.stringify( {
        //                                 description: item.description ,
        //                                 type: item.type,
        //                                 priority: item.priority,
        //                                 active : bit.active
        //                             } ), {   

        //                             qos: cache.settings.mqtt.qos, 
        //                             retain : cache.settings.mqtt.retain,
        //                             dup : cache.settings.mqtt.dup
        //                         }, 
        //                         async (error, packet) => {
        //                             if (error) {
        //                                 console.error(' --------------------- Errore durante la pubblicazione:', error);
        //                             }
        //                     });

        //                     // countMessageSend ++; 
                            
        //                     // if (countMessageSend >= defaultMaxListeners){ 
        //                     //     console.log( 'countMessageSend: ', countMessageSend );

        //                     //     countMessageSend = 0;
        //                     //     await sleep( 300  );
        //                     // }

        //                 } catch (error) {
        //                     console.log( error );
        //                 }

        //             });
        //         }  
        //     }
        // }
        
        // if ( cache.settings.system.enableEnumeration && signalData.enumerations ) {

        //     for (const key in signalData.enumerations) {

        //         if (Object.prototype.hasOwnProperty.call(signalData.enumerations, key)) {

        //             const element = signalData.enumerations[key];

                    
        //             const item = cache.enumerations[element.id];

        //             const message = {   
        //                 description: item?.description ?? null ,
        //                 type: item?.type ?? null,
        //                 priority: item?.priority ?? null,
        //                 value : element.value
        //             }


        //             try {
        //                 await client.publish(
        //                     topic,
        //                     topic + '/enumerations/' + key,
        //                     JSON.stringify( message ), {   
        //                         qos: cache.settings.mqtt.qos, 
        //                         retain : cache.settings.mqtt.retain,
        //                         dup : cache.settings.mqtt.dup
        //                     }, 
        //                     async (error, packet) => {
        //                         if (error) {
        //                             console.error(' --------------------- Errore durante la pubblicazione:', error);
        //                         }
        //                 });

        //                 // countMessageSend ++; 
                            
        //                 // if (countMessageSend >= defaultMaxListeners){   
        //                 //     console.log( 'countMessageSend: ', countMessageSend );
                            
        //                 //     countMessageSend = 0;
        //                 //     await sleep( 300 );
        //                 // }
        //             } catch (error) {
        //                 console.log( error );   
        //             }
        //         }
        //     }
        // }  
    }


    async function start () {

        if ( status == 1 ){
            return;
        }

        console.log( 'Module Forward: start');

        status = 1;

        const config = await cache.getSettings('mqtt');
        const configSaf = await cache.getSettings('saf');
        const devices = await cache.getGroup('devices');

        restore = new Restore ();
       
        
        const url = `${config['settings.mqtt.protocol']}://${config['settings.mqtt.host']}:${config['settings.mqtt.port']}`;
    
        const options = {
            clientId,
            clean: true,
    
            username: config['settings.mqtt.username'] ?? undefined,
            password:  config['settings.mqtt.password'] ?? undefined,
    
            keepalive: Number( config['settings.mqtt.keepalive'] ?? 5 ) ,
    
            protocolId:  config['settings.mqtt.protocolId'] ?? 'MQTT',
            protocolVersion:  Number(config['settings.mqtt.protocolVersion'] ?? 4 ) ,
    
            connectTimeout:  Number(config['settings.mqtt.connectTimeout'] ?? 4000 ) ,
            reconnectPeriod:  Number(config['settings.mqtt.reconnectPeriod'] ?? 1000) ,   
            
            connectTimeout:  Number(config['settings.mqtt.connectTimeout'] ?? 4000 ) ,

            rejectUnauthorized: false,

            ca :  config['settings.mqtt.TLS'] &&  config['settings.mqtt.ca'] ? fs.readFileSync( path.join(config.workspaceDir, 'keys',  config['settings.mqtt.ca']) ) : undefined,
            cert :  config['settings.mqtt.TLS'] &&  config['settings.mqtt.cert'] ? fs.readFileSync( path.join(config.workspaceDir, 'keys',  config['settings.mqtt.cert']) ) : undefined,
            key :  config['settings.mqtt.TLS'] &&  config['settings.mqtt.key'] ? fs.readFileSync( path.join(config.workspaceDir, 'keys',  config['settings.mqtt.key']) ) : undefined,
        }

        console.log( url, options );
        
        try {
            client = mqtt.connect(url, options);

            client.on('connect', async () => {
    
                console.log('Connesso al broker MQTT');
                
                if ( configSaf['settings.saf.restoreEnabled'] ) {

                    const client = new MongoClient(configDb.mongo.url);

                    try {   
                        const db = client.db(configDb.mongo.db);
                        const collection = db.collection(configDb.mongo.restoreTask);

                        //console.log( collection );
                        
            
                        const lastTask =  await collection.findOne({status : 0})

                        if (lastTask){
                           
                            await collection.updateOne(
                                { _id: lastTask._id },
                                { 
                                    $set: { 
                                        status: 1,
                                        endTime : new Date( Date.now() ),
                                    } 
                                }
                            );

                            //TODO

                            restore.emit( 'start', lastTask._id );
                        }
            
                    } catch (error) {
        
                        console.error( error );
    
                    }
                    finally{
                        client.close();
                    }


                    // const data = await knex('restore_task').select('id', 'startTime').where({ status : 0 }).first();
    
                    // if ( data ){
    
                    //     const endTime = Date.now();
    
                    //     await knex('restore_task').update({
                    //         endTime : new Date( endTime ),
                    //         status : 1
                    //     }).where({ id : data.id }); 
    
                    //     restore.emit( 'start', data.id );
                    // }
                }

            
                redisCache.setStatus ({mqtt : 'connect'}); 
            
            });
        

            client.on('close', async () => {
                console.log('Emitted after a close');
                
                if (configSaf['settings.saf.restoreEnabled'] && lastTimestamp ){


                    const client = new MongoClient(configDb.mongo.url);

                    try {   
                        const db = client.db(configDb.mongo.db);
                        const collection = db.collection(configDb.mongo.restoreTask);

                        //console.log( collection );
                        
            
                        const lastTask =  await collection.findOne({status : 0})

                        if (!lastTask){
                            await collection.insertOne({
                                startTime : new Date( lastTimestamp ),
                                status : 0
                            });
                        }
            
                    } catch (error) {
        
                        console.error( error );
    
                    }
                    finally{
                        client.close();
                    }

                    // const data = await knex('restore_task').select('startTime').where({ status : 0 }).first();
                    // if (!data){
                    //     await knex('restore_task').insert({
                    //         startTime : new Date( lastTimestamp ),
                    //         status : 0
                    //     });
                    // }


                }
                
                redisCache.setStatus ({mqtt : 'close'});
            });
            

            client.on('error', async (error) => {
                
                console.log('Emitted after a error');
                console.error( error );

            });


            

     
            redis = new Redis(configDb.redis);

    
            
            redis.unsubscribe();

            if ( configSaf['settings.saf.forwardEnabled'] ) {

                for (const key in devices) {
                    if (Object.prototype.hasOwnProperty.call(devices, key)) {
                        const device = devices[key];

                        await redis.subscribe(`realtime.${device.id}`) 
                        await redis.subscribe(`restore.${device.id}`) 
                        await redis.subscribe(`alarm.${device.id}`)
                        await redis.subscribe(`aggregate.${device.id}`)
                    }
                }
    
                redis.on("message", async (channel, message) => {
                    //console.log(`Received ${message} from ${channel}`);
        
                    if (!client.connected){
                        return;
                    }
                    
                    try {

                        const [key] = channel.split('.');
                        console.log( key, JSON.parse(message).timestamp );
                        
                        switch (key) {
                            case 'restore':
                                await consume( JSON.parse(message), {
                                    topic : config['settings.mqtt.topic'] + '/' + key + '/'  
                                } );
                                break;

                            case 'alarm':
                                await consume( JSON.parse(message), {
                                    topic : config['settings.mqtt.topic'] + '/' + key + '/'  
                                } );
                                break;

                            case 'aggregate':
                                await consume( JSON.parse(message), {
                                    topic : config['settings.mqtt.topic'] + '/' + key + '/'  
                                } );
                                break;

                            default:
                                await consume( JSON.parse(message), {
                                    topic : config['settings.mqtt.topic'] + '/' + key + '/'  
                                } );
                                break;
                        } 
                        

                    } catch (error) {
                        console.error( error );
                    }
                });
            }

        } catch (error) {
            console.error( error );
        }
    }

    async function stop(params) {

        if ( status == 0){
            return
        }

        console.log( 'Module Forward: stop');

        status = 0;

        if (client ){
            client.end();
            client = null;
        }

        if( redis){
            redis.unsubscribe();
            redis.disconnect();
            redis = null;
        }

        restore = null;
    }
    

    return {
        getForward : () => this,
        getClient : () => client,
        getRedis : () => redis,
        getRestore : () => restore,

        start,
        stop,

        restart: async () => {
  
            await stop();
            await sleep(100);
            await start();
        },

        getName : () => 'Forward',
        getStatus : () => status
    }
}
