import mqtt from 'mqtt';
import importConfig from './helpers/importConfig.js';
import cache from './cache.js';
import redisCache from './core/redisCache.js';



const client = mqtt.connect(`${config.settings.mqtt.protocol}://${config.settings.mqtt.host}`);

client.on('connect', () => {
    client.subscribe('datalogger/import', err => {
        // if (!err) {
        //     client.publish('presence', 'Hello mqtt');
        // }
    });
});

client.on('message', async (topic, message) => {
    // message is Buffer
    const data = atob(message.toString())


    await importConfig.importJson(JSON.parse(data)) 
    
    await cache.load(); // Ricarica la cache
    
    await redisCache.publish( 'settings.reconfigure' ,  true );
    await redisCache.publish( 'settings.mqtt' ,  true )
    await redisCache.publish( 'settings.modbus' ,  true )
    await redisCache.publish( 'settings.manager' ,  true )


    client.publish('datalogger/imported', "date imported");

    //client.end();

});