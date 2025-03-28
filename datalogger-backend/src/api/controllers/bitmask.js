import { BaseController } from './baseController.js';
import validators from "../../helpers/validators.js";
import redisCache from '../../core/redisCache.js';
import cache from '../../cache.js';

import knexConnect from 'knex';
import config from '../../../config.js';


export class Bitmask extends BaseController {
    constructor() {
        super(
            'bitmask',
            {
                parameters: [
                    'device_type_data_structure_id',
                    'description',
                    'position',
                    'type',
                    'priority',
                    'onValue'

                ],
                paranoid: false,


                relations: [
                    {
                        tableName: 'devicetype_data_structure',
                        id: 'device_type_data_structure_id',
                        paranoid: false
                    },
                ],
                sort: 'device_type_data_structure_id',

            }
        );
    }



    async getAll(req, res) {

        return super.getAll(req, res)


    }


    async getOne(req, res) {

        return super.getOne(req, res)

    }



    async getBitMasks(req, res) {

        const { id = undefined } = req.params;
        const { fields = undefined } = req.query;

        if (!validators.validateId(id)) {
            return res.status(404).send();
        }

        const where = {};

        where[`${this.tableName}.device_type_data_structure_id`] = id;

        if (this.paranoid) {
            where.deleted = '0'
        }

        const meta = {
            id,
            token: req.newToken
        };

        try {





            const items = await this.knex(this.tableName)
                .select('*')
                .where(where);




            if (items.length > 0) {
                for (let item of items) {
                    delete item.password;

                    if (this.relations !== undefined) {
                        for (let relation of this.relations) {
                            const [data] = await this.knex(relation.tableName).where({
                                id: item[relation.id] ?? 0
                            }).select();

                            const key = relation.id.slice(0, -2);
                            item[key] = { ...data };
                        }
                    }
                }

                return res.status(200).json({ meta, data: items });
            }


            return res.status(404).json({ meta });

        } catch (error) {
            console.log(error);
            return res.status(404).json({ meta, error });
        }
    }


    async addBitmask(req, res) {
        try {
            const { id } = req.params;
            const knex = knexConnect(config.database);
            const { bitmask } = req.body

            const devicetype_data_structure = await this.knex('devicetype_data_structure').where({ id: id }).first();

            if (!devicetype_data_structure) {
                return res.status(400).json({
                    code: 404,
                    message: 'No signal found'
                });
            }

            const bitmaskCheck = await this.knex('bitmask').where({ device_type_data_structure_id: id }).first();

            if (bitmaskCheck) {
                return res.status(400).json({
                    code: 404,
                    message: `There is already a bitmask for the signal ${id}`
                });
            }




            bitmask.forEach(element => { element.device_type_data_structure_id = id });

            const { effectedEntity: idBitmask } = await knex.transaction(async (trx) => {

                const [effectedEntity] = await trx(this.tableName).insert(bitmask).returning('*')

                if (!effectedEntity) {
                    throw new Error(`${this.tableName} insert error`);
                }

                const [logId] = await trx('logs').insert({
                    userId: req.auth.id,
                    entity: this.tableName,
                    entityId: effectedEntity,
                    operation: 'insert',
                    payload: JSON.stringify(bitmask)
                })

                return {
                    effectedEntity,
                    logId
                };
            });







            return res.status(201).json({ idBitmask })
        } catch (error) {

            console.log(error);
            return res.status(500).json({ error });
        }
    }

    async putBitmask(req, res) {

        try {
            const { id } = req.params;
            const knex = knexConnect(config.database);
            const { bitmask } = req.body

            
            if (!bitmask || bitmask.length === 0) {
                return res.status(400).json({ code: 400, message: "Invalid bitmask input" });
            }


            const devicetype_data_structure = await this.knex('devicetype_data_structure').where({ id: id }).first();
            if (!devicetype_data_structure) {
                return res.status(400).json({
                    code: 404,
                    message: 'No signal found'
                });
            }


            let effectedEntity;
            await this.knex.transaction(async (trx) => {

                effectedEntity = await trx('enumeration').where({ device_type_data_structure_id: id }).del();

                if (effectedEntity === 0) {
                    console.warn(`No rows deleted in bitmask`);
                    return;
                }

                await trx('logs').insert({
                    userId: req.auth.id,
                    entity: 'enumeration',
                    entityId: id,
                    operation: 'delete'
                });

            });


         

            const bitmaskCheck = await this.knex(this.tableName).where('device_type_data_structure_id', id ).first();


            if (effectedEntity > 0 || !bitmaskCheck) {
                // Insert after change signalType 

                bitmask.forEach(element => { element.device_type_data_structure_id = id });


                const { effectedEntity: idBitmask } = await knex.transaction(async (trx) => {

                    const [effectedEntity] = await trx(this.tableName).insert(bitmask).returning('*')

                    if (!effectedEntity) {
                        throw new Error(`${this.tableName} insert error`);
                    }

                    const [logId] = await trx('logs').insert({
                        userId: req.auth.id,
                        entity: this.tableName,
                        entityId: effectedEntity,
                        operation: 'insert',
                        payload: JSON.stringify(bitmask)
                    })

                    return {
                        effectedEntity,
                        logId
                    };
                });

                return res.status(201).json({ idBitmask })

            } else {

                //Edit

                const bitmaskCheck = await this.knex(this.tableName).whereIn('id', bitmask.map(b => b.id));
                if (!bitmaskCheck) {
                    return res.status(400).json({
                        code: 404,
                        message: `bitmask not found`
                    });
                }

                await knex.transaction(async (trx) => {

                    const effectedEntity = await trx(this.tableName)
                        .whereIn('id', bitmask.map(b => b.id))
                        .update({
                            onValue: trx.raw(`CASE id ${bitmask.map(b => `WHEN ${b.id} THEN '${b.onValue}'`).join(' ')} ELSE onValue END`),
                            priority: trx.raw(`CASE id ${bitmask.map(b => `WHEN ${b.id} THEN '${b.priority}'`).join(' ')} ELSE priority END`),
                            type: trx.raw(`CASE id ${bitmask.map(b => `WHEN ${b.id} THEN '${b.type}'`).join(' ')} ELSE type END`),
                            description: trx.raw(`CASE id ${bitmask.map(b => `WHEN ${b.id} THEN '${b.description}'`).join(' ')} ELSE description END`)
                        })
                        .returning('*');

                    if (!effectedEntity) {
                        throw new Error(`${this.tableName} update error`);
                    }

                    const [logId] = await trx('logs').insert({
                        userId: req.auth.id,
                        entity: this.tableName,
                        entityId: effectedEntity,
                        operation: 'update',
                        payload: JSON.stringify(bitmask)
                    })

                    return {
                        effectedEntity,
                        logId
                    };
                });



                return res.status(204).send();

            }

        } catch (error) {

            console.log(error);
            return res.status(500).json({ error });
        }
    }



}


export default new Bitmask();
