import {BaseController}  from './baseController.js';
import validators from "../../helpers/validators.js";


import redisCache from '../../core/redisCache.js';
import cache from '../../cache.js';

const tableName = 'setting';

//TODO: implementare la cache per le impostazioni

export class Settings extends BaseController{

    constructor() {
        super(
            tableName,
            {
                parameters: [
                    'group',
                    'key'
                ],
                sort: 'group',
                paranoid : false
            }
        );
    }


    async getFromkey(req, res){

        const { group = undefined, key = undefined } = req.params;
        const {fields = undefined} = req.query;

        if ( validators.validateString(group) && validators.validateString(key) ){

            const where = {
                group,
                key
            }

            const meta = {
                group,
                key,
                token: req.newToken
            }

            try {
            
                let selectFields = [];

                if (fields){
                    selectFields = fields.split(',');
                }

                const data = await this.knex(this.tableName).select(selectFields).where(where).first()

                if(data) {

                    try {
                        
                        console.log( {group, key, data} );

                        if ( group === 'system' && key === 'dataLoggerId' ){
                           
                            const dataLogger = await this.knex('data_logger').where({
                                id : data.value
                            }).first()

                            data.value ={
                                id : data.value,
                                name : dataLogger.name                             
                            } 
                        }

                        else{
                            data.value = JSON.parse(data.value);
                        }

                    } catch (error) {}

                    return res.status(200).json({
                        meta,
                        data
                    });
                }

                else{

                    return res.status(404).send({
                        meta,                        
                    });
                }

            }
            catch( error ){
                console.log(error);
                return res.status(500).send({
                    meta,
                    error
                });
            }

        }

        return res.status(404).send("invalid");
    }



    async edit(req, res){

        const { group = undefined, key = undefined } = req.params;
      
        const {value} = req.body

        console.log( group, key, value);
        

        if ( validators.validateString(group) && validators.validateString(key) ){

            const where = {
                group,
                key
            }

            const meta = {
                group,
                key,
                value,
                token: req.newToken
            }


            try {
            
                const data = await this.knex(this.tableName).select('id').where(where).first()

                if(data) {

                    const {id} = data;

                    //const saveValue = (typeof value === 'object') ? JSON.stringify( value ) : value;


                    await this.knex(this.tableName).update({
                        value
                    }).where({ id })    


                    if (group === 'modbus' ){

                        await cache.loadSettings();
                        await redisCache.publish( 'settings.modbus' ,  value )

                    }
                    else if (['system', 'ads' ].includes( group ) ){

                        await cache.loadSettings();
                        await redisCache.publish( 'settings.reconfigure' ,  value )
                    }

                    else if (['mqtt' ].includes( group ) ){
                       
                        await cache.loadSettings();

                        await redisCache.publish( 'settings.reconfigure' ,  value )
                        await redisCache.publish( 'settings.mqtt' ,  value )

                    }

                    else if (group === 'saf' && [ 'maxDbSizeGB', 'bufferBatchMinute' ].includes( key ) ){

                        await cache.loadSettings();
                        await redisCache.publish( 'settings.manager' ,  value )

                    }

                    return res.status(200).json({
                        meta,
                        id
                    });S
                }

                else{

                    return res.status( 422 ).send({
                        meta                   
                    });
                }
            }
            catch( error ){

                console.error(error);
                
                return res.status(500).send({
                    meta,
                    error
                });
            }
        }

        return res.status(404).send("invalid");
    }


    async editGroup(req, res) {

        const {group, data} = req.body
       
        if (!validators.validateSettingGroups(group)){

            return res.status(400).json({
                code : 300,
                message : 'Invalid parameter: group'
            });
        }


        if ( !data || !data.length ){

            return res.status(400).json({
                code : 300,
                message : 'Invalid parameter: data'
            });
        }


        try {
            const r = await this.knex.transaction(async (trx) => {

                const queries = data.map(({ key, ...update }) =>{

                    if (update.reset){

                        return this.knex(this.tableName)
                            .where('group', group)
                            .where('key', key)
                            .update({ value :  this.knex.raw('defaultValue') } )
                            .transacting(trx)
                        
                    }
                    else{
                       
                        return this.knex(this.tableName)
                            .where('group', group)
                            .where('key', key)
                            .update(update)
                            .transacting(trx)
                    }
                    
                });

                await Promise.all(queries);
            });


            if (['system', 'ads'].includes( group ) ){
              
                await cache.loadSettings();
                await redisCache.publish( 'settings.reconfigure' ,  true )
            }

            else if (['mqtt' ].includes( group ) ){
                       
                await cache.loadSettings();

                await redisCache.publish( 'settings.reconfigure' ,  true )
                //await redisCache.publish( 'settings.mqtt' ,  true )

            }

            else if (['modbus'].includes( group ) ){

                await cache.loadSettings();
                await redisCache.publish( 'settings.modbus' ,  true )

            }

            else if (['saf'].includes( group ) ){

                //console.log( group, data.map( d => d.key ).includes('maxDbSizeGB'));
                
                await cache.loadSettings();

                if ( data.map( d => d.key ).includes('maxDbSizeGB') || 
                    data.map( d => d.key ).includes('bufferBatchMinute') ){
                    await redisCache.publish( 'settings.manager' ,  true )
                }

            }
 
            return res.status(204).send();
          
        } catch (error) {
            console.error('Errore durante l\'update:', error);
            return res.status(500).json({error});

            //throw error;
        }
    }
}


export default new Settings();