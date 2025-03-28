
import config from '../../../config.js';
import cache from '../../cache.js';

import { MongoClient, ObjectId } from 'mongodb';

export class Alarms {

    // constructor() {
    //     super(
    //         'alarms',
    //         {
    //             parameters: [
    //                 'timestampActive',
    //                 'deviceId',
    //                 'isActive',
    //                 'activeValue',
    //                 'previousValue',
    //                 'configurationAlarmId',
    //                 'timestampDeactive',
    //             ],

    //             relations: [
    //                 {
    //                     tableName: 'configuration_alarms',
    //                     id: 'configurationAlarmId'
    //                 },
    //                 {
    //                     tableName: 'device',
    //                     id: 'deviceId'
    //                 }
    //             ],

    //             sort: 'isActive',
    //             paranoid : false
    //         });
    // }


    // async add(req, res) {

    //     try {

    //         const {
    //             timestampActive = undefined,
    //             deviceId = undefined,
    //             configurationAlarmId = undefined,
    //             isActive = undefined,
    //             activeValue = undefined,
    //             previousValue = undefined,
    //             timestampDeactive = undefined,

    //         } = req.body


    //         if (configurationAlarmId) {

    //             if (!validators.validateId(configurationAlarmId)) {
    //                 return res.status(400).json({
    //                     code: 403,
    //                     message: 'Invalid parameter: configurationAlarmId'
    //                 });
    //             }
    //         }

    //         const configurationAlarm = await this.knex('configuration_alarms').where({ id: configurationAlarmId, deleted: '0' }).first();

    //         if (!configurationAlarm) {
    //             return res.status(400).json({
    //                 code: 404,
    //                 message: 'No Alarm found.'
    //             });
    //         }


    //         if (deviceId) {

    //             if (!validators.validateId(deviceId)) {
    //                 return res.status(400).json({
    //                     code: 403,
    //                     message: 'Invalid parameter: deviceId'
    //                 });
    //             }
    //         }

    //         const asset = await this.knex('device').where({ id: deviceId, deleted: '0' }).first();

    //         if (!asset) {
    //             return res.status(400).json({
    //                 code: 404,
    //                 message: 'No Asset found.'
    //             });
    //         }

    //         const deviceTypeId = asset.deviceTypeId;

    //         if (timestampActive) {
    //             if (!validators.validateString(timestampActive)) {
    //                 return res.status(400).json({
    //                     code: 401,
    //                     message: 'Invalid parameter: timestampActive'
    //                 });
    //             }
    //         }


    //         if (isActive) {
    //             if (!validators.validateNumber(isActive)) {
    //                 return res.status(400).json({
    //                     code: 404,
    //                     message: 'Invalid parameter: isActive'
    //                 });
    //             }
    //         }


    //         if (activeValue) {
    //             if (!validators.validateNumber(activeValue)) {
    //                 return res.status(400).json({
    //                     code: 404,
    //                     message: 'Invalid parameter: activeValue'
    //                 });
    //             }
    //         }


    //         if (previousValue) {
    //             if (!validators.validateNumber(previousValue)) {
    //                 return res.status(400).json({
    //                     code: 404,
    //                     message: 'Invalid parameter: previousValue'
    //                 });
    //             }
    //         }



    //         if (timestampDeactive) {
    //             if (!validators.validateString(timestampDeactive)) {
    //                 return res.status(400).json({
    //                     code: 401,
    //                     message: 'Invalid parameter: timestampDeactive'
    //                 });
    //             }
    //         }



    //         const alarm = await this.addRow(req, {
    //             timestampActive: timestampActive,
    //             deviceId,
    //             isActive,
    //             message : configurationAlarm.message,
    //             name :configurationAlarm.name,
    //             severity : configurationAlarm.severity,
    //             configurationAlarmId,
    //             activeValue,
    //             previousValue,
    //             timestampDeactive: timestampDeactive,
    //         })

    //         if (alarm?.id) {

    //             const meta = {
    //                 body: req.body,
    //                 token: req.newToken
    //             }

    //             await redisCache.publish( 'settings.alarms' ,  true )

    //             return res.status(201).json({ alarm, meta });
    //         }


    //     } catch (error) {

    //         console.log(error);
    //         return res.status(500).json({ error });
    //     }

    // }


    // async edit(req, res) {


    //     const { id } = req.params;
    //     let asset = null;
    //     if (!validators.validateId(id)) {
    //         return res.status(404).send();
    //     }



    //     try {
    //         asset = await this.knex(this.tableName).where({ id }).first();

    //         if (!asset) {
    //             return res.status(404).json({
    //                 code: 404,
    //                 message: `A Element with this id: ${id} does not exist.`
    //             });
    //         }
    //     } catch (error) {

    //         console.log(error);
    //         return res.status(500).json(
    //             { error }
    //         );
    //     }


    //     const {
    //         timestampActive = undefined,
    //         signalId = undefined,
    //         message = undefined,
    //         isActive = undefined,
    //         activeValue = undefined,
    //         previousValue = undefined,
    //         priority = undefined,
    //         timestampDeactive = undefined,
    //     } = req.body


    //     const deviceTypeId = asset.deviceTypeId;


    //     if (!validators.validateId(signalId)) {
    //         return res.status(400).json({
    //             code: 401,
    //             message: 'Invalid parameter: signalId.'
    //         });
    //     }

    //     const data = await this.knex('devicetype_data_structure').where({ id: signalId, deviceTypeId: deviceTypeId }).first()

    //     if (!data) {
    //         return res.status(409).json({
    //             code: 402,
    //             message: `No Singal found.`
    //         });
    //     }




    //     if (timestampActive) {
    //         if (!validators.validateTimestamp(timestampActive)) {
    //             return res.status(400).json({
    //                 code: 401,
    //                 message: 'Invalid parameter: timestampActive'
    //             });
    //         }
    //     }

    //     const timestampActiveConvert = new Date(timestampActive * 1000);


    //     if (isActive) {
    //         if (!validators.validateNumber(isActive)) {
    //             return res.status(400).json({
    //                 code: 404,
    //                 message: 'Invalid parameter: isActive'
    //             });
    //         }
    //     }


    //     if (activeValue) {
    //         if (!validators.validateNumber(activeValue)) {
    //             return res.status(400).json({
    //                 code: 404,
    //                 message: 'Invalid parameter: activeValue'
    //             });
    //         }
    //     }


    //     if (previousValue) {
    //         if (!validators.validateNumber(previousValue)) {
    //             return res.status(400).json({
    //                 code: 404,
    //                 message: 'Invalid parameter: previousValue'
    //             });
    //         }
    //     }

    //     if (message) {
    //         if (!validators.validateString(message)) {
    //             return res.status(400).json({
    //                 code: 401,
    //                 message: 'Invalid parameter: message'
    //             });
    //         }
    //     }

    //     if (priority) {
    //         if (!validators.validateNumber(priority)) {
    //             return res.status(400).json({
    //                 code: 404,
    //                 message: 'Invalid parameter: priority'
    //             });
    //         }
    //     }

    //     if (timestampDeactive) {
    //         if (!validators.validateTimestamp(timestampDeactive)) {
    //             return res.status(400).json({
    //                 code: 401,
    //                 message: 'Invalid parameter: timestampDeactive'
    //             });
    //         }
    //     }

    //     const timestampDeactiveConvert = new Date(timestampDeactive * 1000);






    //     try {

    //         await this.editRow(req, id, {
    //             deviceId: id,
    //             deviceTypeId,
    //             timestampActive: timestampActiveConvert,
    //             signalId,
    //             message,
    //             isActive,
    //             activeValue,
    //             previousValue,
    //             priority,
    //             timestampDeactive: timestampDeactiveConvert,
    //         })


    //         await redisCache.publish( 'settings.alarms' ,  true )

    //         return res.status(200).json({
    //             alarm: { id }
    //         });

    //     } catch (error) {

    //         console.log(error);

    //         return res.status(500).json(
    //             { message: error }
    //         );
    //     }
    // }


    // async delete(req, res) {

    //     return super.delete(req, res, () => {
    //         redisCache.publish('settings.alarms', true)
    //     })
    // }


    // async getAll(req, res) {

    //     let {
    //         fields = undefined,
    //         page = config.pagination.page,
    //         limit = config.pagination.limit,
    //         sort = this.sort
    //     } = req.query;


    //     // const where = Object.keys(req.query).reduce((acc, k) =>
    //     //     this.parameters.includes(k) ? [...acc, { [k]: req.query[k] }] : acc, []);
    //     const where = req.query;

    //     const countQuery = this.knex(this.tableName)

    //     if (this.paranoid) {
    //         countQuery.where({ deleted: '0' });
    //     }




    //     const count = await countQuery.count('id as total').first();
    //     const { total } = count;

    //     if (page <= 0) {
    //         page = 1;
    //     }

    //     const pages = Math.ceil(total / limit);
    //     const offset = limit * (page - 1);

    //     const meta = {
    //         total,
    //         pages,
    //         offset,
    //         limit,
    //         page,
    //         token: req.newToken
    //     };

    //     try {

    //         if (this.relations !== undefined) {

    //             this.relations.forEach(async element => {


    //                 const data = await this.knex(element.tableName).select();

    //                 element.map = new Map();

    //                 data.forEach(item => {
    //                     element.map.set(item.id, item)
    //                 });

    //             });
    //         }

    //         const query = this.knex(this.tableName);

    //         if (this.paranoid) {
    //             query.where({ deleted: '0' });
    //         }


    //         const now = new Date();
    //         const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime(); // Mezzanotte
    //         const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - 1; // Fine giornata



    //         // this.applyWhereConditions(query, where);

    //         const selectFields = fields ? fields.split(',') : `${this.tableName}.*`;
    //         const data = await query.select(selectFields)
    //             .orderByRaw(`
    //             CASE 
    //                 WHEN CAST(timestampActive AS UNSIGNED) BETWEEN ? AND ? THEN 0
    //                 ELSE 1
    //             END, 
    //             CAST(timestampActive AS UNSIGNED) DESC
    //         `, [startOfDay, endOfDay]).limit(limit).offset(offset);


            

    //         if (this.relations !== undefined) {

    //             data.map(item => {

    //                 this.relations.forEach(async relation => {
    //                     const key = relation.id.slice(0, -2);
    //                     item[key] = relation.map.get(item[relation.id])
    //                 })
    //             })
    //         }



    //         data.map(item => {
    //             if (item.configurationAlarm.name === where) {
    //                 return item;
    //             }
    //         })



    //         const filteredData = data.filter(item => {

    //             if (Object.keys(where).length === 0) {
    //                 return true; // Nessun filtro, restituisci tutti gli elementi
    //             }

    //             const alarmName = item.configurationAlarm.name;
    //             const timestampActive = item.timestampActive;
    //             const timestampDeactive = item.timestampDeactive;
    //             const isActive = item.isActive;

    //             for (let key in where) {

    //                 if (key == 'name') {

    //                     const condition = where[key];
    //                     if (!new RegExp(condition, "gi").test(alarmName)) {
    //                         return false;
    //                     }

    //                 } else if (key == 'selectedDateStart') {

    //                     const selectedDateStart = new Date(Number(where[key]));
    //                     const dateFromFormattedString = new Date(timestampActive); 

                      

    //                     if (dateFromFormattedString.getTime() < selectedDateStart.getTime()) {
    //                         return false;
    //                     }

    //                 } else if (key === 'selectedDateEnd' && timestampDeactive) {
    //                     const dateFromFormattedString = new Date(timestampDeactive); // Aggiungiamo 'T' per compatibilità
    //                     const selectedDateEnd = new Date(Number(where[key]));

    //                     if (dateFromFormattedString.getTime() > selectedDateEnd.getTime()) {
    //                         return false;
    //                     }

    //                 } else if (key === 'realTime') {
    //                     const realTime = where[key];

    //                     if (realTime) {
    //                         if (timestampDeactive != null) {
    //                             return false;
    //                         }
    //                     }
    //                 }

    //             }
    //             return true;

    //         });


    //         return res.status(200).json({
    //             meta,
    //             data: filteredData.map(item => {
    //                 delete item.password;
    //                 return item;
    //             })
    //         });

    //     } catch (error) {
    //         console.log(error);
    //         return res.status(400).send();
    //     }
    // }


    async getOne(req, res) {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                code: 401,
                message: 'Invalid parameter: id'
            });
        }

        const clientMongo = new MongoClient(config.mongo.url);

        try {
            const db = clientMongo.db(config.mongo.db);
            const alarms = db.collection(config.mongo.alarms);
    
            const result = await alarms.findOne({ _id: new ObjectId(String(id)) });

            if (!result) {
                return res.status(404).json({
                    code: 404,
                    message: 'No Alarm found.'
                });
            }

            return res.status(200).json(result);

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        } finally {
            clientMongo.close();    
        }

    }



    async getAll(req, res) {
        
        const {
            realTime = undefined,
            startDate = undefined,
            endDate = undefined,
            pageSize = 100,
            pageNumber = 1,
            sort = -1

        } = req.query;

        

        const clientMongo = new MongoClient(config.mongo.url);

        try {
           
            const devices = await cache.getGroup('devices');

            const query = {};

            // if (realTime && JSON.parse(realTime)) {
            //     query.timestampDeactive = null;
            // }

            // if (realTime && JSON.parse(realTime)) {
            //     console.log("SOno quaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                

            //     query.timestampDeactive = null;
            // }

            // if (!realTime) {
            //     query.timestampDeactive = { $ne: null }; 
            // }


            if (realTime && JSON.parse(realTime) === true) {
                query.timestampDeactive = null;
            }
            
            
            if (realTime && JSON.parse(realTime) === false) {
                query.timestampDeactive = { $ne: null }; 
            }



            if (startDate) {
                query.timestampActive = {
                    $gte: new Date(Number(startDate))
                }
            }

            if (endDate) {
                query.timestampDeactive = {
                    $lte: new Date(Number(endDate))
                }
            }



            
           
            
            const db = clientMongo.db(config.mongo.db);
            const alarms = db.collection(config.mongo.alarms);

            const skip = (pageNumber - 1) * pageSize;


            const results = await alarms.find(query)
                .sort({ timestampActive: sort })
                .skip(skip)
                .limit( Number(pageSize))
                .toArray();

            const totalItems = await alarms.countDocuments(query);
            const totalPages = Math.ceil(totalItems / pageSize);

         


            return res.status(200).json( {

                meta: { 
                    items : results.length,
                    totalItems, 
                    totalPages,
                    pageNumber, 
                    totalPages, 
                    query: { realTime, startDate, endDate, pageSize, pageNumber, sort} 
                },
                data: results.map(item => {
                    return {
                        ...item,
                        deviceName: devices[ `devices.${item.deviceId}` ].name,
                        status : item.timestampDeactive ? 'Deactive' : 'Active'
                    }}),


            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error });
        }
        finally {
            clientMongo.close();
        }

    }
}

export default new Alarms();