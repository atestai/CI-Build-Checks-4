import {BaseController}  from './baseController.js';
import validators from "../../helpers/validators.js";
import cache from '../../cache.js';
import redisCache from '../../core/redisCache.js';


export class DeviceInterface extends BaseController{

    constructor() {
        super(
            'device_interface',
            {
                parameters: [
                    'name',
                    'host',
                    'port'
                ],
                sort: 'name'
            }
        );
    }


    



    async add( req, res ){

        try {

            let {
                name = undefined,
                host = undefined,
                port = undefined,
            } = req.body

            if (!validators.validateString(name)){
                return res.status(400).json({
                    code : 401,
                    message : 'Invalid parameter: name'
                });
            }

            const data = await this.knex(this.tableName).where({ name,  deleted : '0' }).first()

       
            if (data) {
             
                if (!name.includes('_copy-')) {
                    return res.status(409).json({
                        code: 402,
                        message: `Name ${name} has already been used.`
                    });
                }
                name = await this.generateCopyName(name.replace(/_copy-\d+$/, ''), this.tableName , 'name',1);

            }



            if (!validators.validateIp(host)){
                return res.status(400).json({
                    code : 403,
                    message : 'Invalid parameter: host'
                });
            }


            if (!validators.validateNumber(port)){
                return res.status(400).json({
                    code : 404,
                    message : 'Invalid parameter: port'
                });
            }


            const deviceInterface = await this.addRow (req, {
                name,
                host,
                port
            })            

            if (deviceInterface?.id) {

                const meta = {
                    body: req.body,
                    token: req.newToken
                }

                return res.status(201).json({ deviceInterface , meta });
            }
            else{
                return res.status(500).send();
            }

        
        } catch (error) {

            console.log( error);
            return res.status(500).json({ error });
        }
    }

    async delete(req, res){

        const { id } = req.params;

        if (!validators.validateId(id)) {
            return res.status(404).send();
        }


        try {

            const device = await this.knex('rel_device_interfaces as rdi').
                join('device', 'rdi.deviceId', '=', 'device.id').
                where('rdi.interfaceId', id).
                where('device.deleted', '0').
                select();


            if ( device.length ){
                return res.status(400).json({
                    code : 401,
                    message : 'Cannot delete this item, beacuse used in other relations.'
                });
            }

        } catch (error) {
            console.log(error);

            return res.status(500).json(
                { error }
            );
        }

        return super.delete(req, res);         
       
    }


    async deleteMultiple(req, res){

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

            // const device = await this.knex('rel_device_interfaces as rdi').
            // join('device', 'rdi.deviceId', '=', 'device.id').
            // where('rdi.interfaceId', id).
            // where('device.deleted', '0').
            // select();

            const device = await this.knex('rel_device_interfaces as rdi').
                join('device', 'rdi.deviceId', '=', 'device.id').
                where('device.deleted', '0').
                whereIn('interfaceId', ids).
                select();

            if ( device.length ){
                return res.status(400).json({
                    code : 401,
                    message : 'Cannot delete this item, beacuse used in other relations.'
                });
            }

        } catch (error) {
            console.log(error);

            return res.status(500).json(
                { error }
            );
        }

        return super.deleteMultiple(req, res);
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
            name = undefined,
            host = undefined,
            port = undefined
        } = req.body

        if (name){

            if (!validators.validateString(name)){
                return res.status(400).json({
                    code : 300,
                    message : 'Invalid parameter: name'
                });
            }


            try {
                const obj = await this.knex(this.tableName).where({ name, deleted : '0' }) .whereNot('id', id).first();

                if (obj){
                    return res.status(409).json({
                        code : 402,
                        message : `Name ${name} has already been used.`
                    });
                }
            } catch (error) {
                console.log(error);
                return res.status(500).json(
                    {error}
                );
            }
        }

     
        if (host){

            if (!validators.validateIp(host)){
                return res.status(400).json({
                    code : 300,
                    message : 'Invalid parameter: host'
                });
            }
        }

        if (port){
            if (!validators.validateNumber(port)){
                return res.status(400).json({
                    code : 404,
                    message : 'Invalid parameter: port'
                });
            }
        }


        try {
            await this.editRow(req, id, {
                name,
                host,
                port
            })

            if ( host || port ){
             
                cache.load({
                    deviceType: true,
                    devices: true,
                })

                redisCache.setStatus({status : true}, 'upgrader');
            }
           
            return res.status(200).json({
                deviceInterface: { id }
            });

        } catch (error) {
            
            console.log(error);

            return res.status(500).json(
                { error }
            );
        }
    }


}

export default new DeviceInterface();