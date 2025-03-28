import knexConnect from 'knex';
import config from '../../../config.js';
import validators from "../../helpers/validators.js";

const knex = knexConnect(config.database);
const tableName = 'device_modbus';


export default {

    async add(req, res) {

        let {
            name = undefined,
            description = undefined,
            protocol = undefined,
            host = undefined,
            port = 502,
            unitId = 1,
            byteOrder = 'BE',
            wordOrder = 'BE',
            pollingPeriod = 30000

        } = req.body

        if (!validators.validateString(name)){
            return res.status(400).json({
                code : 401,
                message : 'Invalid parameter: name'
            });
        }

        if (!validators.validateString(protocol)){
            return res.status(400).json({
                code : 402,
                message : 'Invalid parameter: protocol'
            });
        }

        if (!validators.validateString(host)){
            return res.status(400).json({
                code : 403,
                message : 'Invalid parameter: host'
            });
        }


        try {
            
            const data = await knex(tableName).where({ name }).first()

            if (data){
                return res.status(409).json({
                    code : 402,
                    message : `Name ${name} has already been used.`
                });
            }
    
        } catch (error) {
            
            console.log( error );
            return res.status(500).json({
                error
            });
        }

        try {
            if ( Number.parseInt(pollingPeriod) < 1000) {
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
        

        
        const item = {
            name,
            description,
            protocol,
            host,
            port,
            unitId,
            byteOrder,
            wordOrder,
            pollingPeriod
        }


        try {
            let id = await knex(tableName).insert(item)

            const meta = {
                body: req.body,
                token: req.newToken
            }
    
            if (id) {
                id = id[0]
                return res.status(201).json({ deviceModbus: { id, ...item }, meta });
            }
        } catch (error) {
            console.log( error );

            return res.status(500).json({
                code : 500,
                message : error
            });
        }
       
        return res.status(400).json({ errors: errors.array(), meta });
        
    },


    async delete(req, res) {
        
        const { id } = req.params;
        
        const meta = {
            id,
            token: req.newToken
        }


        if ( validators.validateId(id) ){

            try {

                const device = await knex('device').where({ 
                    deleted : '0',
                    deviceModbusId : id
                }).select();
                
                if ( device.length ){
                    return res.status(400).json({
                        code : 401,
                        message : 'Cannot delete this item, beacuse used in other relations.'
                    });
                }

                await knex(tableName).update({deleted : '1' }).where({ id })    
                return res.status(204).send();

            } catch (error) {
                console.log(error);
                return res.status(500).json(
                    {error}
                );
            }

        }

        return res.status(404).send();
    },


    async deleteMultiple (req, res) {

        const {
            ids     = undefined
        } = req.body

        if ( !ids || !ids.length ){
            return res.status(404).json({
                code : 404,
                message : `Ids non valids.`
            });
        }

        try {

            const device = await knex('device').where({ 
                deleted : '0',
            }).whereIn('deviceModbusId', ids).select();
            
            
            if ( device.length ){
                return res.status(400).json({
                    code : 401,
                    message : 'Cannot delete this item, beacuse used in other relations.'
                });
            }

            await knex(tableName).update({deleted : '1'}).whereIn('id', ids)    
            return res.status(204).send();

        } catch (error) {
            console.log(error);
            return res.status(500).json(
                {error}
            );
        }
    },


    async edit(req, res) {

        const { id } = req.params;
        
        const meta = {
            id,
            token: req.newToken
        }

        if ( validators.validateId(id) ){

            try {
                const obj = await knex(tableName).where({ id, deleted : '0'  }).first();

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
                protocol = undefined,
                host = undefined,
                port = undefined,
                unitId = undefined,
                byteOrder = undefined,
                wordOrder = undefined,
                pollingPeriod = undefined
    
            } = req.body


            if (name){

                if (!validators.validateString(name)){

                    return res.status(400).json({
                        code : 300,
                        message : 'Invalid parameter: model'
                    });
                }

                try {
                    const obj = await knex(tableName).where({ name, deleted : '0' }) .whereNot('id', id).first();

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

        
            if (description){

                if (!validators.validateString(description)){
                    return res.status(400).json({
                        code : 300,
                        message : 'Invalid parameter: description'
                    });
                }
            }

            if (protocol){
                if (!validators.validateString(protocol)){
                    return res.status(400).json({
                        code : 402,
                        message : 'Invalid parameter: protocol'
                    });
                }
            }
    
            if (host){
                if (!validators.validateString(host)){
                    return res.status(400).json({
                        code : 403,
                        message : 'Invalid parameter: host'
                    });
                }
            }

            if (pollingPeriod){
                try {
                    if ( Number.parseInt(pollingPeriod) < 1000) {
                        return res.status(409).json({
                            code : 404,
                            message : `PollingPeriod ${pollingPeriod} is invalid.`
                        });
        
                    }    
                } catch (error) {
                      console.log( error );
                    return res.status(500).json({
                        error
                    });
                }
            }


            try {

                const data = {
                    name,
                    description,
                    protocol,
                    host,
                    port,
                    unitId,
                    byteOrder,
                    wordOrder,
                    pollingPeriod
                }
            
                await knex(tableName).update(data).where({ id })    


                const device = await knex('device').where({ 
                    deleted : '0',
                    deviceModbusId : id
                }).select();

                if ( device.length ){
                    req.core.configure();
                }

                return res.status(200).json({  
                    deviceType : {id, ...data},
                    meta  
                });

            } catch (error) {
                console.log(error);
                return res.status(500).json(
                    {error}
                );
            }
        }

        return res.status(404).send();
    },


    async getAll(req, res) {
        
        let {
            fields = undefined,
            name = undefined,

            page = config.pagination.page,
            limit = config.pagination.limit,

            sort = 'name'

        } = req.query;

      
        const where = []

        if (name) {
            where.push({ name })
        }
     
       
        const C = knex(tableName).where({ deleted : '0' })

        where.forEach(element => {

            if (Object.prototype.toString.call(element) === '[object Array]') {
                C.where(...element)
            }
            else {
                Object.keys(element).forEach(key => {
                    C.where(key, 'like', element[key] )
                });
            }
        });


        const count = await C.count('id as total').first()

        const { total } = count

        if (page <= 0) {
            page = 1;
        }

        const pages = Math.ceil(total / limit);
        const offset = limit * (page - 1)

        const meta = {
            total,
            pages,
            offset,
            limit,
            page,
            where,
            token: req.newToken
        }

        try {


            const C = knex(tableName).where( { deleted : '0' })

            where.forEach(element => {

                if (Object.prototype.toString.call(element) === '[object Array]') {
                    C.where(...element)
                }
                else {
                    Object.keys(element).forEach(key => {
                        C.where(key, 'like', element[key] )
                    });
                }
            });
          
            let selectFields = [];

            if (fields){
                selectFields = fields.split(',');
            }

            let data = await C.select(selectFields) .limit(limit).offset(offset)

            res.status(200).json({
                meta,
                data
            });

        } catch (error) {

            console.log(error);
            res.status(400).send();
        }
    },


    async getOne(req, res) {

        const { id = undefined } = req.params;
        const {fields = undefined} = req.query;


        if ( validators.validateId(id) ){

            const where = {
                id,
                deleted : '0'
            }

            const meta = {
                id,
                token: req.newToken
            }

            try {
            
                let selectFields = [];

                if (fields){
                    selectFields = fields.split(',');
                }

                const item = await knex(tableName).select(selectFields).where(where).first()

                //console.log(data)
                if(item) {
                    
                    const ret = {...item};

                    return res.status(200).json({
                        meta,
                        data : ret
                    });

                }
                else{

                    return res.status(404).send({
                        meta,
                        
                    });

                }

            } catch (error) {
                
                console.log(error);

                return res.status(404).send({
                    meta,
                    error
                });
            }
        }

        return res.status(404).send();
    },

}

