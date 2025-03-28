import express from 'express'

// import Aggregation from './controllers/aggregation.js'

import DataLogger from './controllers/dataLogger.js'
import DeviceType from './controllers/deviceType.js'

import DeviceTypesStructures from './controllers/deviceTypesStructures.js'
import Device from './controllers/device.js'
import Settings from './controllers/settings.js'

import User from './controllers/user.js'


//import Enumeration from './controllers/enumeration.js'

import Store from './controllers/store.js';
import System from './controllers/system.js'
import OAuth from './controllers/oauth.js'
import DeviceInterface from './controllers/interfaces.js'
import Historical_download from './controllers/historical_download.js'

import Alarms from './controllers/alarms.js'
import ConfigurationAlarms from './controllers/configurationAlarms.js'
import AssociationAssetAlarm from './controllers/associationAssetAlarm.js'
import Telemetry from './controllers/telemetry.js'
import Bitmask from './controllers/bitmask.js'
import Enumeration from './controllers/enumeration.js';


const router = express.Router()


// /** Auth */
// router.post('/:version/oauth/access_token', OAuth.accessToken);
// router.post('/:version/oauth/access_token/refresh', OAuth.refreshToken);
// router.post('/:version/oauth/login', authorize, OAuth.login);
// router.post('/:version/oauth/login_token', OAuth.loginToken);


/** Auth */
router.post('/oauth/accessToken', OAuth.accessToken);
router.post('/oauth/accessToken/refresh', OAuth.refreshToken);

/** Aggregations */
// router.get('/aggregation/:id', OAuth.authorize, Aggregation.getOne.bind(Aggregation));
// router.get('/aggregations', OAuth.authorize, Aggregation.getAll.bind(Aggregation));
// router.post('/aggregations', OAuth.authorize, Aggregation.add.bind(Aggregation));
// router.patch('/aggregation/:id', OAuth.authorize, Aggregation.edit.bind(Aggregation));
// router.delete('/aggregation/:id', OAuth.authorize, Aggregation.delete.bind(Aggregation));



/** dataLogger */
router.get('/dataLogger', OAuth.authorize, DataLogger.getAll.bind(DataLogger));
router.get('/dataLogger/:id', OAuth.authorize, DataLogger.getOne.bind(DataLogger));
router.post('/dataLogger', OAuth.authorize, DataLogger.add.bind(DataLogger));
router.patch('/dataLogger', OAuth.authorize, DataLogger.editMultiple.bind(DataLogger));
router.patch('/dataLogger/:id', OAuth.authorize, DataLogger.edit.bind(DataLogger));
router.delete('/dataLogger/:id', OAuth.authorize, DataLogger.delete.bind(DataLogger));
router.delete('/dataLogger', OAuth.authorize, DataLogger.deleteMultiple.bind(DataLogger));


/** deviceTypes */
router.get('/deviceTypes', OAuth.authorize, DeviceType.getAll.bind(DeviceType));
router.get('/deviceTypes/:id', OAuth.authorize, DeviceType.getOne.bind(DeviceType));
router.post('/deviceTypes', OAuth.authorize, DeviceType.add.bind(DeviceType));
router.patch('/deviceTypes/:id', OAuth.authorize, DeviceType.edit.bind(DeviceType));
router.delete('/deviceTypes/:id', OAuth.authorize, DeviceType.delete.bind(DeviceType));
router.delete('/deviceTypes', OAuth.authorize, DeviceType.deleteMultiple.bind(DeviceType));

router.get('/deviceTypes/:id/structures', OAuth.authorize, DeviceType.getStructures.bind(DeviceType));
router.post('/deviceTypes/:id/structures', OAuth.authorize, DeviceType.addStructures.bind(DeviceType));


/** deviceInterface */
router.get('/deviceInterface', OAuth.authorize, DeviceInterface.getAll.bind(DeviceInterface));
router.get('/deviceInterface/:id', OAuth.authorize, DeviceInterface.getOne.bind(DeviceInterface));
router.post('/deviceInterface', OAuth.authorize, DeviceInterface.add.bind(DeviceInterface));
router.patch('/deviceInterface/:id', OAuth.authorize, DeviceInterface.edit.bind(DeviceInterface));
router.delete('/deviceInterface/:id', OAuth.authorize, DeviceInterface.delete.bind(DeviceInterface));
router.delete('/deviceInterface', OAuth.authorize, DeviceInterface.deleteMultiple.bind(DeviceInterface));

/** device */
router.get('/device', OAuth.authorize, Device.getAll.bind(Device));
router.get('/device/:id', OAuth.authorize, Device.getOne.bind(Device));
router.post('/device', OAuth.authorize, Device.add.bind(Device));
router.patch('/device', OAuth.authorize, Device.editMultiple.bind(Device));
router.patch('/device/:id', OAuth.authorize, Device.edit.bind(Device));
router.delete('/device', OAuth.authorize, Device.deleteMultiple.bind(Device));
router.delete('/device/:id', OAuth.authorize, Device.delete.bind(Device));


router.get('/device/:id/interface', OAuth.authorize, Device.getInterface.bind(Device));
router.post('/device/:id/interface', OAuth.authorize, Device.addInterface.bind(Device));


router.get('/device/:id/structures', OAuth.authorize, Device.getStructures.bind(Device));


/** deviceTypesStructures */
router.get('/deviceTypesStructures', OAuth.authorize, DeviceTypesStructures.getAll.bind(DeviceTypesStructures));
router.get('/deviceTypesStructures/:id', OAuth.authorize, DeviceTypesStructures.getOne.bind(DeviceTypesStructures));
router.patch('/deviceTypesStructures/:id', OAuth.authorize, DeviceTypesStructures.edit.bind(DeviceTypesStructures));

router.delete('/deviceTypesStructures', OAuth.authorize, DeviceTypesStructures.deleteMultiple.bind(DeviceTypesStructures));
router.delete('/deviceTypesStructures/:id', OAuth.authorize, DeviceTypesStructures.delete.bind(DeviceTypesStructures));


//router.get('/deviceTypesStructures/:id/bitmask', OAuth.authorize, DeviceTypesStructures.getBitmask);
// router.post('/deviceTypesStructures/:id/bitmask', OAuth.authorize, DeviceTypesStructures.addBitmask);
// router.put('/deviceTypesStructures/:id/bitmask', OAuth.authorize, DeviceTypesStructures.putBitmask);

// router.get('/deviceTypesStructures/:id/enumeration', OAuth.authorize, DeviceTypesStructures.getEnumeration);
// router.post('/deviceTypesStructures/:id/enumeration', OAuth.authorize, DeviceTypesStructures.addEnumeration);
// router.put('/deviceTypesStructures/:id/enumeration', OAuth.authorize, DeviceTypesStructures.putEnumeration);

router.get('/settings', OAuth.authorize, Settings.getAll.bind(Settings));
router.get('/settings/:group/:key', OAuth.authorize, Settings.getFromkey.bind(Settings));
router.patch('/settings/:group/:key', OAuth.authorize, Settings.edit.bind(Settings));
router.patch('/settings/group', OAuth.authorize, Settings.editGroup.bind(Settings));


router.get('/backup/export', OAuth.authorize, System.exportData);
router.post('/backup/import', OAuth.authorize,  System.importDataV2);
// router.post('/backup/exportHistoricalData',  System.exportHistoricalData);
// router.get('/backup/downloadHistoricalData', System.downloadHistoricalData);
router.get('/export/table', OAuth.authorize, System.exportData);




router.get('/store/pendingMessage',OAuth.authorize, Store.getPendingMessage.bind(Store));
router.delete('/store',OAuth.authorize, Store.clearDb.bind(Store));
router.get('/store/message', OAuth.authorize, Store.getMessage.bind(Store));
router.get('/store/countMessages', OAuth.authorize, Store.getCountMessages.bind(Store));


router.get('/store/message/:deviceId', OAuth.authorize, Store.getMessageByDevice.bind(Store));
router.get('/store/size', OAuth.authorize, Store.getSize.bind(Store));


router.get('/system/plcStatus', OAuth.authorize, System.getPlcStatus);
router.put('/system/plcStatus', OAuth.authorize, System.setPlcStatus);
router.put('/system/:status', OAuth.authorize, System.setSystemStatus);

router.get('/system/info', OAuth.authorize, System.getSystemInfo);
router.post('/system/info', OAuth.authorize, System.setSystemInfo);

router.post('/system/reconfigure', OAuth.authorize, System.reconfigureAds);


/** user */
router.get('/user', OAuth.authorize, User.getAll.bind(User));
router.get('/user/:id', OAuth.authorize, User.getOne.bind(User));
router.post('/user', OAuth.authorize, User.add.bind(User));
router.patch('/user/:id', OAuth.authorize, User.edit.bind(User));
router.delete('/user/:id', OAuth.authorize, User.delete.bind(User));
router.patch('/user/:id/password', OAuth.authorize, User.changePassword.bind(User));


/** Histoircal Download */
router.post('/historical_download', OAuth.authorize, Historical_download.add.bind(Historical_download));

router.get('/historical_download', OAuth.authorize, Historical_download.getAll.bind(Historical_download));
router.get('/historical_download/:id', OAuth.authorize, Historical_download.startDownload.bind(Historical_download));



/** Alarms */

//router.post('/alarms', OAuth.authorize, Alarms.add.bind(Alarms));
//router.patch('/alarms/:id', OAuth.authorize, Alarms.edit.bind(Alarms));
router.get('/alarms', OAuth.authorize, Alarms.getAll.bind(Alarms));
router.get('/alarms/:id', OAuth.authorize, Alarms.getOne.bind(Alarms));
//router.delete('/alarms/:id', OAuth.authorize, Alarms.delete.bind(Alarms));


/** Configuration_alarms */

router.post('/configurationAlarm', OAuth.authorize, ConfigurationAlarms.add.bind(ConfigurationAlarms));
router.patch('/configurationAlarm/:id', OAuth.authorize, ConfigurationAlarms.edit.bind(ConfigurationAlarms));
router.get('/configurationAlarms', OAuth.authorize, ConfigurationAlarms.getAll.bind(ConfigurationAlarms));
router.get('/configurationAlarm/:id', OAuth.authorize, ConfigurationAlarms.getOne.bind(ConfigurationAlarms));
router.delete('/configurationAlarm/:id', OAuth.authorize, ConfigurationAlarms.delete.bind(ConfigurationAlarms));
router.delete('/configurationAlarms', OAuth.authorize, ConfigurationAlarms.deleteMultiple.bind(ConfigurationAlarms));


/** Alarms association*/
router.patch('/updateAssociationAssetAlarm',OAuth.authorize, AssociationAssetAlarm.edit.bind(AssociationAssetAlarm))
router.patch('/addAssociationAlarm',OAuth.authorize, AssociationAssetAlarm.addAssociationAlarm.bind(AssociationAssetAlarm)) 

router.get('/associationAssetAlarms', OAuth.authorize, AssociationAssetAlarm.getAll.bind(AssociationAssetAlarm));
router.delete('/associationAssetAlarm/:id', OAuth.authorize, AssociationAssetAlarm.delete.bind(AssociationAssetAlarm));
router.delete('/associationAssetAlarms', OAuth.authorize, AssociationAssetAlarm.deleteMultiple.bind(AssociationAssetAlarm));
 

router.get('/telemetry', Telemetry.getLast.bind(Telemetry));




/** BitMask */

router.get('/deviceTypesStructures/:id/bitmask', OAuth.authorize, Bitmask.getBitMasks.bind(Bitmask))
router.post('/deviceTypesStructures/:id/bitmask', OAuth.authorize, Bitmask.addBitmask.bind(Bitmask));
router.put('/deviceTypesStructures/:id/bitmask', OAuth.authorize, Bitmask.putBitmask.bind(Bitmask));

/** Enumeration */

router.get('/deviceTypesStructures/:id/enumeration', OAuth.authorize, Enumeration.getEnumerations.bind(Enumeration));
router.post('/deviceTypesStructures/:id/enumeration', OAuth.authorize, Enumeration.addEnumeration.bind(Enumeration));
router.put('/deviceTypesStructures/:id/enumeration', OAuth.authorize, Enumeration.putEnumeration.bind(Enumeration));



// router.get('/bitmask', OAuth.authorize, Bitmask.getAll.bind(Bitmask));
// router.get('/bitmask', OAuth.authorize, Bitmask.getAll.bind(Bitmask));

// router.get('/bitmask/:id', OAuth.authorize, Bitmask.getOne.bind(Bitmask));
// router.patch('/bitmask', Bitmask.edit);


export default router;
