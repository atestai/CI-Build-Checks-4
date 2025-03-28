
import { EventEmitter } from 'events';

import store from './mongoStore.js';
import redisCache from './redisCache.js';

import configDb from '../../config.js';
import { MongoClient, ObjectId } from "mongodb";


const timeToSleep = 100;
//const knex = knexConnect(config.database);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Restore extends EventEmitter {

    constructor(options = {}) {

        super();

        this.on('start', async (id) => {

            console.log( 'start', id );
            

            const client = new MongoClient(configDb.mongo.url);


            try {   
                const db = client.db(configDb.mongo.db);
                const collection = db.collection(configDb.mongo.restoreTask);

                const lastTask =  await collection.findOne({ _id: id })

            
                if (lastTask){
                   
                    
                    let itemsCount = 0;
                    let lastTimestamp = 0;
    
                    const {startTime, endTime} = lastTask;


                    const buffer = store.getBuffer().filter( item => {
                        //console.log(Number(item.timestamp),  Number(timestamp), Number(item.timestamp) >= Number(timestamp) );
                        
                        return Number(item.timestamp) >= Number(startTime) && Number(item.timestamp) <= Number(endTime);
                    });       

                    if ( buffer.length !== 0 ){
                        for (let index = 0; index < buffer.length; index++) {
                            const signalData = buffer[index];
        
                            await redisCache.publish( `restore.${signalData.deviceId}` ,  signalData )
                            //timestamp = Math.max(signalData.timestamp, timestamp);
        
                            itemsCount ++;
                            lastTimestamp = signalData.timestamp;
                            await sleep(timeToSleep);
                        }
                    }


                    let pendingMessages = null;
                    let pageNumber = 1;

                    while (true) {
                        
                        pendingMessages = await store.getMessages({
                            startTime,
                            endTime,
                            pageSize : 1000,
                            pageNumber,
                            sort : 1
                        });

                    
                        const {messages, items, totalItems, totalPages} = pendingMessages;



                        if (process.env.NODE_ENV !== 'production'){
                            console.log({
                                pageNumber,
                                totalPages,
                                totalItems,
                                items
                            });
                        }
                        
                        if (!messages.length ){
                            break;
                        }

                        for (let index = 0; index < messages.length; index++) {
                            const signalData = messages[index];

                            await redisCache.publish( `restore.${signalData.deviceId}` ,  signalData )

                            itemsCount ++;
                        
                            lastTimestamp = signalData.timestamp;
                            await sleep(timeToSleep);
                        }

                        pageNumber++;
                    }


                    await collection.updateOne(
                        { _id: id },
                        { 
                            $set: { 
                                status: 2,
                                endTime : new Date( Date.now() ),
                                totalItems : itemsCount
                            } 
                        }
                    );
                }
    
            } catch (error) {
                console.error( error );
            }
            finally{
                client.close();
            }
        })
    }
}

export default Restore;
