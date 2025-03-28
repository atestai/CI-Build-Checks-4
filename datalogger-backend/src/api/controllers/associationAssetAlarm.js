import { BaseController } from './baseController.js';
import validators from "../../helpers/validators.js";
import redisCache from '../../core/redisCache.js';

export class Alarms extends BaseController {

    constructor() {
        super(
            'association_asset_alarm',
            {
                parameters: [
                    'assetId',
                    'alarmId',
                ],
                sort     : 'alarmId',
                paranoid : false
            }
        );
    }


    async addAssociationAlarm(req, res) {

        try {
            
            const {
                selectedAlarms = [],
                selectedAsset = [],
            } = req.body;


            for (const element of selectedAsset) {

                if (!validators.validateId(element)) {
                    return res.status(400).json({
                        code: 403,
                        message: 'Invalid parameter: Asset',
                    });
                }

                const device = await this.knex('device').where({ id: element, deleted: '0' }).first();

                if (!device) {
                    return res.status(400).json({
                        code: 404,
                        message: 'No device found',
                    });
                }
            }


            for (const element of selectedAlarms) {
                if (!validators.validateId(element)) {
                    return res.status(400).json({
                        code: 403,
                        message: 'Invalid parameter: Alarm',
                    });
                }

                const alarm = await this.knex('configuration_alarms').where({ id: element, deleted: '0' }).first();

                if (!alarm) {
                    return res.status(400).json({
                        code: 404,
                        message: 'No alarm found',
                    });
                }
            }


            const rowsToInsert = [];


            
            for (const asset of selectedAsset) {

                const associationAlarm = await this.knex(this.tableName).where({  assetId: asset })

                for (const alarm of selectedAlarms) {
                    if (!associationAlarm.find(item => item.assetId == asset && item.alarmId == alarm)) {
                        rowsToInsert.push ({ assetId: asset, alarmId: alarm });
                    }
                }
            }



            if (rowsToInsert.length > 0) {

                const insertedRows = await this.knex.transaction(async (trx) => {
                    const inserted = await trx(this.tableName).insert(rowsToInsert).returning('*');

                    // Log unico per tutte le righe inserite
                    await trx('logs').insert({
                        userId: req.auth.id,
                        entity: this.tableName,
                        operation: 'insert',
                        payload: { insertedRows: inserted },  // Usa 'inserted' invece di 'insertedRows'
                    });

                    return inserted;
                });
            }

            

            await redisCache.publish( 'settings.alarms' ,  true )

            // Restituisci la risposta con i dati inseriti
            return res.status(200).json({
                code: 200,
                message: 'The association was successful.',
            });


        } catch (error) {
            console.log('errore', error);
            return res.status(500).json({ code: 500, message: error });

        }
        
    }
 


    async edit(req, res) {

        try {
            const {
                selectedAlarms = [],
                selectedAsset = [],
            } = req.body;

            //console.log('sssssssssssssssssssssss', {selectedAsset} );
            
            for (const element of selectedAsset) {

                if (!validators.validateId(element)) {
                    return res.status(400).json({
                        code: 403,
                        message: 'Invalid parameter: Asset',
                    });
                }

                const device = await this.knex('device').where({ id: element, deleted: '0' }).first();

                if (!device) {
                    return res.status(400).json({
                        code: 404,
                        message: 'No device found',
                    });
                }
            }


            //if (selectedAlarms.length > 0 && selectedAsset.length > 0) {


        

            await this.knex.transaction(async (trx) => {

                await trx(this.tableName).where('assetId', selectedAsset[0]).whereNotIn('alarmId', selectedAlarms).del();

                /** TODO: */

                // const queries = elementSelectedRemoved.map(id => {
                //     return this.knex('logs')
                //         .insert({
                //             userId: req.auth.id,
                //             entity: this.tableName,
                //             entityId: id,
                //             operation: 'delete'
                //         })
                //         .transacting(trx);
                // });

                // await Promise.all(queries);

            });
          


                // Validazione degli allarmi
            for (const element of selectedAlarms) {
                if (!validators.validateId(element)) {
                    return res.status(400).json({
                        code: 403,
                        message: 'Invalid parameter: Alarm',
                    });
                }

                const alarm = await this.knex('configuration_alarms').where({ id: element, deleted: '0' }).first();

                if (!alarm) {
                    return res.status(400).json({
                        code: 404,
                        message: 'No alarm found',
                    });
                }
            }


            const rowsToInsert = [];


            
            for (const asset of selectedAsset) {

                const associationAlarm = await this.knex(this.tableName).where({  assetId: asset })

                for (const alarm of selectedAlarms) {
                    if (!associationAlarm.find(item => item.assetId == asset && item.alarmId == alarm)) {
                        rowsToInsert.push ({ assetId: asset, alarmId: alarm });
                    }
                }
            }



            if (rowsToInsert.length > 0) {

                const insertedRows = await this.knex.transaction(async (trx) => {
                    const inserted = await trx(this.tableName).insert(rowsToInsert).returning('*');

                    // Log unico per tutte le righe inserite
                    await trx('logs').insert({
                        userId: req.auth.id,
                        entity: this.tableName,
                        operation: 'insert',
                        payload: { insertedRows: inserted },  // Usa 'inserted' invece di 'insertedRows'
                    });

                    return inserted;
                });
            }

            

            await redisCache.publish( 'settings.alarms' ,  true )

            // Restituisci la risposta con i dati inseriti
            return res.status(200).json({
                code: 200,
                message: 'The association was successful.',
            });



        } catch (error) {
            console.log('errore', error);
            
            return res.status(500).json({ code: 500, message: error });
        }
    }


    async delete(req, res) {

        return super.delete(req, res, async() =>{
            await redisCache.publish( 'settings.alarms' ,  true )
        })
    }


     async deleteMultiple(req, res) {
    
        return super.deleteMultiple(req, res, async () =>{
            await redisCache.publish( 'settings.alarms' ,  true )
        })
    }


}

export default new Alarms();