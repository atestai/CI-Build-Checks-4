import { MongoClient } from "mongodb";
import { EventEmitter } from 'events';
import cache from '../cache.js';
import config from '../../config.js';


const buffer = {
    data: []
};

const localCache = new Map();


// Create indexes for better query performance
async function setupIndexes() {
    await signals.createIndex({ deviceId: 1, timestamp: -1 });
    await signals.createIndex({ timestamp: 1 });
}

const eventEmitter = new EventEmitter();
let timeToWrite = Date.now();

eventEmitter.on('write', async (buffer, batchSize) => {

    const { data } = buffer;
    const chunk = data.splice(0, batchSize);
    
    if (chunk.length > 0) {

        console.log(" +++++++++++++++++++++ multi write:", {
            chunk: chunk.length, 
            buffer: data.length, 
            time : (Date.now() - timeToWrite) / 1000
        });

        timeToWrite = Date.now();

        const client = new MongoClient(config.mongo.url);

        try {   
            const db = client.db(config.mongo.db);
            const signals = db.collection(config.mongo.signals);

            const options = { ordered: true };
            const result = await signals.insertMany(chunk, options);

            // Print result
           // console.log(`${result.insertedCount} documents were inserted`);

        } catch (error) {

            console.error('Error saving signals:', error);
            chunk.map(item => {
                buffer.data.push(item);
            });
        }
        finally{
            client.close();
        }
    }
});


export default {

    async clearDb() {
        const client = new MongoClient(config.mongo.url);
        try {
            const db = client.db(config.mongo.db);

            const signals = db.collection(config.mongo.signals);
            await signals.deleteMany({});
        }
        catch (error){
            console.error( error );   
        }
        finally{
            client.close();
        }
    },

    async closeDatabase() {
        // await client.close();
        // console.log('Database closed');
    },

    async checkAndCleanDatabase(size) {

        const percentage = 0.85;
        const maxSize = size * Math.pow(1024, 3);
        const thresholdSizeMax = maxSize * percentage;
        const thresholdSizeMin = maxSize * (percentage - 0.05);

        let start = false;
       
        const client = new MongoClient(config.mongo.url);

        try {
            const db = client.db(config.mongo.db);
            const signals = db.collection(config.mongo.signals);

            const stats = await db.stats();

            let currentSize = stats.dataSize;

            const sysyemConfig = await cache.getSettings('system');
            const batchSize = Number(sysyemConfig['settings.system.bufferBatchSize']) ?? 255;

            const um = Math.pow(1024, 2);
        
            if (process.env.NODE_ENV !== 'production') {
                console.log( { maxSize, 
                    start,
                    currentSize : currentSize / um ,
                    thresholdSizeMax : thresholdSizeMax / um, 
                    batchSize  } );
            }

            if (currentSize > thresholdSizeMax){
                start = true
            }


            while ( start ) {

                if (process.env.NODE_ENV !== 'production') {
                    console.log(1, { 
                        exec : start || (currentSize > thresholdSizeMin),
                        start,
                        currentSize : currentSize /  um,    
                        thresholdSizeMax : thresholdSizeMax /  um, 
                        thresholdSizeMin : thresholdSizeMin / um,
                        batchSize  
                    } );
                }

                const records = await signals.find({}, {_id : 1, timestamp: 1})
                    .sort({ timestamp: 1 })
                    .limit(batchSize)
                    .toArray();

                
                const lastTimestamp = records[records.length - 1].timestamp;
                await signals.deleteMany({ timestamp: { $lte: lastTimestamp } });

                const stats = await db.stats();
                currentSize = stats.dataSize;

                if (process.env.NODE_ENV !== 'production') {
                    console.log(2, { 
                        start,
                        currentSize : currentSize /  um ,
                        thresholdSizeMax : thresholdSizeMax / um, 
                        thresholdSizeMin : thresholdSizeMin / um,
                        batchSize 
                    } );
                }

                if(currentSize <=  thresholdSizeMin){
                    start = false;
                }
            }

            return currentSize;

        } catch (error) {
            console.error('Error during database check and cleanup:', error);
        }
        finally{
            client.close();
        }   
    },


    async deleteMessage(id) {

        const client = new MongoClient(config.mongo.url);
        try {
            const db = client.db(config.mongo.db);

            const signals = db.collection(config.mongo.signals);
            await signals.delete({_id : id})
        }
        catch (error){
            console.error( error );   
        }
        finally{
            client.close();
        }
    },

    getBuffer() {
        return buffer.data;
    },

    async getDBSize() {
        const client = new MongoClient(config.mongo.url);

        try {

            const db = client.db(config.mongo.db);
            const stats = await db.stats();
            
            return stats.dataSize;

        } catch (error) {
            console.error(error);   
        }
        finally{
            client.close();        
        }
       
    },

    async getCountMessages(options) {

        const {
            devicesIds = undefined,
            startTime = 1725148800000,
            endTime = undefined
        } = options;

        const client = new MongoClient(config.mongo.url);


        try {

            const db = client.db(config.mongo.db);
            const signals = db.collection(config.mongo.signals);
           

            const query = {
                timestamp: { $gte: Number(startTime) }
            };

            if (devicesIds){
                query.deviceId = { $in: devicesIds }
            }

            if (endTime) {
                query.timestamp.$lte = Number(endTime);
            }

            const totalItems = await signals.countDocuments(query);

            return {
                totalItems
            };
                       
        }
        catch (error){
            console.error( error );
            return null;
        }
        finally{
            client.close();
        }

    },

    async getHeadersMessages( options ){

        const {
            devicesIds = undefined,
            startTime = 1725148800000,
        } = options;

        const client = new MongoClient(config.mongo.url);


        try {
            const db = client.db(config.mongo.db);
            const signals = db.collection(config.mongo.signals);

            const query = {
                timestamp: { $gte: Number(startTime) }
            };

            if (devicesIds){
                query.deviceId = { $in: devicesIds }
            }

            const message = await signals.findOne(query);

            if ( message ){
                return {
                    headers :  Object.keys( message.data ) 
                };
            }
           
            return null;
        }

        catch (error){
            console.error( error );
            throw error;
        }
        finally{
            client.close();
        }


    },

    async getLastTelemetry(deviceId) {
        const client = new MongoClient(config.mongo.url);

        try {
            const db = client.db(config.mongo.db);
            const signals = db.collection(config.mongo.signals);

            const query = {
                deviceId: String(deviceId)
            };

            const telemetry = await signals.findOne(query);

            console.log( {telemetry, query} );
            

            return telemetry;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
        finally {
            client.close();
        }
    },

    async getMessages(options) {

        const {
            devicesIds = undefined,
            startTime = 1725148800000,
            endTime = undefined,
            pageSize = 100,
            pageNumber = 1,
            sort = -1
        } = options;

        const client = new MongoClient(config.mongo.url);

        try {
            const db = client.db(config.mongo.db);
            const signals = db.collection(config.mongo.signals);
            const skip = (pageNumber - 1) * pageSize;

            const query = {
                timestamp: { $gte: Number(startTime) }
            };

            if (devicesIds){
                query.deviceId = { $in: devicesIds }
            }

            if (endTime) {
                query.timestamp.$lte = Number(endTime);
            }

            console.log( {query, skip} );
            

            //await signals.createIndex({ deviceId: 1,  timestamp: -1 });
            //await signals.createIndex({ timestamp: 1 });

             // Esegui la query con skip e limit
            const messages = await signals.find(query)
                .sort({ timestamp: sort })
                .skip(skip)
                .limit( Number(pageSize))
                .toArray();

            //console.log(messages);

            const totalItems = await signals.countDocuments(query);
            const totalPages = Math.ceil(totalItems / pageSize);

             return {
                messages,
                items : messages.length,
                totalItems, 
                totalPages
            };
                       
        }
        catch (error){
            console.error( error );
            throw error;
        }
        finally{
            client.close();
        }
    },


    async putMessage(signalData) {

        const data = await cache.getSettings('system');
        const batchSize = Number(data['settings.system.bufferBatchSize']) ?? 255;

        buffer.data.push(signalData);

        if (buffer.data.length >= batchSize) {
            eventEmitter.emit('write', buffer, batchSize );
        }
    },

    
    async forceWrite() {
        // if (buffer.data.length > 0) {
        //     eventEmitter.emit('write', buffer);
        // }
    },


    async aggregation(milliseconds){

        const safConfig = await cache.getSettings('saf');

        const client = new MongoClient(config.mongo.url);

        const timestamp = new Date().getTime() - (milliseconds + (1  * 60 * 1000 ) );

        try {
            const db = client.db(config.mongo.db);
            const signals = db.collection(config.mongo.signals);

            const tags = ['PV1  voltage', 'PV1  current', 'Active power [fast]']

            const match = {
                $match: {
                    timestamp: { $gte: timestamp },
                    deviceId: { $in: ['1', '13', '12']}
                }
            }

            const group = {
                _id : "$deviceId",
                
                timestamp: { $min: "$timestamp" },
                count: { $sum: 1 }
            }

            for (const tag of tags) {
                group[`avg_${tag}`] = { $avg: `$data.${tag}.value` },
                group[`max_${tag}`] = { $max: `$data.${tag}.value` },
                group[`min_${tag}`] = { $min: `$data.${tag}.value` }
            }

                //     `maxPower` : { $max: "$data.PV1  voltage.value" },
                //     minPower: { $min: "$data.PV1  voltage.value" },
                //     avgPower: { $avg: "$data.PV1  voltage.value" },

                // }
    

            const pipeline = [ match, {$group : group } ];

            const result = await signals.aggregate(pipeline).toArray();
            console.log(milliseconds, result);   
        }

        catch (error){
            console.error( error );
        }
        finally{
            client.close();
        }
    }
};