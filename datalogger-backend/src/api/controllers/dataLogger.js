import { BaseController } from './baseController.js';
import validators from "../../helpers/validators.js";
import cache from '../../cache.js';

export class DataLogger extends BaseController {

    constructor() {
        super(
            'data_logger',
            {
                parameters: [
                    'name',
                    'host',
                    'enabled',
                    'location',
                    'description'
                ],
                sort: 'name'
            });
    }


 


    async add(req, res) {

        try {

            let {
                name = undefined,
                description = undefined,
                host = undefined,
                enabled = '1',
                location = undefined
            } = req.body

            if (!validators.validateString(name)) {
                return res.status(400).json({
                    code: 401,
                    message: 'Invalid parameter: name'
                });
            }

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


            if (!validators.validateIp(host)) {
                return res.status(400).json({
                    code: 300,
                    message: 'Invalid parameter: host'
                });
            }

            const dataLogger = await this.addRow(req, {
                name,
                host,
                description,
                location,
                enabled
            })

            if (dataLogger?.id) {

                const meta = {
                    body: req.body,
                    token: req.newToken
                }

                cache.load({ dataLogger: true });

                return res.status(201).json({ dataLogger, meta });
            }


        } catch (error) {

            console.log(error);
            return res.status(500).json({ error });
        }

    }


    async edit(req, res) {


        const { id } = req.params;

        if (!validators.validateId(id)) {
            return res.status(404).send();
        }

        try {
            const obj = await this.knex(this.tableName).where({ id, deleted: '0' }).first();

            if (!obj) {
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
            enabled = undefined,
            name = undefined,
            host = undefined,
            description = undefined,
            location = undefined

        } = req.body


        if (name) {

            if (!validators.validateString(name)) {
                return res.status(400).json({
                    code: 300,
                    message: 'Invalid parameter: name'
                });
            }

            try {
                const obj = await this.knex(this.tableName).where({ name, deleted: '0' }).whereNot('id', id).first();

                if (obj) {
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
        }

        if (description) {

            if (!validators.validateString(description)) {
                return res.status(400).json({
                    code: 300,
                    message: 'Invalid parameter: description'
                });
            }
        }

        if (host) {

            if (!validators.validateIp(host)) {
                return res.status(400).json({
                    code: 300,
                    message: 'Invalid parameter: host'
                });
            }
        }

        try {

            await this.editRow(req, id, {
                name,
                host,
                description,
                enabled,
                location
            })

            cache.load({ dataLogger: true });

            return res.status(200).json({
                dataLogger: { id }
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json(
                { message: error }
            );
        }

    }


    async delete(req, res) {

        const { id } = req.params;

        if (!validators.validateId(id)) {
            return res.status(404).send();
        }


        try {
            const device = await this.knex('device').where({
                deleted: '0',
                dataLoggerId: id
            }).select();

            if (device.length) {
                return res.status(400).json({
                    code: 401,
                    message: 'Cannot delete this item, beacuse used in other relations.'
                });
            }

        } catch (error) {
            console.log(error);

            return res.status(500).json(
                { error }
            );
        }


        return super.delete(req, res, async () => {
            await cache.load({ dataLogger: true });
        })

    }

    async deleteMultiple(req, res) {

        const {
            ids = undefined
        } = req.body

        if (!ids || !ids.length) {
            return res.status(404).json({
                code: 404,
                message: `Ids non valids.`
            });
        }

        try {

            const device = await this.knex('device').where({
                deleted: '0',
            }).whereIn('dataLoggerId', ids).select();

            if (device.length) {
                return res.status(400).json({
                    code: 401,
                    message: 'Cannot delete this item, beacuse used in other relations.'
                });
            }

        } catch (error) {
            console.log(error);

            return res.status(500).json(
                { error }
            );
        }

        return super.deleteMultiple(req, res, async () => {
            await cache.load({ dataLogger: true });
        })

    }


    async editMultiple(req, res) {

        return super.editMultiple(req, res, async () => {
            await cache.load({ dataLogger: true });
        })

    }

}

export default new DataLogger();