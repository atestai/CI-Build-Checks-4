import {BaseController}  from './baseController.js';
import validators from "../../helpers/validators.js";
import cache from '../../cache.js';
import redisCache from '../../core/redisCache.js';


export class DeviceTypesStructures extends BaseController{

    constructor() {
        
        super(
            'devicetype_data_structure',
            {
                parameters: [
                    'deviceTypeId',
                    'name',
                    'description',
                    'modbusFunction',
                    'modbusAddress',
                    'modbusType',
                    'signalType'
                ], 
                sort: 'name',
                paranoid : false
            });
    }



    async edit(req, res) {

        const { id } = req.params;

        if (!validators.validateId(id)) {
            return res.status(404).send();
        }


        let structure = null;

        try {
            structure = await this.knex(this.tableName).where({ id }).first();

            if (!structure){
                return res.status(404).json({
                    code : 404,
                    message : `A Element with this id: ${id} does not exist.`
                });
            }
        } catch (error) {
            
            console.log(error);

            return res.status(500).json(
                {error}
            );
        }


        const {deviceTypeId} = structure;


        const {

            name = undefined,
            description = undefined,
    
            modbusFunction = undefined,
            modbusAddress = undefined,
            modbusType = undefined,

            modbusAccess = undefined,
            measureUnit = undefined,

            gain = undefined,
            diff = undefined,
            showOnGraphic = undefined,
            postFunction = undefined,
            signalType = undefined,

        } = req.body


        
        if (name){

            if (!validators.validateString(name)){

                return res.status(400).json({
                    code : 300,
                    message : 'Invalid parameter: name'
                });
            }

    
            try {
                const obj = await this.knex(this.tableName).where({ name, deviceTypeId }) .whereNot('id', id).first();

                if (obj){
                    return res.status(409).json({
                        code : 301,
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

      
        if (description){

            if (!validators.validateString(description)){
                return res.status(400).json({
                    code : 302,
                    message : 'Invalid parameter: description'
                });
            }
        }


        if (deviceTypeId){

            if (!validators.validateId(deviceTypeId)){
                return res.status(400).json({
                    code : 403,
                    message : 'Invalid parameter: deviceTypeId'
                });
            }
    
            const deviceType = await this.knex('device_type').where({id: deviceTypeId, deleted : '0' }).first();
    
            if ( !deviceType ){
                return res.status(400).json({
                    code : 404,
                    message : 'No deviceType found'
                });
            }
        }


        if (modbusFunction){
            if (!validators.validateNumber(modbusFunction)){
                return res.status(400).json({
                    code : 404,
                    message : 'Invalid parameter: modbusFunction'
                });
            }
        }


        if (modbusAddress) {
            if (!validators.validateNumber(modbusAddress)) {
                return res.status(400).json({
                    code: 405,
                    message: 'Invalid parameter: modbusAddress'
                });
            }
        }

        if (modbusType) {
            if (!validators.validateString(modbusType)){
                return res.status(400).json({
                    code : 406,
                    message : 'Invalid parameter: modbusType'
                });
            }
        }


        if (modbusAccess) {
            if (!validators.validateModbusAccess(modbusAccess)){
                return res.status(400).json({
                    code : 407,
                    message : 'Invalid parameter: modbusAccess'
                });
            }
        }


        if (gain) {
            if (!validators.validateNumber(gain)) {
                return res.status(400).json({
                    code: 408,
                    message: 'Invalid parameter: gain'
                });
            }
        }
        

        if ( diff ) {
            if (!validators.validateNumber(diff)){
                return res.status(400).json({
                    code : 409,
                    message : 'Invalid parameter: diff'
                });
            }
        }

        if (postFunction){

            if (!validators.validateString(postFunction)){
                return res.status(400).json({
                    code : 302,
                    message : 'Invalid parameter: postFunction'
                });
            }
        }

        if (signalType){

            if (!validators.validateString(signalType)){
                return res.status(400).json({
                    code : 302,
                    message : 'Invalid parameter: signalType'
                });
            }
        }


        const record = await this.knex(this.tableName).where({id: id }).first();
        if( signalType === 'measure' && (record.signalType === 'bitmask' || record.signalType === 'enumeration')){


            await this.knex.transaction(async (trx) => {

                const effectedEntity = await trx(record.signalType).where({ device_type_data_structure_id: id }).del();

                if (effectedEntity === 0) {
                    console.warn(`No rows deleted in ${record.signalType}`);
                    return;
                }

                await trx('logs').insert({
                    userId: req.auth.id,
                    entity: record.signalType,
                    entityId: id,
                    operation: 'delete'
                });

            });


        }



        if(showOnGraphic){
            const showOnGraphicForDeviceTypeCount = await this.knex('devicetype_data_structure').where({deviceTypeId: deviceTypeId,showOnGraphic: 1 }).count();
            if(showOnGraphicForDeviceTypeCount[0]['count(*)'] > 20){
                return res.status(400).json({
                    code : 409,
                    message : 'You can view a maximum of 20 signals per device at a time.'
                });
            }
            
        }


        try {

            const data = {
                deviceTypeId,
                name,
                description,
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

            await this.editRow (req, id, data);

            // await req.core.configure({
            //     deviceType: true, 
            //     devices: true,  
            //     restart: false
            // });

            if ( modbusFunction || modbusAddress || modbusType || modbusAccess || measureUnit || showOnGraphic){
                // req.core.setAdsStatus({
                //     deviceType: true,
                //     devices: true,
                //     restart: false
                // })

                cache.load({
                    deviceType: true,
                    devices: true,
                })

                redisCache.setStatus({status : true}, 'upgrader');
            }
           

            return res.status(200).json({  
                DeviceTypesStructures : {id, ...data}
            });
            
        } catch (error) {

            console.log(error);
            
            return res.status(500).json(
                {error}
            );
        }
    }


    async deleteMultiple(req, res) {

        return super.deleteMultiple(req, res, () =>{
          
            cache.load({
                deviceType: true,
                devices: true,
            })

            redisCache.setStatus({status : true}, 'upgrader');
        })
    }



    async delete(req, res) {

        return super.delete(req, res, () =>{

            cache.load({
                deviceType: true,
                devices: true,
            })

            redisCache.setStatus({status : true}, 'upgrader');
        })
    }

}


export default new DeviceTypesStructures();
