import { BaseController } from './baseController.js';
import validators from "../../helpers/validators.js";
import config from '../../../config.js';

export class ConfigurationAlarms extends BaseController {

    constructor() {
        super(
            'configuration_alarms',
            {
                parameters: [
                    'name',
                    'condition_array',
                    'condition',
                    'active_time',
                    'deactive_time',
                    'message',
                    'severity',
                ],
                sort: 'severity'
            });
    }


    async add(req, res) {

        try {


            let {
                name = undefined,
                condition = undefined,
                active_time = 0,
                deactive_time = 0,
                message = undefined,
                severity = 0
            } = req.body


            const data = await this.knex(this.tableName).where({ name, deleted: '0' }).first()

           

            if (data) {
             
                if (!name.includes('_copy-')) {
                    return res.status(409).json({
                        code: 402,
                        message: `Name ${name} has already been used.`
                    });
                }
                name = await this.generateCopyName(name.replace(/_copy-\d+$/, ''), this.tableName , 'name',1);

            }



            if (condition) {
                if (!validators.validateString(condition)) {
                    return res.status(400).json({
                        code: 401,
                        message: 'Invalid parameter: condition'
                    });
                }
            } else {
                return res.status(400).json({
                    code: 400,
                    message: 'Condition is a required field'
                });
            }

            if (name) {
                if (!validators.validateString(name)) {
                    return res.status(400).json({
                        code: 401,
                        message: 'Invalid parameter: name'
                    });
                }
            } else {
                return res.status(400).json({
                    code: 400,
                    message: 'name is a required field'
                });
            }



            if (active_time) {
                if (!validators.validateNumber(active_time)) {
                    return res.status(400).json({
                        code: 404,
                        message: 'Invalid parameter: active_time'
                    });
                }
            }



            if (deactive_time) {
                if (!validators.validateNumber(deactive_time)) {
                    return res.status(400).json({
                        code: 404,
                        message: 'Invalid parameter: deactive_time'
                    });
                }
            }

            if (message) {
                if (!validators.validateString(message)) {
                    return res.status(400).json({
                        code: 401,
                        message: 'Invalid parameter: message'
                    });
                }
            } else {
                return res.status(400).json({
                    code: 400,
                    message: 'Message is a required field'
                });
            }




            if (severity) {
                if (!validators.validateNumber(severity)) {
                    return res.status(400).json({
                        code: 404,
                        message: 'Invalid parameter: severity'
                    });
                }
            } else {
                return res.status(400).json({
                    code: 400,
                    message: 'Severity is a required field'
                });
            }



            const alarm_configuration = await this.addRow(req, {
                name,
                condition,
                active_time: Number(active_time),
                deactive_time: Number(deactive_time),
                message,
                severity
            })

            if (alarm_configuration?.id) {

                const meta = {
                    body: req.body,
                    token: req.newToken
                }


                return res.status(201).json({ alarm_configuration, meta });
            }


        } catch (error) {

            console.log(error);
            return res.status(500).json({ error });
        }

    }


    async edit(req, res) {


        const { id } = req.params;
        let asset = null;
        if (!validators.validateId(id)) {
            return res.status(404).send();
        }

        try {
            asset = await this.knex(this.tableName).where({ id }).first();

            if (!asset) {
                return res.status(404).json({
                    code: 404,
                    message: `A Element with this id: ${id} does not exist.`
                });
            }
        } catch (error) {

            console.log(error);
            return res.status(500).json(
                { error }
            );
        }


        const {
            name = undefined,
            condition = undefined,
            active_time = 0,
            deactive_time = 0,
            message = undefined,
            severity = 0
        } = req.body


        const deviceTypeId = asset.deviceTypeId;


        if (name) {
            if (!validators.validateString(name)) {
                return res.status(400).json({
                    code: 401,
                    message: 'Invalid parameter: name'
                });
            }
        } else {
            return res.status(400).json({
                code: 400,
                message: 'name is a required field'
            });
        }


        try {
            const data = await this.knex(this.tableName)
                .where({ name, deleted: '0' })
                .whereNot({ id }) // Esclude l'elemento con l'ID corrente
                .first();

            if (data) {
                return res.status(409).json({
                    code: 402,
                    message: `Name ${name} has already been used.`
                });
            }
        } catch (error) {

            console.log(error);
            return res.status(500).json(
                { error }
            );
        }

        if (condition) {
            if (!validators.validateString(condition)) {
                return res.status(400).json({
                    code: 401,
                    message: 'Invalid parameter: condition'
                });
            }
        } else {
            return res.status(400).json({
                code: 400,
                message: 'Condition is a required field'
            });
        }


        if (active_time) {
            if (!validators.validateNumber(active_time)) {
                return res.status(400).json({
                    code: 404,
                    message: 'Invalid parameter: active_time'
                });
            }
        }



        if (deactive_time) {
            if (!validators.validateNumber(deactive_time)) {
                return res.status(400).json({
                    code: 404,
                    message: 'Invalid parameter: deactive_time'
                });
            }
        }

        if (message) {
            if (!validators.validateString(message)) {
                return res.status(400).json({
                    code: 401,
                    message: 'Invalid parameter: message'
                });
            }
        } else {
            return res.status(400).json({
                code: 400,
                message: 'Message is a required field'
            });
        }


        if (severity) {
            if (!validators.validateNumber(severity)) {
                return res.status(400).json({
                    code: 404,
                    message: 'Invalid parameter: severity'
                });
            }
        } else {
            return res.status(400).json({
                code: 400,
                message: 'Severity is a required field'
            });
        }


        try {

            await this.editRow(req, id, {
                name,
                condition,
                active_time,
                deactive_time,
                message,
                severity
            })


            return res.status(200).json({
                alarm_configuration: { id }
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json(
                { message: error }
            );
        }

    }

    async getAll(req, res) {

        let {
            fields = undefined,
            page = config.pagination.page,
            limit = config.pagination.limit,
            sort = this.sort
        } = req.query;


        const where = Object.keys(req.query).reduce((acc, k) =>
            this.parameters.includes(k) ? [...acc, { [k]: req.query[k] }] : acc, []);


        const countQuery = this.knex(this.tableName).select()

        countQuery.leftJoin('rel_device_interfaces', `${this.tableName}.id`, 'rel_device_interfaces.deviceId');

        if (this.paranoid) {
            countQuery.where({ deleted: '0' });
        }


        this.applyWhereConditions(countQuery, where);


        const count = await countQuery.count(`${this.tableName}.id as total`).first();
        const { total } = count;

        if (page <= 0) {
            page = 1;
        }

        const pages = Math.ceil(total / limit);
        const offset = limit * (page - 1);

        const meta = {
            total,
            pages,
            offset,
            limit,
            page,
            where,
            token: req.newToken
        };

        try {


            const query = this.knex(this.tableName);

            if (this.paranoid) {
                query.where({ deleted: '0' });
            }

            this.applyWhereConditions(query, where);

            const selectFields = fields ? fields.split(',') : [`${this.tableName}.*`];

            // Aggiungere il campo association_asset_alarm usando una subquery o JSON aggregato
            selectFields.push(
                this.knex.raw(`(
                                SELECT JSON_ARRAYAGG(
                                    JSON_OBJECT(
                                        'assetId', association_asset_alarm.assetId,
                                        'alarmId', association_asset_alarm.alarmId,
                                        'name', device.name
                                    )
                                )
                                FROM association_asset_alarm
                                LEFT JOIN device ON device.id = association_asset_alarm.assetId
                                WHERE association_asset_alarm.alarmId = ${this.tableName}.id
                            ) AS association_asset_alarm`)
            );

            console.log("Query applicata:");
            console.log(query.toString());

            const data = await query.select(selectFields).orderBy(sort).limit(limit).offset(offset);

            return res.status(200).json({
                meta,
                data: data.map(item => {
                    delete item.password;
                    return item;
                })
            });

        } catch (error) {
            console.log(error);
            return res.status(400).send();
        }
    }


    // async getAll(req, res) {

    //     let {
    //         fields = undefined,
    //         page = config.pagination.page,
    //         limit = config.pagination.limit,
    //         sort = this.sort
    //     } = req.query;


    //     const where = Object.keys(req.query).reduce((acc, k) =>
    //         this.parameters.includes(k) ? [...acc, { [k]: req.query[k] }] : acc, []);


    //     const countQuery = this.knex(this.tableName).select()

    //     countQuery.leftJoin('rel_device_interfaces', `${this.tableName}.id`, 'rel_device_interfaces.deviceId');

    //     if (this.paranoid) {
    //         countQuery.where({ deleted: '0' });
    //     }


    //     this.applyWhereConditions(countQuery, where);


    //     const count = await countQuery.count(`${this.tableName}.id as total`).first();
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
    //         where,
    //         token: req.newToken
    //     };

    //     try {


    //         const query = this.knex(this.tableName);

    //         if (this.paranoid) {
    //             query.where({ deleted: '0' });
    //         }

    //         this.applyWhereConditions(query, where);

    //         const selectFields = fields ? fields.split(',') : [`${this.tableName}.*`];

    //         // Aggiungere il campo association_asset_alarm usando una subquery o JSON aggregato
    //         selectFields.push(
    //             this.knex.raw(`(
    //                             SELECT JSON_ARRAYAGG(
    //                                 JSON_OBJECT(
    //                                     'assetId', association_asset_alarm.assetId,
    //                                     'id', association_asset_alarm.id
    //                                 )
    //                             )
    //                             FROM association_asset_alarm
    //                             WHERE association_asset_alarm.alarmId = ${this.tableName}.id
    //                         ) AS association_asset_alarm`)
    //         );

    //         console.log("Query applicata:");
    //         console.log(query.toString());

    //         const data = await query.select(selectFields).orderBy(sort).limit(limit).offset(offset);


    //         return res.status(200).json({
    //             meta,
    //             data: data.map(item => {
    //                 delete item.password;
    //                 return item;
    //             })
    //         });

    //     } catch (error) {
    //         console.log(error);
    //         return res.status(400).send();
    //     }
    // }

}

export default new ConfigurationAlarms();