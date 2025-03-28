import { BaseController } from './baseController.js';
import validators from "../../helpers/validators.js";
import redisCache from '../../core/redisCache.js';
import cache from '../../cache.js';


export class DeviceType extends BaseController {

    constructor() {
        super(
            'device_type',
            {
                parameters: [
                    'model',
                    'manufacturer',
                    'firmwareRev',
                    'description'
                ],
                sort: 'model'
            }
        );
    }



    async delete(req, res) {

        const { id } = req.params;

        if (validators.validateId(id)) {

            try {
                const device = await this.knex('device').where({
                    deleted: '0',
                    deviceTypeId: id
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
                // req.core.setAdsStatus({
                //     deviceType: true,
                //     devices: true,
                //     restart: false
                // })

                cache.load({
                    deviceType: true,
                    devices: true,
                })

                redisCache.setStatus({ status: true }, 'upgrader');
            })

        }

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
            }).whereIn('deviceTypeId', ids).select();

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
            // req.core.setAdsStatus({
            //     deviceType: true,
            //     devices: true,
            //     restart: false
            // })


            cache.load({
                deviceType: true,
                devices: true,
            })

            redisCache.setStatus({ status: true }, 'upgrader');
        })

    }


    async add(req, res) {

        try {

            let {
                model = undefined,
                manufacturer = undefined,
                firmwareRev = undefined,
                description = undefined,
            } = req.body

            if (!validators.validateString(model)) {
                return res.status(400).json({
                    code: 401,
                    message: 'Invalid parameter: model'
                });
            }

            const data = await this.knex(this.tableName).where({ model, deleted: '0' }).first()


            if (data) {

                if (!model.includes('_copy-')) {
                    return res.status(409).json({
                        code: 402,
                        message: `Name ${model} has already been used.`
                    });
                }
                model = await this.generateCopyName(model.replace(/_copy-\d+$/, ''), this.tableName, 'model', 1);

            }




            const deviceType = await this.addRow(req, {
                model,
                manufacturer,
                firmwareRev,
                description
            })

            if (deviceType?.id) {

                const meta = {
                    body: req.body,
                    token: req.newToken
                }


                cache.load({
                    deviceType: true,
                    devices: true,
                })

                redisCache.setStatus({ status: true }, 'upgrader');

                return res.status(201).json({ deviceType, meta });
            }
            else {
                return res.status(500).send();
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
            model = undefined,
            manufacturer = undefined,
            firmwareRev = undefined,
            description = undefined,

        } = req.body


        if (model) {

            if (!validators.validateString(model)) {
                return res.status(400).json({
                    code: 300,
                    message: 'Invalid parameter: model'
                });
            }

            try {
                const obj = await this.knex(this.tableName).where({ model, deleted: '0' }).whereNot('id', id).first();

                if (obj) {
                    return res.status(409).json({
                        code: 402,
                        message: `Name ${model} has already been used.`
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

        if (manufacturer) {

            if (!validators.validateString(manufacturer)) {
                return res.status(400).json({
                    code: 300,
                    message: 'Invalid parameter: manufacturer'
                });
            }
        }

        try {

            await this.editRow(req, id, {
                model,
                manufacturer,
                firmwareRev,
                description
            })


            // req.core.setAdsStatus({
            //     deviceType: true,
            //     devices: true,
            //     restart: false
            // })

            return res.status(200).json({
                deviceType: { id }
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json(
                { error }
            );
        }

    }


    async getStructures(req, res) {

        return this.getSubEntity(req, res, {
            subTableName: 'devicetype_data_structure',
            realtionId: 'deviceTypeId'
        })
    }

    async addStructures(req, res) {

        const { id } = req.params;

        if (!validators.validateId(id)) {
            return res.status(404).send();
        }


        try {

            const obj = await this.knex(this.tableName).where({ id, deleted: '0' }).first();

            if (!obj) {
                return res.status(404).json({
                    code: 400,
                    message: `A Element with this id: ${id} does not exist.`
                });
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json(
                { error }
            );
        }


        let {

            name = undefined,
            description = undefined,
            modbusFunction = undefined,
            modbusAddress = undefined,
            modbusType = undefined,
            modbusAccess = 'RW',
            measureUnit = undefined,
            gain = 1,
            diff = 0,
            showOnGraphic = 0,
            postFunction = undefined,
            signalType = undefined
        } = req.body


        if (!validators.validateString(name)) {
            return res.status(400).json({
                code: 401,
                message: 'Invalid parameter: name'
            });
        }

        const subTableName = 'devicetype_data_structure';
        const realtionId = 'deviceTypeId';

        try {

            const data = await this.knex(subTableName).where({
                [realtionId]: id,
                name
            }).first()




            if (data) {

                if (!name.includes('_copy-')) {
                    return res.status(409).json({
                        code: 402,
                        message: `Name ${name} has already been used.`
                    });
                }
                name = await this.generateCopyName(name.replace(/_copy-\d+$/, ''), subTableName, 'name', 0);

            }


        } catch (error) {
            console.log(error);

            return res.status(500).json({
                error
            });
        }


        if (!validators.validateNumber(modbusFunction)) {
            return res.status(400).json({
                code: 404,
                message: 'Invalid parameter: modbusFunction'
            });
        }


        if (!validators.validateNumber(modbusAddress)) {
            return res.status(400).json({
                code: 405,
                message: 'Invalid parameter: modbusAddress'
            });
        }

        if (!validators.validateString(modbusType)) {
            return res.status(400).json({
                code: 406,
                message: 'Invalid parameter: modbusType'
            });
        }


        if (!validators.validateModbusAccess(modbusAccess)) {
            return res.status(400).json({
                code: 407,
                message: 'Invalid parameter: modbusAccess'
            });
        }


        if (!validators.validateNumber(gain)) {
            return res.status(400).json({
                code: 408,
                message: 'Invalid parameter: gain'
            });
        }

        if (!validators.validateNumber(diff)) {
            return res.status(400).json({
                code: 409,
                message: 'Invalid parameter: diff'
            });
        }

        if (!validators.validateString(signalType)) {
            return res.status(400).json({
                code: 409,
                message: 'Invalid parameter: signalType'
            });
        }



        if (postFunction) {

            if (!validators.validateString(postFunction)) {
                return res.status(400).json({
                    code: 302,
                    message: 'Invalid parameter: postFunction'
                });
            }
        }


        if (showOnGraphic) {
            const showOnGraphicForDeviceTypeCount = await this.knex('devicetype_data_structure').where({ deviceTypeId: id, showOnGraphic: 1 }).count();
            if (showOnGraphicForDeviceTypeCount[0]['count(*)'] > 20) {
                return res.status(400).json({
                    code: 409,
                    message: 'You can view a maximum of 20 signals per device at a time.'
                });
            }

        }



        const item = {
            name,
            description,
            deviceTypeId: id,

            modbusFunction,
            modbusAddress,
            modbusType,

            modbusAccess,
            measureUnit,

            gain,
            diff,
            showOnGraphic,
            postFunction,
            signalType
        }


        try {

            item.id = await this.addSubEntity(
                req, item, {
                subTableName
            }
            );

        } catch (error) {
            console.log(error);

            return res.status(500).json({
                error
            });
        }



        cache.load({
            deviceType: true,
            devices: true,
        })

        redisCache.setStatus({ status: true }, 'upgrader');

        return res.status(200).json({
            item
        });
    }
}

export default new DeviceType();

