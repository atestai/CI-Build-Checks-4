
import config from "../config.js";
import store from "./core/mongoStore.js";
import cache from "./cache.js";
import redisCache from "./core/redisCache.js";
import systemInfo from "./helpers/systemInfo.js";
import knexConnect from 'knex';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let serviceStart = true;
let knex;


async function cleanRealtimeDb() {

    while ( serviceStart ) {

        const safConfig = await cache.getSettings('saf');

        try {
            const size = await store.checkAndCleanDatabase(safConfig['settings.saf.maxDbSizeGB']);
            //const size = await store.checkAndCleanDatabase(1);

            redisCache.setStatus({size, maxDbSizeGB : safConfig['settings.saf.maxDbSizeGB']})
            
        } catch (error) {
            console.error(error);
        }

        await sleep(Math.ceil( safConfig['settings.saf.bufferBatchMinute'] * 60000));
       
    
    }
}


async function cleanConfigDB() {

    while ( serviceStart ) {

        try {
            await knex('restore_task').whereRaw('id <= ( select max(id) FROM restore_task WHERE status = \'?\' AND startTime < (NOW() - INTERVAL ? DAY))', [2, 7]).del();

        } catch (error) {
            console.error( error );
            
        }

        await sleep( 1000 * 60 * 60 * 24 );
    }
}




async function infoSystem() {

    while ( serviceStart ) {

        const info = await systemInfo.getSystemInfo();      
        redisCache.setStatus(info);

        await sleep(15000);
    }
}


async function upgredeSystem() {

    while ( serviceStart ) {

       try {
            const status = await redisCache.get('upgrader');
            await redisCache.publish(`upgraderChange`, status);
            
        } catch (error) {
            console.error(error);   
        }

        await sleep(10000);
    }
}


export default function () {

    async function main () {
        
        //await cache.loadSettings();
        
        serviceStart = true;

        knex = knexConnect(config.database);

        cleanRealtimeDb();

        cleanConfigDB();

        infoSystem();

        upgredeSystem();
    }


    async function stop() {

        await knex.destroy();
        serviceStart = false;
    }

    return {
        start : main,
        stop : stop
    }
}