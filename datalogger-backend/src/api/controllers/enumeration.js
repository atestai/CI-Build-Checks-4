import { BaseController } from './baseController.js';
import validators from "../../helpers/validators.js";

import knexConnect from 'knex';
import config from '../../../config.js';



export class Enumeration extends BaseController {

    constructor() {
        super(
            'enumeration',
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

    // async getAll(req, res) {

    //     let {
    //         fields = undefined,
    //         description = undefined,
    //         page = config.pagination.page,
    //         limit = config.pagination.limit,
    //         sort = 'description'

    //     } = req.query;


    //     const where = []

    //     if (description) {
    //         where.push({ description })
    //     }

    //     //const count = await knex('domains').count('id as total').where(vett[0]).where(...vett[1]).first()   
    //     const C = knex(tableName);

    //     where.forEach(element => {
    //         Object.prototype.toString.call(element) === '[object Array]' ? C.where(...element) : C.where(element)
    //     });

    //     const count = await C.count('id as total').first()

    //     const { total } = count

    //     if (page <= 0) {
    //         page = 1;
    //     }

    //     const pages = Math.ceil(total / limit);
    //     const offset = limit * (page - 1)

    //     const meta = {
    //         total,
    //         pages,
    //         offset,
    //         limit,
    //         page,
    //         where,
    //         token: req.newToken
    //     }


    //     try {

    //         const C = knex(tableName);

    //         where.forEach(element => {

    //             if (Object.prototype.toString.call(element) === '[object Array]') {
    //                 C.where(...element)
    //             }
    //             else {
    //                 Object.keys(element).forEach(key => {
    //                     C.where(key, 'like' , element[key] )
    //                 });
    //             }
    //         });

    //         let selectFields = [];

    //         if (fields){
    //             selectFields = fields.split(',');
    //         }

    //         let data = await C.select(selectFields).orderBy(['device_type_data_structure_id', sort]).limit(limit).offset(offset)

    //         res.status(200).json({
    //             meta,
    //             data
    //         });

    //     } catch (error) {

    //         console.log(error);
    //         res.status(400).send();
    //     }

    // }

    // async edit(req, res) {

    //     //const { id } = req.params;
    //     const {masks} = req.body

    //     const meta = {
    //         masks,
    //         token: req.newToken
    //     }


    //     const idBitmasks = [];

    //     for (let index = 0; index < masks.length; index++) {

    //         const mask = masks[index];

    //         let {
    //             id = undefined,
    //             device_type_data_structure_id = undefined, 
    //             description = undefined,
    //             position = undefined,
    //             type = undefined,
    //             priority = undefined,
    //             onValue = undefined
    //         } = mask;


    //         if ( ! validators.validateId(id)  ){

    //             return res.status(400).json({
    //                 code : 403,
    //                 message : 'Invalid parameter: id'
    //             });
    //         }   

    //         if ( ! validators.validateId(device_type_data_structure_id) ){

    //             return res.status(400).json({
    //                 code : 403,
    //                 message : 'Invalid parameter: device_type_data_structure_id'
    //             });
    //         }   


    //         if ( description ){

    //             if (!validators.validateString(description)){
    //                 return res.status(400).json({
    //                     code : 401,
    //                     message : 'Invalid parameter: description'
    //                 });
    //             }

    //             const data = await knex('bitmask').where({ 
    //                 device_type_data_structure_id,
    //                 description
    //             }).whereNot('id', id).first()

    //             if (data){
    //                 return res.status(409).json({
    //                     code : 402,
    //                     message : `Description ${description} has already been used.`
    //                 });
    //             }
    //         }


    //         if ( position ){

    //             if (!validators.validateNumber(position)){
    //                 return res.status(400).json({
    //                     code : 403,
    //                     message : 'Invalid parameter: position'
    //                 });
    //             }

    //             const data = await knex('bitmask').where({ 
    //                 device_type_data_structure_id : id,
    //                 position
    //             }).whereNot('id', id).first()


    //             if (data){
    //                 return res.status(409).json({
    //                     code : 404,
    //                     message : `Position ${position} has already been used.`
    //                 });
    //             }
    //         } 


    //         try {

    //             await knex(tableName).update({
    //                 description,
    //                 position,
    //                 type,
    //                 priority,
    //                 onValue
    //             }).where({ id })    

    //            idBitmasks.push ( {
    //                 id,
    //                 description,
    //                 position,
    //                 type,
    //                 priority,
    //                 onValue
    //            } );

    //         } catch (error) {
    //             console.log(error);
    //             return res.status(500).json(
    //                 {error}
    //             );
    //         }
    //     }

    //     return res.status(200).send({idBitmasks});
    // }


    async getEnumerations(req, res) {

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


    async addEnumeration(req, res) {
        try {
            const { id } = req.params;
            const knex = knexConnect(config.database);
            const { enumeration } = req.body

            const devicetype_data_structure = await this.knex('devicetype_data_structure').where({ id: id }).first();

            if (!devicetype_data_structure) {
                return res.status(400).json({
                    code: 404,
                    message: 'No signal found'
                });
            }

            const bitmaskCheck = await this.knex('enumeration').where({ device_type_data_structure_id: id }).first();

            if (bitmaskCheck) {
                return res.status(400).json({
                    code: 404,
                    message: `There is already a enumeration for the signal ${id}`
                });
            }




            enumeration.forEach(element => { element.device_type_data_structure_id = id });

            const { effectedEntity: idEnumeration } = await knex.transaction(async (trx) => {

                const [effectedEntity] = await trx(this.tableName).insert(enumeration).returning('*')

                if (!effectedEntity) {
                    throw new Error(`${this.tableName} insert error`);
                }

                const [logId] = await trx('logs').insert({
                    userId: req.auth.id,
                    entity: this.tableName,
                    entityId: effectedEntity,
                    operation: 'insert',
                    payload: JSON.stringify(enumeration)
                })

                return {
                    effectedEntity,
                    logId
                };
            });







            return res.status(201).json({ idEnumeration })
        } catch (error) {

            console.log(error);
            return res.status(500).json({ error });
        }
    }


    async putEnumeration(req, res) {

        try {
            const { id } = req.params;
            const knex = knexConnect(config.database);
            const { enumeration } = req.body

            if (!enumeration || enumeration.length === 0) {
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

                effectedEntity = await trx('bitmask').where({ device_type_data_structure_id: id }).del();

                if (effectedEntity === 0) {
                    console.warn(`No rows deleted in bitmask`);
                    return;
                }

                await trx('logs').insert({
                    userId: req.auth.id,
                    entity: 'bitmask',
                    entityId: id,
                    operation: 'delete'
                });

            });



            const enumerationCheck = await this.knex(this.tableName).where('device_type_data_structure_id', id ).first();





            if (effectedEntity > 0 || !enumerationCheck) {
                enumeration.forEach(element => { element.device_type_data_structure_id = id });

                const { effectedEntity: idEnumeration } = await knex.transaction(async (trx) => {

                    const [effectedEntity] = await trx(this.tableName).insert(enumeration).returning('*')

                    if (!effectedEntity) {
                        throw new Error(`${this.tableName} insert error`);
                    }

                    const [logId] = await trx('logs').insert({
                        userId: req.auth.id,
                        entity: this.tableName,
                        entityId: effectedEntity,
                        operation: 'insert',
                        payload: JSON.stringify(enumeration)
                    })

                    return {
                        effectedEntity,
                        logId
                    };
                });

                return res.status(201).json({ idEnumeration })

            } else {



                const enumerationCheck = await this.knex(this.tableName).whereIn('id', enumeration.map(b => b.id));
                if (!enumerationCheck) {
                    return res.status(400).json({
                        code: 404,
                        message: `enumeration not found`
                    });
                }



                await knex.transaction(async (trx) => {

                    const effectedEntity = await trx(this.tableName)
                        .whereIn('id', enumeration.map(b => b.id))
                        .update({
                            value: trx.raw(`CASE id ${enumeration.map(b => `WHEN ${b.id} THEN '${b.value}'`).join(' ')} ELSE value END`),
                            priority: trx.raw(`CASE id ${enumeration.map(b => `WHEN ${b.id} THEN '${b.priority}'`).join(' ')} ELSE priority END`),
                            type: trx.raw(`CASE id ${enumeration.map(b => `WHEN ${b.id} THEN '${b.type}'`).join(' ')} ELSE type END`),
                            description: trx.raw(`CASE id ${enumeration.map(b => `WHEN ${b.id} THEN '${b.description}'`).join(' ')} ELSE description END`)
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
                        payload: JSON.stringify(enumeration)
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

export default new Enumeration();
