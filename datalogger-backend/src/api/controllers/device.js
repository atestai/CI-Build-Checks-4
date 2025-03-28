import {BaseController}  from './baseController.js';

import config from '../../../config.js';
import validators from "../../helpers/validators.js";
import cache from '../../cache.js';
import redisCache from '../../core/redisCache.js';


export class Device extends BaseController{

    constructor() {
        super(
            'device',
            {
                parameters: [
                    'name',
                    'dataLoggerId',
                    'deviceTypeId',
                    'interfaceId',
                    'enabled',
                    'description'
                ],

                relations : [
                    {
                        tableName : 'device_type',
                        id : 'deviceTypeId'
                    },{
                        tableName : 'data_logger',
                        id : 'dataLoggerId'
                    },{
                        tableName : 'device_interface',
                        id : 'interfaceId'
                    }
                ],

                sort: 'name'
            }
        )  
    }



    async add(req, res) {

        try {

            let {
                name = undefined,
                description = undefined,
                enabled = '1',
                dataLoggerId = undefined,
                deviceTypeId = undefined
            } = req.body
    
    
            if (!validators.validateString(name)){
                return res.status(400).json({
                    code : 401,
                    message : 'Invalid parameter: name'
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
    
    
       
            if (!validators.validateId(dataLoggerId)){
                return res.status(400).json({
                    code : 403,
                    message : 'Invalid parameter: dataLoggerId'
                });
            }
    
            const dataLogger = await this.knex('data_logger').where({id: dataLoggerId,  deleted : '0' }).first();
    
            if ( !dataLogger ){
                return res.status(400).json({
                    code : 404,
                    message : 'No dataLogger found'
                });
            }
            
    
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


            
            const device = await this.addRow (req,{
                name,
                description,
                enabled : `${enabled}` ,
                dataLoggerId,
                deviceTypeId
            })

            if (device?.id) {

                const meta = {
                    body: req.body,
                    token: req.newToken
                }

                
                // await req.core.configure({
                //     deviceType: true, 
                //     devices: true,  
                //     restart: false
                // });

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

                return res.status(201).json({ device , meta });
            }

        }  catch (error) {

            console.log( error );
            return res.status(500).json({error});
        }  
    }


    async edit(req, res) {

        const { id } = req.params;

        if (!validators.validateId(id)) {
            return res.status(404).send();
        }


        try {
            const obj = await this.knex(this.tableName).where({ id, deleted : '0'  }).first();

            if (!obj){
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


        const {
            name = undefined,
            description = undefined,
            enabled = undefined,
            dataLoggerId = undefined,
            deviceTypeId = undefined

        } = req.body


        if (name){

            if (!validators.validateString(name)){

                return res.status(400).json({
                    code : 300,
                    message : 'Invalid parameter: model'
                });
            }

            try {
                const obj = await this.knex(this.tableName).where({ name, deleted : '0' }) .whereNot('id', id).first();

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


        if (dataLoggerId){

            if (!validators.validateId(dataLoggerId)){
                return res.status(400).json({
                    code : 403,
                    message : 'Invalid parameter: dataLoggerId'
                });
            }
    
            const dataLogger = await this.knex('data_logger').where({id: dataLoggerId,  deleted : '0' }).first();
    
            if ( !dataLogger ){
                return res.status(400).json({
                    code : 404,
                    message : 'No dataLogger found'
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
    
            const deviceType = await this.knex('device_type').where({id: deviceTypeId,  deleted : '0' }).first();
    
            if ( !deviceType ){
                return res.status(400).json({
                    code : 404,
                    message : 'No deviceType found'
                });
            }
        }


        try {

            await this.editRow(req, id, {
                name,
                description,
                enabled : (enabled == 0 || enabled == 1) ? `${enabled}` : undefined ,
                dataLoggerId,
                deviceTypeId
            })

            /* ricaricamento */

            // await req.core.configure({
            //     deviceType: true, 
            //     devices: true,  
            //     restart: false
            // });

            if ( enabled || deviceTypeId || dataLoggerId){

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
                device : { id }
            });

        } catch (error) {

            console.log(error);
            return res.status(500).json({ error });
        }
    }



    async delete(req, res) {

        return super.delete(req, res, () =>{

            // req.core.setAdsStatus({
            //     deviceType: true,
            //     devices: true,
            //     restart: false
            // })

            // await req.core.configure({
            //     deviceType: true, 
            //     devices: true,  
            //     restart: false
            // });

            cache.load({
                deviceType: true,
                devices: true,
            })

            redisCache.setStatus({status : true}, 'upgrader');
        })
    }


    async deleteMultiple(req, res) {

        return super.deleteMultiple(req, res, () =>{

            // req.core.setAdsStatus({
            //     deviceType: true,
            //     devices: true,
            //     restart: false
            // })

            // await req.core.configure({
            //     deviceType: true, 
            //     devices: true,  
            //     restart: false
            // });

            cache.load({
                deviceType: true,
                devices: true,
            })

            redisCache.setStatus({status : true}, 'upgrader');
        })

    }


    async editMultiple(req, res) {

        return super.editMultiple(req, res, () =>{

            // req.core.setAdsStatus({
            //     deviceType: true,
            //     devices: true,
            //     restart: false
            // })

            // await req.core.configure({
            //     deviceType: true, 
            //     devices: true,  
            //     restart: false
            // });

            
            cache.load({
                deviceType: true,
                devices: true,
            })

            redisCache.setStatus({status : true}, 'upgrader');
        })

    }


    async getAll(req, res) {
        
        let {
            fields = undefined,
            page = config.pagination.page,
            limit = config.pagination.limit,
            sort = this.sort
        } = req.query;


        const where = Object.keys(req.query).reduce((acc, k) => 
            this.parameters.includes(k) ? [...acc, {[k]: req.query[k]}] : acc, []);
     

        const countQuery = this.knex(this.tableName).select()

        countQuery.leftJoin('rel_device_interfaces', `${this.tableName}.id`, 'rel_device_interfaces.deviceId');
        
        if (this.paranoid){
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

            if (this.relations !== undefined){

                this.relations.forEach(async element => {
                    
                    const data = await this.knex(element.tableName).where({ deleted: '0' }).select();

                    element.map = new Map();

                    data.forEach(item => {
                        element.map.set(item.id, item)
                    });

                });
            }
            
            const query = this.knex(this.tableName);

            if (this.paranoid){
                query.where({ deleted: '0' });
            }



            query.leftJoin('rel_device_interfaces', `${this.tableName}.id`, 'rel_device_interfaces.deviceId');
          
            

            this.applyWhereConditions(query, where);

            const selectFields = fields ? fields.split(',') : [`${this.tableName}.*`];

            selectFields.push( 'rel_device_interfaces.interfaceId', 'rel_device_interfaces.protocol' );

            console.log("Query applicata ");
            
            //console.log(query.toString());
            


            const data = await query.select(selectFields).orderBy(sort).limit(limit).offset(offset);
            if (this.relations !== undefined){

                data.map( item => {

                    this.relations.forEach(async relation => {
                        const key = relation.id.slice(0, -2);
                        item[ key ] = relation.map.get( item[ relation.id ] )
                    })
                })
            }

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

    async getOne(req, res) {

        const { id = undefined } = req.params;
        const { fields = undefined } = req.query;

        if (!validators.validateId(id)) {
            return res.status(404).send();
        }

        const where = {};

        where[`${this.tableName}.id`] = id;

        if (this.paranoid){
            where.deleted = '0'
        }

        const meta = {
            id,
            token: req.newToken
        };

        try {
          

            const selectFields = fields ? fields.split(',') : [`${this.tableName}.*`];
            selectFields.push( 'rel_device_interfaces.interfaceId' );


            const item = await this.knex(this.tableName)
                .leftJoin('rel_device_interfaces', `${this.tableName}.id`, 'rel_device_interfaces.deviceId')
                .select(selectFields)
                .where(where)
                .first();


            if (item) {

                delete item.password;

                if (this.relations !== undefined){

                    for (let index = 0; index < this.relations.length; index++) {
                        const relation = this.relations[index];

                        const [data] = await this.knex(relation.tableName).where({ 
                            id : item[relation.id] ?? 0 ,
                            deleted: '0' 
                        
                        }).select();
                        
                        const key = relation.id.slice(0, -2);
                        item[key] = {...data};

                    }
                }

                return res.status(200).json({ meta, data: item });
            }

            return res.status(404).json({ meta });

        } catch (error) {
            console.log(error);
            return res.status(404).json({ meta, error });
        }
    }




    /*** interface */


    async addInterface( req, res){

        const { id } = req.params;

        if (!validators.validateId(id)) {
            return res.status(404).send();
        }


        try {
            const obj = await this.knex(this.tableName).where({ id, deleted : '0' }).first();

            if (!obj){
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


        const {
            interfaceId = undefined,
            protocol = 'TCP',
            pollingPeriod = 30000,
            config = undefined
        } = req.body


        if (!validators.validateInterfaceProtocol(protocol)){
            return res.status(400).json({
                code : 405,
                message : 'Invalid parameter: protocol'
            });
        }

        if ( protocol === 'TCP' && !validators.validateId(interfaceId)){
            return res.status(400).json({
                code : 403,
                message : 'Invalid parameter: interfaceId'
            });
        }

        try {

            if (  !Number.parseInt(pollingPeriod) || Number.parseInt(pollingPeriod) < 1000) {
                return res.status(409).json({
                    code : 402,
                    message : `PollingPeriod ${pollingPeriod} is invalid.`
                });

            }    
        } catch (error) {
            console.log( error );
            return res.status(500).json({
                error
            });
        }


        if (!validators.validateObject(config)){
            return res.status(400).json({
                code : 403,
                message : 'Invalid parameter: protocol'
            });
        }


        try {
            const data = {
                deviceId : id,
                interfaceId,
                protocol,
                pollingPeriod,
                config
            }

            const tableName = 'rel_device_interfaces';

            const {effectedEntity : idRel} = await this.knex.transaction(async (trx) => {

                const [effectedEntity] = await trx(tableName).insert(data)
                    .onConflict('deviceId', 'interfaceId' )
                    .merge()
        
                if (!effectedEntity) {
                    throw new Error(`${tableName} insert error`);
                }
    
                const [logId] = await trx('logs').insert({
                    userId : req.auth.id,
                    entity : tableName,
                    entityId : effectedEntity,
                    operation : 'insert',
                    payload : data
                })
    
                return {
                    effectedEntity,
                    logId
                };
            });
    
            const meta = {
                body: req.body,
                token: req.newToken
            }
    
            if (id) {

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

                return res.status(201).json({ data: { idRel, ...data }, meta });
            }

        } catch (error) {
            console.error( error);
            return res.status(500).json({ error });
        }
    }


    
    async getInterface( req, res) {

        const { id } = req.params;

        if (!validators.validateId(id)) {
            return res.status(404).send();
        }

        let obj = null;

        try {
            obj = await this.knex(this.tableName).where({ id, deleted : '0' }).first();

            if (!obj){
                return res.status(404).json({
                    code : 404,
                    message : `A Element with this id: ${id} does not exist.`
                });
            }
        } catch (error) {
            
            console.log(error);
            return res.status(500).json({error});
        }

        try {
            const data = await this.knex('rel_device_interfaces').where({ 
                deviceId :id
            }).first();

            if (!data){
                return res.status(404).send();
            }


            const iface = await this.knex('device_interface').where({ 
                id : data.interfaceId
            }).first();

            if ( iface ){
                data.interface = iface;
            }
           

            data.config = JSON.parse(data.config);

            return res.status(200).json({
                data
            });
    
         


           
        } catch (error) {

            console.log(error);
            return res.status(500).json(
                {error}
            );
        }
    }


       
    async getStructures( req, res) {

        const { id } = req.params;

        if (!validators.validateId(id)) {
            return res.status(404).send();
        }

        let obj = null;

        try {
            obj = await this.knex(this.tableName).where({ id, deleted : '0' }).first();

            if (!obj){
                return res.status(404).json({
                    code : 404,
                    message : `A Element with this id: ${id} does not exist.`
                });
            }
        } catch (error) {
            
            console.log(error);
            return res.status(500).json({error});
        }

        try {
            const structures = await this.knex('devicetype_data_structure').where({ 
                devicetypeId: obj.deviceTypeId  
            }).select();

            return res.status(200).json({
                meta: {
                    count : structures.length
                },
                structures
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json(
                {error}
            );
        }
    }


}

export default new Device();
