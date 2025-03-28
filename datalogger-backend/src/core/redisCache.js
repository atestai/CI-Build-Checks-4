
import Redis from 'ioredis';
import config from '../../config.js';

//import t from './redisCache.js';
//import cache from '../cache.js';


const redis = new Redis(config.redis);

export default {


    async exists(key) {
  
        try {
            if ( redis.status !== 'ready'){
                await redis.connect()
            }

            const exists = await redis.exists( key );
            return  Boolean(exists);

        } catch (error) {
            console.error(error);
        }
    },

    async rpush(key, obj) {
        

        try {
            if ( redis.status !== 'ready'){
                await redis.connect()
            }

            //console.log({key, obj});
            
        
            await redis.rpush(key, obj);

        } catch (error) {
            console.error(error);
        }
    },


    async lrange(key, start, stop) {
  
        try {
            if ( redis.status !== 'ready'){
                await redis.connect()
            }

        
            const serializedAll = await redis.lrange(key, start, stop);
            const all = serializedAll.map(item => JSON.parse(item));

            return all;

        } catch (error) {
            console.error(error);
        }
    },


    async lset(key, obj) {
  
        //console.log( key, obj);
        
        try {
            if ( redis.status !== 'ready'){
                await redis.connect()
            }

            const serializedAll =  await redis.lrange(key, 0, -1);
            const all = serializedAll.map(item => {

                item = JSON.parse(item)
                
                if (obj.id === item.id ){
                    return  JSON.stringify(obj) ;    
                }

                return  JSON.stringify(item);
            });
                       
            console.log( all );
            
            await redis.del(key);

            await redis.rpush(
                key,
                ...all
            );

            //return all;

        } catch (error) {
            console.error(error);
        }
    },

    

    async hset(key, map) {

      
        try {
            if ( redis.status !== 'ready'){
                await redis.connect()
            }

            await redis.hset(key, map);
        } catch (error) {
            console.error(error);
        }
    },

    async hget(key) {

        try {
            
            if ( redis.status !== 'ready'){
                await redis.connect()
            }

            const value = await redis.hgetall(key);

            return value;
        } catch (error) {
            console.error(error);
        }

        return null;
    },

    async del(key) {

        try {
            if ( redis.status !== 'ready'){
                await redis.connect()
            }

            await redis.del(key);
        } catch (error) {
            console.error(error);

        }
    },

    async set(key, value) {

        try {

            if ( redis.status !== 'ready'){
                await redis.connect()
            }

            await redis.set(key, value);
        } catch (error) {
            console.error(error);
        }     
    },

    async get(key) {

        try {

            if ( redis.status !== 'ready'){
                await redis.connect()
            }

            const value = await redis.get(key);

            return value;
        } catch (error) {
            console.error( error );
        }
        
        return null;
    },

    async keys(key) {

        try {

            if ( redis.status !== 'ready'){
                await redis.connect()
            }

            const value = await redis.keys(key);
            return value;
        } catch (error) {
            console.error( error );
        }

        return null;
    },

    
    async mget(keys) {

        try {

            if ( redis.status !== 'ready'){
                await redis.connect()
            }

            const value = await redis.mget(keys);
            return value;
        } catch (error) {
            console.error( error );
        }

        return null;
    },

    publish: async (key, value) => {
        try {

            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            
            //console.log( `publish ${key} ${value}` );
            
            if ( redis.status !== 'ready'){
                await redis.connect()
            }

            await redis.set(key, value);

            return redis.publish(key, value);
        } catch (error) {
            console.error(error);
        }
    },


    // subscribe: async (key) => {
    //     try {
    //         await redis.subscribe(key);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // },

    // onMessage : (callback) => {
    //     redis.on('message', callback);
    // },

    setStatus : async (data, key = 'systemStatus') => {

        if ( redis.status !== 'ready'){
            await redis.connect()
        }

        let status = await redis.get(key);
        
        try {
            status = JSON.parse(status);
        } catch (error) {
            status = {};
        }



        status = JSON.stringify({
            ...status,
            ...data
        });
        
        //console.log('sssssssssssssssss', data, key );


        await redis.set(key, status);
        await redis.publish(`${key}Change`, status);
    },


    setDeviceStatus : async (data) => {

        if ( redis.status !== 'ready'){
            await redis.connect()
        }

        
        let systemStatus = await redis.get('systemStatus');

        try {
            systemStatus = JSON.parse(systemStatus);

        
            if ( systemStatus.enabled !== undefined && Number(data.id) ) {
                systemStatus.enabled[data.id] = data.value;
            }
            else {
                const enabled = {}
                enabled[data.id] = data.value;

                systemStatus = {
                    ...systemStatus,
                    enabled
                };
            }

        } catch (error) {
            const enabled = {}
            enabled[data.id] = data.value;

            systemStatus = {
                enabled
            };
        }

        // const devices = await cache.getGroup('devices');
        // const lastEnable = {};
    
        // for (const element in systemStatus.enabled) {
            
        //     if ( Number(element) ){
        //         if (devices.hasOwnProperty(`devices.${Number(element)}` )){
        //             lastEnable[element] =  systemStatus.enabled[element]
        //         }   
        //     }
        // }

        // systemStatus.enabled = lastEnable;
        
        systemStatus = JSON.stringify({...systemStatus});

        await redis.set('systemStatus', systemStatus);
        await redis.publish('systemStatusChange', systemStatus);
    },



    async deleteCache(key, exclude=[]) {

        try {
            if ( redis.status !== 'ready'){
                await redis.connect()
            }

            const values = await redis.keys(key);        
            
            for (let index = 0; index < values.length; index++) {

                if ( !exclude.includes(values[index]) ){   
                    await redis.del(values[index]); 
                }
            }

        } catch (error) {
            console.error( error );
        }

        return null;
    },
}

// async function main(params) {

//     //console.log( t );
    
//     //t.deleteCache('devices.*');
//     //t.deleteCache('settings.*');
   
// }


// try {
//     main();
// } catch (error) {
//     console.error( error );
// }
    
