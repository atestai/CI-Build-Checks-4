import Redis from 'ioredis';

import config from '../../../config.js';
import cache from '../../cache.js';
import mongoStore from '../mongoStore.js';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let status = 0;
let redis;


export default function ( options ){


    async function start(){

        if (status == 1){
            return;
        }

        console.log( ' Module Store: start');
    
        status = 1;

        const devices = await cache.getGroup('devices');
        

        redis = new Redis(config.redis)

        //redis.unsubscribe();

        for (const key in devices) {

            if (Object.prototype.hasOwnProperty.call(devices, key)) {
                const device = devices[key];
                await redis.subscribe(`realtime.${device.id}`) 
            }
        }

        redis.on('message', async (channel, message) => {
            
            try {
                const data = JSON.parse(message);

                if ( data ){
                    await mongoStore.putMessage(data);
                }
            } catch (error) {
                console.error( error );
            }
        });
    } 


    async function stop(params) {

        console.log( ' Module Store: stop');
      
        if (status == 0){
            return;
        }

        status = 0; 

        if( redis){
            redis.unsubscribe();
            redis.disconnect();
            redis = null;
        }
    }

    return {
        
        start,
        stop,
        restart: async () => {
            await stop();
            await sleep(500);
            await start();
        },

        getName : () => 'Store',
        getStatus : () => status
    }
}