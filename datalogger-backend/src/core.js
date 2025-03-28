import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import Redis from 'ioredis';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modulesActions = {};
const directoryPath =  path.join(__dirname, '/core/modules');


fs.readdirSync(directoryPath).forEach(async file => {

    if (!file.startsWith('.') && file.endsWith('.js')) {
        const modulePath = path.join(directoryPath, file);
        modulesActions[file] = {
            module : await import(modulePath),
            fn : undefined
        };
    }
});



import config from "../config.js"
import cache from './cache.js';

import store from "./core/mongoStore.js";
import convert from "./helpers/convert.js";

import redisCache from "./core/redisCache.js";

import Manager from "./manager.js";

import { Client } from 'ads-client';

const { convertType } = config;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function (options) {

    let adsClient = null;

    //let webSocketUpgradeInterval = true;

    let manager = undefined

    //let forward = undefined;
    //let status = undefined;
    //let allarm = undefined;

    const subscriptions = new Set();
    const dataToShowCache = new Map();


    const addSubscription = async ( ) => {

        const ads = await cache.getSettings('ads'); 
        const mainSymbol = ads['settings.ads.symbol'];

        const devices = await cache.getGroup('devices')
        
        const keys = Object.keys(devices).sort( (a, b) => {
            return  Number(a.split('.')[1]) - Number(b.split('.')[1]); 
        })



        for (let index = 0; index < keys.length; index++) {

            const device = devices[keys[index]]

            const symbol = `${mainSymbol}[${index + 1}]`;

            try {

                const currentSubscription = Array.from(subscriptions).find(s => s.settings.target === symbol );
                
                if ( currentSubscription && typeof currentSubscription.unsubscribe === 'function' ) {
                    await currentSubscription.unsubscribe();
                    subscriptions.delete(currentSubscription);
                }

                const subscription = await adsClient.subscribeValue(
                    symbol,
                    onDataRecived,   
                    device.pollingPeriod ?? 30000,
                    false
                );

               console.log(device.pollingPeriod, device.id, symbol);
                

                subscriptions.add(subscription);
            } catch (error) {

                console.error({
                    symbol,
                    error
                });
            }   
        }
    }


    const configAction = async function (options) {

        const devices = await cache.getGroup('devices');
        const deviceTypes = await cache.getGroup('deviceTypes');

        const adsData = [];

        for (const key in devices) {

            if (Object.prototype.hasOwnProperty.call(devices, key)) {

                const device = devices[key];
                const deviceType = deviceTypes[ `deviceTypes.${device.deviceTypeId}` ];

                if (!device ) {
                    console.error(' device not good');
                    continue; 
                }

                if (!device.config) {
                    console.error(' iface not good', device);
                    continue;
                }

                if (!deviceType) {
                    console.error(' deviceType not good', device);
                    continue;
                }


                let { structures } = deviceType;

                if (structures) {

                    const { host, port, pollingPeriod } = device;
                    const { unitId, byteOrder, wordOrder } = device.config;

                    const obj = {
                        ID: device.id,
                        ServerIP: host,
                        ServerNumPort: port,
                        ServerReadUnitID: unitId,
                        pollingPeriod,
                        readParameter: []
                    }

                    let index = 0;
                    let currentGroup = -1;

                    do {

                        const structure = structures[index];

                        if (['R', 'RW'].includes(structure.modbusAccess)) {

                            const type = structure.modbusType + ':' + byteOrder + wordOrder


                            if (obj.readParameter[currentGroup] && obj.readParameter[currentGroup].ModbusFunction === structure.modbusFunction &&
                                ((obj.readParameter[currentGroup].ReadAddress + obj.readParameter[currentGroup].ReadQty) === (structure.modbusAddress))
                            ) {

                                obj.readParameter[currentGroup].ReadQty += convertType[structure.modbusType];
                                obj.readParameter[currentGroup].ReadCount += 1;

                            }

                            else {

                                currentGroup++;

                                obj.readParameter.push({
                                    id: structure.id,
                                    ReadAddress: structure.modbusAddress,
                                    //ReadAddress : structure.modbusAddress,
                                    ReadQty: convertType[structure.modbusType],
                                    ReadCount: 1,
                                    ModbusFunction: structure.modbusFunction,
                                    //TypeArr: [type],
                                })
                            }
                        }

                        index++;

                    } while (index < structures.length);

                    obj.readParameterCounter = obj.readParameter.length;
                    obj.max = obj.readParameter.reduce((max, obj) => obj.ReadQty > max.ReadQty ? obj : max).ReadQty;

                    adsData.push(obj);
                }
            
            }
        }

        // const newAdsData = [];

        // for (let index = 0; index < [...adsData].length; index++) {
        //     const element = adsData[index];

        //     const size = 16;
        //     const chunc = Math.ceil( element.readParameter.length / size ); 

        //     let c = 0;

        //     while (c < chunc){

        //         const primo = c * size;
        //         const secondo = primo + size;

        //         const a =  element.readParameter.slice(primo, secondo);
                
                
        //         newAdsData.push({
        //             ...element,
        //             readParameter: a,
        //             readParameterCounter : a.length
        //         })

        //         c += 1;
        //     }            
        // }


        const newAdsData = [...adsData];


        await newAdsClient();

        try {
            if (!adsClient.connection.connected) {
                await adsClient.connect();
            }
        } catch (error) {
            console.error(error);
            throw error;
        }


        if (adsClient.connection.connected) {   

            const modbus = await cache.getSettings('modbus');
            //console.log( modbus );

            try {

                const primaryTime = modbus['settings.modbus.primaryTime'];
                await adsClient.writeValue('GVL.primaryTime', primaryTime, true)


            } catch (error) {
                console.error(error);
            }


            try {

                const enableRTU = modbus['settings.modbus.enableRTU'];                
                await adsClient.writeValue('GVL.enableRTU', enableRTU != 0, true)

            } catch (error) {
                console.error(error);
            }


            const ads = await cache.getSettings('ads');
            const symbol = ads['settings.ads.symbol'];

            for (let index = 0; index < newAdsData.length; index++) {
                const element = newAdsData[index];

                if (process.env.NODE_ENV !== 'production') {
                    console.log({
                        ID: element.ID,
                        ServerIP: element.ServerIP,
                        readParameterCounter: element.readParameter.length,
                        max: element.max
                    });
                }

                try {
                    await adsClient.writeValue(`${symbol}[${index + 1}]`, element, true)
                } catch (error) {
                    console.error(error);
                }
            }


            try {
                await adsClient.writeValue(`${symbol}Count`, newAdsData.length, true)
            } catch (error) {
                console.error(error);
            }


            try {
                await adsClient.writeValue('MAIN.start', true, true)
                await adsClient.writeValue('GVL.PLC_On', true, true)
            } catch (error) {
                console.error(error);
            }

            redisCache.setStatus({status : false}, 'upgrader');
        }
    }


    const debug = async function () {

        const devicesIds = [10]

        const data = await store.getMessages({
            type: 'store',
            devicesIds,
            startTime: 1725363926727,
            endTime: 1725363928378
        });

        console.log(data.length);

    }


    const execAction = async function () {

        try {

            Object.values(modulesActions).forEach(async moduleAction => {
                moduleAction.fn = moduleAction.module.default();
                moduleAction.fn.start();
            });


            manager = Manager();
            manager.start();

            await newAdsClient();

            if (!adsClient.connection.connected) {
                await adsClient.connect();
            }

        } catch (error) {
            console.error(error);
        }
    }


    const loadCache = async function (options) {
        await cache.load(options);
    }


    const newAdsClient = async function () {

        const ads = await cache.getSettings('ads');

        console.log( {ads });
        
        
        if (adsClient === null) {

            try {

                const adsConfig = ( ads['settings.ads.targetAmsNetId'] === '127.0.0.1.1.1' ||  ads['settings.ads.targetAmsNetId'] === 'localhost') ? {
                    targetAmsNetId: ads['settings.ads.targetAmsNetId'],
                    targetAdsPort: Number(ads['settings.ads.targetAdsPort'])
                } : {
                    // localAmsNetId: ads['settings.ads.localAmsNetId'],
                    // localAdsPort: Number(ads['settings.ads.localAdsPort']),
                    targetAmsNetId: ads['settings.ads.targetAmsNetId'],
                    targetAdsPort: Number(ads['settings.ads.targetAdsPort']),
                    // routerAddress: ads['settings.ads.routerAddress'],
                    // routerTcpPort: Number(ads['settings.ads.routerTcpPort'])
                }

                console.log('adsConfig:', adsConfig);

                adsClient = new Client(adsConfig);

                adsClient.on('connectionLost', async () => {

                    console.error(Date.now(), ' ------ ADS connectionLost');

                    redisCache.setStatus({ ads: 'connectionLost' })


                })


                adsClient.on('disconnect', async err => {

                    console.error(Date.now(), ' ------ ADS disconnect');
                    console.error( err );

                    redisCache.setStatus({ ads: 'disconnect' })
                })


                adsClient.on('connect', async connectionInfo => {

                    console.error(Date.now(), ' ------ ADS connect', connectionInfo);

                    redisCache.setStatus({ ads: 'connect' })
                    
                    if ( connectionInfo.connected ) {
                        await addSubscription();
                    }
                })

                return adsClient;

            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    }

 
    const parseGroup = function(options ){

        const {cachedDevice, group, deviceTypes} = options;

        const data = {};
        const Values = []

        let {structures} = deviceTypes[`deviceTypes.${ cachedDevice.deviceTypeId}`];

        const {id, ReadCount, AuxArr, bError } = group

        //console.log( bError );
        
        //if (cachedDevice.id == 1 && ReadAddress == 32015){
            //console.log(id, ReadCount, TypeArr, AuxArr);
      
            const offset = structures.findIndex(structure => structure.id == id );

            let dataPointer = 0;

            for (let index = 0; index < ReadCount; index++) {

                const structure = structures[offset + index];

                // {
                //     id: 10814,
                //     deviceTypeId: 2,
                //     name: 'Protoco l version [Modb us]',
                //     description: 'high- character: main version; Upgrade on Incompatible Changes',
                //     modbusFunction: '4',
                //     modbusAddress: 30068,
                //     modbusType: 'UINT32',
                //     modbusAccess: 'R',
                //     measureUnit: null,
                //     gain: 1,
                //     diff: 0,
                //     function: null,
                //     postFunction: null,
                //     createdAt: 2024-12-06T10:48:25.000Z,
                //     updateAt: null,
                //     showOnGraphic: 0,
                //     bitmask: undefined,
                //     enumeration: undefined
                //   }
                
                const { id , name, modbusType,  gain, diff, measureUnit, postFunction, showOnGraphic , signalType } = structure;
                const number = modbusType.slice(-2) / 16
                

                // const [type, order] = TypeArr[index].split(':');
                // console.log(number , order);
            
                if ( !bError){
                    if ( number === 1){

                        const word = AuxArr[dataPointer];
    
                        try {
                            Values[index] = modbusType.charAt(0) === 'U' ? 
                            convert.wordToUint16( word ) :
                            convert.wordToInt16( word )
    
                        
                        } catch (error) {
    
                            console.error({modbusType, word , error});
                            Values[index] = null;
                        }
                    }
                    else if ( number === 2){
    
                        const highWord = cachedDevice.config.wordOrder === 'BE' ? AuxArr[dataPointer] : AuxArr[dataPointer + 1];
                        const lowWord = cachedDevice.config.wordOrder === 'BE' ? AuxArr[dataPointer + 1] : AuxArr[dataPointer];
                        
                        try {
                            Values[index] = modbusType.charAt(0) === 'U' ? 
                                convert.wordsToUint32(highWord, lowWord )  : 
                            modbusType.charAt(0) === 'F' ? 
                                buffer.readFloatLE(0) : 
    
                                convert.wordsToInt32(highWord, lowWord ) ;
    
                        }
                        catch (error) {
                            console.error({modbusType, highWord, lowWord, error});
                            Values[index] = null;
                        }
                    }
    
    
                    if (  Values[index] ){

                        Values[index] = gain != 1 ? (Values[index] * gain) : Values[index];
    
                        if (diff !== undefined) {
                            Values[index] -= diff;
                        }
    
                        if (postFunction) {
    
                            // Deserializzazione
                            try {
                                //const reconstructedFunction = new Function(`return (value) => {${postFunction}}`)();
                                //Values[index] = reconstructedFunction(Values[index]);
                                Values[index] = {
                                    value: Values[index],
                                    postFunction
                                }

                            } catch (error) {
                                console.error(postFunction);
                                console.error(error);
    
                                Values[index] = null;
                            }
                        }
                        else{
                            try {
                                Values[index] = Number(Values[index].toFixed(2)); 
                            } catch (error) {
                                console.error( error );
                            }
                        }

    
                      
                        
                     
    
                        // if (cache.settings.system.enableBitmask && element.bitmask && value != NaN) {
    
                        //     const data = []
    
                        //     element.bitmask.forEach(mask => {
    
                        //         const i = parseInt(mask.position);
    
                        //         data.push({
                        //             id: mask.id,
                        //             active: (((value & Math.round(Math.pow(2, i))) != 0 && mask.onValue == 1) ||
                        //                 (value & Math.round(Math.pow(2, i))) == 0 && mask.onValue == 0)
                        //         })
                        //     });
    
                        //     if (signalData.bitmasks === undefined) {
                        //         signalData.bitmasks = {}
                        //     }
    
                        //     signalData.bitmasks[name] = data;
                        // }
    
                        // else if (cache.settings.system.enableEnumeration && element.enumeration && value != NaN) {
    
                        //     if (signalData.enumerations === undefined) {
                        //         signalData.enumerations = {}
                        //     }
    
                        //     const data = element.enumeration.find(item => item.value === value);
    
                        //     //if (data){
                        //     signalData.enumerations[name] = { id: data?.id, value };
                        //     //} 
                        // }
                    }


                    // if (cache.settings.system.enableBitmask && element.bitmask && value != NaN) {

                    //     const data = []

                    //     element.bitmask.forEach(mask => {

                    //         const i = parseInt(mask.position);

                    //         data.push({
                    //             id: mask.id,
                    //             active: (((value & Math.round(Math.pow(2, i))) != 0 && mask.onValue == 1) ||
                    //                 (value & Math.round(Math.pow(2, i))) == 0 && mask.onValue == 0)
                    //         })
                    //     });

                    //     if (signalData.bitmasks === undefined) {
                    //         signalData.bitmasks = {}
                    //     }

                    //     signalData.bitmasks[name] = data;
                    // }

                    // else if (cache.settings.system.enableEnumeration && element.enumeration && value != NaN) {

                    //     if (signalData.enumerations === undefined) {
                    //         signalData.enumerations = {}
                    //     }

                    //     const data = element.enumeration.find(item => item.value === value);

                    //     //if (data){
                    //     signalData.enumerations[name] = { id: data?.id, value };
                    //     //} 
                    // }
                }

                else{
                    Values[index] = null;
                }


                const signalName = convert.escapeForJSON(name);

                data[signalName] = {
                    id, 
                    value: Values[index],
                    measureUnit,
                    signalType,
                    show: showOnGraphic
                }

                dataPointer += number;
            }
        //} 
       
       return data
        
    }


    const onDataRecived = async (data )=> {

        

        if (data && data.timestamp && data.value) {

            const devices = await cache.getGroup('devices');
            const deviceTypes = await cache.getGroup('deviceTypes');

            const { value: device } = data;

            const cachedDevice = devices[`devices.${ device.ID}`];

            const timestamp = new Date(data.timestamp).getTime() ?? device.readTimestamp * 1000;

            const {CheckComm = 0} = device;

            redisCache.setDeviceStatus( { id : device.ID, value: !CheckComm } );

            if (cachedDevice) {

                const signalData = {
                    deviceId: device.ID,
                    timestamp,
                    data: {}
                }

                let dataToShow = {}

                for (let index = 0; index < device.readParameterCounter; index++) {

                    const group = device.readParameter[index];

                    try {
                        const dataGroup = parseGroup({cachedDevice, group, deviceTypes});

                        

                        for (const key in dataGroup) {
                            if (dataGroup.hasOwnProperty(key)) {
                                const element = dataGroup[key];

                                signalData.data[key] = element.value;
                                                                
                                if (element.show) {
                                    dataToShow[key] = {
                                        id :element.id,
                                        value: element.value, 
                                        measureUnit: element.measureUnit,
                                        signalType : element.signalType
                                    };
                                }
                            }
                        }

                    } catch (error) {
                        console.error( error );
                    }  
                }

             
                for (const key in signalData.data) {
                    if (Object.prototype.hasOwnProperty.call(signalData.data, key)) {

                        const element = signalData.data[key];

                        if ( element && Object.prototype.hasOwnProperty.call(element, 'postFunction')) {

                            try {
                                const reconstructedFunction = new Function(`return (value, metrics) => {${element.postFunction}}`)();
                                signalData.data[key] = reconstructedFunction(element.value, signalData.data);

                            } catch (error) {
                                console.error(error);
                                signalData.data[key] = element.value;
                            }
                        }
                    }
                }
                

                // signalData.data =  signalData.data.map( item => {
                //     item
                // })
                


                if (process.env.NODE_ENV !== 'production' && signalData.deviceId == 6) {

                    //console.log( dataToShow );
                    
                    console.log({
                        timestamp :new Date(signalData.timestamp),
                        CheckComm, 
                        deviceId : signalData.deviceId, 
                        deviceTypeId : cachedDevice.deviceTypeId, 
                        pollingPeriod: cachedDevice.pollingPeriod,
                        signalData
                    });
                }


                //console.log( Object.keys( signalData.data ).length);
                //await queue.add({ priority: 'realtime', message: signalData });

                await redisCache.publish( `realtime.${signalData.deviceId}` ,  signalData )

                //await store.putMessage(signalData);

                await redisCache.publish( `showData.${signalData.deviceId}` ,  {
                    deviceId: signalData.deviceId,
                    timestamp: signalData.timestamp,
                    data : dataToShow
                })
               
            }
        }
    }



    const removeSubscription = async () => {

        subscriptions.forEach(async subscription => {

            if ( subscription && typeof subscription.unsubscribe === 'function') {

                //console.log( subscription );

                try {
                    await subscription.unsubscribe()

                } catch (error) {
                    console.error(error);
                }
            }
        })

        subscriptions.clear();

        // if (subscriptionTime ){

        //     try {
        //         await subscriptionTime.unsubscribe();    
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
    }


    const startAction = async () => {
        
        console.log(' -- start loadCache');
        await loadCache();
        redisCache.setStatus( {} );
        console.log(' -- end loadCache');

        console.log(' -- start configuration');
        await configAction();
        console.log(' -- end configuration');

        console.log(' -- start execAction');
        await execAction();
        console.log(' -- end execAction');

        const redis = new Redis(config.redis);

        await redis.subscribe(`settings.modbus`);
        await redis.subscribe(`settings.reconfigure`);
        await redis.subscribe(`settings.mqtt`);
        await redis.subscribe(`settings.manager`);
        await redis.subscribe(`settings.store`);
       
        await redis.subscribe(`settings.alarms`);
        
        redis.on("message", async (channel, message) => {

            console.log( channel, message );
            
            if (channel === 'settings.modbus') {
                await setModbusSetting();
            }

            if (channel === 'settings.reconfigure') {
                await configAction();

                Object.values(modulesActions).forEach(async moduleAction => {
                    moduleAction.fn.restart();
                });

            }

            if (channel === 'settings.mqtt') {

                Object.values(modulesActions).forEach(async moduleAction => {
                    if ( moduleAction.fn.getName() === 'Forward' ) {
                        moduleAction.fn.restart();
                    }                   
                });

            }

            if (channel === 'settings.store') {
                Object.values(modulesActions).forEach(async moduleAction => {
                    if ( moduleAction.fn.getName() === 'Store' ) {
                        moduleAction.fn.restart();
                    }                   
                });
            }

            if (channel === 'settings.alarms') {
                Object.values(modulesActions).forEach(async moduleAction => { 
                    if ( moduleAction.fn.getName() === 'Alarm' ) {
                        moduleAction.fn.restart();
                    }                   
                });
            }

            if (channel === 'settings.manager') {
                await restartManager();
            }

        });
    }


    const stopAction = async () => {
        console.log(' --- stop system --- ');

        if (adsClient.connection.connected) {

            await removeSubscription();
            await adsClient.disconnect();

            adsClient = null;
        }


        Object.values(modulesActions).forEach(async module => {
            (module.default()).stop();
        });

    }

    const setModbusSetting = async () => {

        await newAdsClient();

        try {
            if (!adsClient.connection.connected) {
                await adsClient.connect();
            }
        } catch (error) {
            console.error(error);
            throw error;
        }


        if (adsClient.connection.connected) {

            const modbus = await cache.getSettings('modbus');


            const primaryTime = modbus['settings.modbus.primaryTime'] ?? 10000;

            if (primaryTime) {
                console.log('---------------------primaryTime:', primaryTime);

                try {
                    await adsClient.writeValue('GVL.primaryTime', primaryTime, true)

                } catch (error) {
                    console.error(error);
                    throw error
                }
            }
        }
    }

    const configure = async (options) => {

        await loadCache(options);
        await configAction(options);

        await removeSubscription();
        await addSubscription();
    }


    // const restartForward = async () => {

    //     Object.values(modulesActions).forEach(async module => {
    //         if ( (module.default()).getName() === 'Forward' ){
    //             (module.default()).restart();
    //         }
    //     });
    // }

    const restartManager = async () => {

        if ( manager )  {
            await manager.stop();
            await sleep(250);
            await manager.start();
        }

    }
    

    return {
        getCore: () => this,
        getStore: () => store,

        getDataToShowCache : () => dataToShowCache,

        debug,
        loadCache,

        getCache: () => cache,
        getAdsClient: () => adsClient,

        configure,

        start: startAction,
        stop: stopAction,

        restart: async () => {
            await stopAction();
            await sleep(500);
            await startAction();
        },

        setModbusSetting,

    }
}