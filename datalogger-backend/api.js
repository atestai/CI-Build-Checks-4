import Redis from 'ioredis';

import cors from 'cors'
import express from 'express'
import fileUpload from 'express-fileupload';

import { WebSocketServer, WebSocket } from 'ws';

import http from 'http';
import { URL } from 'url';
import knexConnect from 'knex';

import config from "./config.js"
import cryptoFunc from "./src/helpers/crypto-func.js";

import routes from './src/api/routes.js';
import cache from './src/cache.js';

import redisCache from "./src/core/redisCache.js";
import device from './src/api/controllers/device.js';


import { MongoClient } from "mongodb";

const knex = knexConnect(config.database);
const port = process.env.PORT || 5000;

const appWeb = express();
const server = http.createServer(appWeb);

const wsss = [
    new WebSocketServer({ noServer: true }),
    new WebSocketServer({ noServer: true }),
    new WebSocketServer({ noServer: true }),
    new WebSocketServer({ noServer: true })
];

wsss.forEach(wss => {

    wss.publish = (message) => {

        wss.clients.forEach((client) => {
            
            if (client.readyState === WebSocket.OPEN) {

                if (wss.devices && wss.devices.includes(message.deviceId)) {
                    client.send(JSON.stringify({
                        message
                    }));
                }
                else if (!wss.devices) {
                    client.send(JSON.stringify({
                        message
                    }));
                }
            }
        });
    }

    wss.on('connection', async (ws, request, devices) => {

        if (process.env.NODE_ENV !== 'production') {
            console.log('Client connesso');
        }

        try {

            //const user = cryptoFunc.verifyToken(request, ws);
            //console.log('Authenticated user:', user);

            const url = new URL(request.url, `http://${request.headers.host}`);
            const { pathname } = url;

          

            if (pathname === '/adsStatus') {

                try {

                    const info = await redisCache.get('upgrader');
                    wss.publish(JSON.parse( info ));
                    
                } catch (error) {
                    console.error(error);   
                }
            }

            else if (pathname === '/info') {

                try {

                    const info = await redisCache.get('systemStatus');

                    if ( info ){

                        const devices = await cache.getGroup('devices');
                        const lastEnable = {};

                        const data = JSON.parse( info );
                        const { enabled  } = data;
                        
                        for (const key in enabled) {

                            if ( Number(key) && 
                                Object.prototype.hasOwnProperty.call(enabled, key) && 
                                devices.hasOwnProperty(`devices.${Number(key)}`)
                                ) {

                                lastEnable[key] = enabled[key];
                            }
                        }

                        data.enabled = lastEnable;

                        wss.publish( data );
                    }
    
                } catch (error) {
                    console.error(error);   
                }                
            }

            else if (pathname === '/telemetry') {

                wss.devices = devices;

                if (devices){

                    for (const device of devices) {

                        const m = await redisCache.get(`showData.${device}`);
                        try {
                            if (m !== null){
                                wss.publish(JSON.parse(m));
                            }
                        } catch (error) {
                            console.error( error );
                        } 
                    }
                }
            }
            else if (pathname === '/alarms') {

                const clientMongo = new MongoClient(config.mongo.url);
                const devices = await cache.getGroup('devices');
    
                try{
                    const db = clientMongo.db(config.mongo.db);
                    const alarms = db.collection(config.mongo.alarms);

                    const results = await alarms.find({  
                        timestampDeactive : null,
                    }).toArray();

                    wss.publish(results.map( item => {
                        return {
                            ...item,
                            deviceName : devices[`devices.${item.deviceId}`].name,
                        }
                    }));

                } catch (error) {
                    console.error(error);
                }
                finally {
                    clientMongo.close();
                }
            }
            
            ws.on('message', (message) => { console.log(message) });

        } catch (error) {
            console.log(error)
        }


        ws.on('close', () => {

            if (process.env.NODE_ENV !== 'production') {
                console.log('Client disconnesso');
            }
        });

    });
});



server.on('upgrade', (request, socket, head) => {

    const url = new URL(request.url, `http://${request.headers.host}`);
    const { pathname, searchParams } = url;

    if (pathname === '/info') {
        wsss[0].handleUpgrade(request, socket, head, (ws) => {
            wsss[0].emit('connection', ws, request);
        });
    } else if (pathname === '/telemetry') {

        const devices = url.searchParams.get('device')?.split(',') || [];

        wsss[1].handleUpgrade(request, socket, head, (ws) => {
            wsss[1].emit('connection', ws, request, devices);
        });

    } else if (pathname === '/adsStatus') {
        wsss[2].handleUpgrade(request, socket, head, (ws) => {
            wsss[2].emit('connection', ws, request);
        });

    } else if (pathname === '/alarms') {
        wsss[3].handleUpgrade(request, socket, head, (ws) => {
            wsss[3].emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});



appWeb.use(cors());
appWeb.use(express.json());

// Middleware per l'upload dei file
appWeb.use(fileUpload());

appWeb.use("/ping", async (req, res) => {
    res.status(200).send('Pong');
});


// appWeb.use("/ping/:id", async (req, res) => {
//     const { id } = req.params;
//     res.status(200).json(await app.getAggregatedStats(id));
// });


appWeb.use("/api", (req, res, next) => {
    req.wss = wsss[0];
    req.telemetryWss = wsss[1];
    
    next();
}, routes);


/*
appWeb.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
*/

appWeb.use((req, res) => res.status(404).send());

try {
    console.log('node:', process.env.NODE_ENV);

    await knex.migrate.latest();

    await cache.load();

    const redis = new Redis(config.redis);

    const devices = await cache.getGroup('devices');
    
    await redis.subscribe('systemStatusChange')   
    await redis.subscribe('upgraderChange')   

    for (const key in devices) {
        if (Object.prototype.hasOwnProperty.call(devices, key)) {
            const device = devices[key];
                       
            await redis.subscribe(`showData.${device.id}`) 
            await redis.subscribe(`alarm.${device.id}`) 
        }
    }

    redis.on("message", async (channel, message) => {

    
        if ( channel === 'systemStatusChange' ) {

            try {
                const data = JSON.parse(message);

                const devices = await cache.getGroup('devices');
                const lastEnable = {};
    
                for (const element in data.enabled) {
                
                    if ( Number(element) && devices.hasOwnProperty(`devices.${Number(element)}` )){
                        lastEnable[element] = data.enabled[element]
                    }
                }

                data.enabled = lastEnable;                
                wsss[0].publish(data);

            } catch (error) {
                console.error(error);
            }
        }

        else  if ( channel === 'upgraderChange') {
            try {
                const data = JSON.parse(message);
                wsss[2].publish(data);

            } catch (error) {
                console.error(error);
            }
        }

        else  if ( channel.startsWith('alarm') ) {


            const clientMongo = new MongoClient(config.mongo.url);
            const devices = await cache.getGroup('devices');

            try{
                const db = clientMongo.db(config.mongo.db);
                const alarms = db.collection(config.mongo.alarms);

                const results = await alarms.find({  
                    timestampDeactive : null,
                }).toArray();

                
                wsss[3].publish(results.map( item => {
                    return {
                        ...item,
                        deviceName : devices[`devices.${item.deviceId}`].name,
                    }
                }));

            } catch (error) {
                console.error(error);
            }
            finally {
                clientMongo.close();
            }

        }

        else {
        
            try {
                const data = JSON.parse(message);
                wsss[1].publish(data);
            } catch (error) {
                console.error(error);
            }
        }
    });


    server.listen(port, process.env.NODE_ENV === 'production' ? '127.0.0.1' : '0.0.0.0', () => {
        console.log("Server has started on port: " + port)
    })

} catch (error) {
    console.log(error);
}


// Gestione degli errori
process.on('uncaughtException', (error) => {
    console.error('Errore non gestito:', error);
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('Ricevuto segnale SIGTERM, chiusura del server...');
    process.exit(0);
});
