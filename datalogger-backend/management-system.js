import mqtt from "mqtt";

import importConfig from "./src/helpers/importConfig.js";
import cache from "./src/cache.js";
import redisCache from "./src/core/redisCache.js";


const start = async (config) => {
    
    const clientReadId = `mqtt_${Math.random().toString(16).slice(3)}`;

    const clientRead = mqtt.connect(config.host, {
        clientReadId,
        clean: true,

        username : config.username,
        password : config.password,

        keepalive: 5,

        protocolId: 'MQTT',
        protocolVersion: 4,

        connectTimeout: 5000,
        reconnectPeriod:  3000 
    });

    clientRead.on('error', (error) =>  {
        console.error('Disconnesso dal broker MQTT');
        console.error('error', error);

    });

    clientRead.on('connect', async () => {
        console.log('Connesso al broker MQTT');

        const t = clientRead.subscribe(config.subscribe);

    });

    clientRead.on('message', async function (topic, message) {
       
        try {
            const data = JSON.parse(message.toString());
            
            if (data){
                await importConfig.importJson(data);
                await cache.load(); // Ricarica la cache
                await redisCache.publish( 'settings.reconfigure' ,  true );
            }

        } catch (error) {
            console.error(error);
        }

    });

}

try {

    start({
        host : 'mqtt://192.168.21.34:1883',
        username : 'antonio',
        password : 'antonio',
        subscribe : "1/configuration",
        
    });
} catch (error) {
    console.error(error);
    
}