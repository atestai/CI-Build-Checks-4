import knexConnect from 'knex';
import config from '../../../config.js';

import validators from '../../helpers/validators.js';

export class BaseController {

    constructor(tableName, options = {}) {

        this.knex = knexConnect(config.database);

        this.tableName = tableName;
        this.parameters = options.parameters ?? [];
        this.paranoid = options.paranoid ?? true;
        this.sort = options.sort;

        this.relations = options.relations ?? undefined;
    }

    applyWhereConditions(query, where) {
        where.forEach(element => {
            if (Array.isArray(element)) {
                query.where(...element);
            } else {
                Object.keys(element).forEach(key => {
                    let value = element[key];
                    if (typeof value === 'string' && value.trim() !== '') {
                        // Sostituire spazi e `%20` con `%`
                        const adjustedValue = value.replace(/%20|\s+/g, '%');
                        query.where(key, 'like', adjustedValue);
                    } else if (typeof value === 'number') {
                        query.where(key, '=', value);
                    } else if (typeof value === 'boolean') {
                        query.where(key, '=', value ? 1 : 0);
                    } else if (value instanceof Date) {
                        query.where(key, '=', value.toISOString());
                    } else if (value !== null && value !== undefined) {
                        query.where(key, '=', value);
                    }
                });
            }
        });
        return query;
    }


    generateCopyName = async (baseName, table ,column, checkDelete) => {

        
        
        let query =  this.knex(table)
            .where(column, 'like', `${baseName}_copy-%`)
            .select(column);
    
        if(checkDelete){
            query = query.andWhere({ deleted: '0' });
        }
    
        const records = await query.select(column);
    
        if (records.length === 0) {
            return `${baseName}_copy-1`;
        }
    
        let maxCopy = 0;
        records.forEach(record => {
            const match = record[column].match(/_copy-(\d+)$/);
            if (match) {
                const copyNumber = parseInt(match[1], 10);
                if (copyNumber > maxCopy) {
                    maxCopy = copyNumber;
                }
            }
        });
    
        return `${baseName}_copy-${maxCopy + 1}`;
    };
    
    

    async getAll(req, res) {

        let {
            fields = undefined,
            page = config.pagination.page,
            limit = config.pagination.limit,
            sort = this.sort
        } = req.query;



        const where = Object.keys(req.query).reduce((acc, k) =>
            this.parameters.includes(k) ? [...acc, { [k]: req.query[k] }] : acc, []);


        const countQuery = this.knex(this.tableName)

        if (this.paranoid) {
            countQuery.where({ deleted: '0' });
        }


        this.applyWhereConditions(countQuery, where);


        const count = await countQuery.count('id as total').first();
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

            if (this.relations !== undefined) {

                this.relations.forEach(async element => {

                    const rQuery = {};

                    if ( element.paranoid === undefined || element.paranoid){
                        rQuery.deleted = '0'
                    }

                    const data = await this.knex(element.tableName).where(rQuery).select();

                    element.map = new Map();

                    data.forEach(item => {
                        element.map.set(item.id, item)
                    });

                });
            }

            const query = this.knex(this.tableName);

            if (this.paranoid) {
                query.where({ deleted: '0' });
            }


            this.applyWhereConditions(query, where);

            const selectFields = fields ? fields.split(',') : `${this.tableName}.*`;
            const data = await query.select(selectFields).orderBy(sort).limit(limit).offset(offset);

            if (this.relations !== undefined) {

                data.map(item => {

                    this.relations.forEach(async relation => {
                        const key = relation.id.slice(0, -2);
                        item[key] = relation.map.get(item[relation.id])
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

        const where = {
            id
        };

        

        if (this.paranoid) {
            where.deleted = '0'
        }

        const meta = {
            id,
            token: req.newToken
        };

        try {
            let selectFields = fields ? fields.split(',') : [];
            const item = await this.knex(this.tableName).select(selectFields).where(where).first();


            if (item) {

                delete item.password;

                if (this.relations !== undefined) {

                    for (let index = 0; index < this.relations.length; index++) {
                        const relation = this.relations[index];

                        const rQuery = {
                            id: item[relation.id] ?? 0
                        }

                        if ( relation.paranoid === undefined || relation.paranoid){
                            rQuery.deleted = '0'
                        }

                        const [data] = await this.knex(relation.tableName).where(rQuery).select();

                        const key = relation.id.slice(0, -2);
                        item[key] = { ...data };

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

    // async getSubEntity(req, res, options) {

    //     const { id } = req.params;

    //     if (!validators.validateId(id)) {
    //         return res.status(404).send();
    //     }

    //     const { subTableName, realtionId } = options;

    //     const meta = {
    //         id,
    //         token: req.newToken
    //     }

    //     try {
    //         const obj = await this.knex(this.tableName).where({ id, deleted: '0' }).first();

    //         if (!obj) {
    //             return res.status(404).json({
    //                 code: 404,
    //                 message: `A Element with this id: ${id} does not exist.`
    //             });
    //         }
    //     } catch (error) {

    //         console.log(error);
    //         return res.status(500).json(
    //             { error }
    //         );
    //     }

    //     try {
    //         const data = await this.knex(subTableName).where({ [realtionId]: id });

    //         return res.status(200).json({
    //             meta,
    //             data
    //         });

    //     } catch (error) {

    //         console.log(error);

    //         return res.status(500).json(
    //             { error }
    //         );
    //     }

    // }

    async getSubEntity(req, res, options) {
        const { id } = req.params;
        const { name , signalType } = req.query; // Estrai il parametro 'name' dalla query
    
        if (!validators.validateId(id)) {
            return res.status(404).send();
        }
    
        const { subTableName, realtionId } = options;
    
        const meta = {
            id,
            token: req.newToken
        };
    
        try {
            const obj = await this.knex(this.tableName).where({ id, deleted: '0' }).first();
    
            if (!obj) {
                return res.status(404).json({
                    code: 404,
                    message: `An element with this id: ${id} does not exist.`
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error });
        }
    
        try {
            // Crea la query con il filtro opzionale sul nome
            const query = this.knex(subTableName).where({ [realtionId]: id });
    
            // Aggiungi il filtro sul nome se presente
            if (name) {
                query.andWhere('name', 'like', `%${name.trim()}%`);
            }

            if (signalType) {
                query.andWhere('signalType', 'like', `%${signalType.trim()}%`);
            }
    
            const data = await query;
    
            return res.status(200).json({
                meta,
                data
            });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error });
        }
    }
    


    async delete(req, res, callBack = undefined) {

        const { id } = req.params;

        if (!validators.validateId(id)) {
            return res.status(404).send();
        }

        try {
            await this.knex.transaction(async (trx) => {

                const effectedEntity = this.paranoid ?
                    await trx(this.tableName)
                        .update({ deleted: '1' })
                        .where({ id }) :

                    await trx(this.tableName)
                        .del()
                        .where({ id });

                if (!effectedEntity) {
                    throw new Error(`${this.tableName} delete error`);
                }

                await trx('logs').insert({
                    userId: req.auth.id,
                    entity: this.tableName,
                    entityId: id,
                    operation: 'delete'
                });
            });


            if (callBack !== undefined && callBack.name !== 'next') {
                await callBack();
            }

            return res.status(204).send();

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }


    async deleteMultiple(req, res, callBack = undefined) {

        const { ids = undefined } = req.body;

        if (!ids || !ids.length) {
            return res.status(400).json({
                code: 1,
                message: 'Ids non valids.'
            });
        }

        try {
            await this.knex.transaction(async (trx) => {

                const effectedEntity = this.paranoid ?
                    await trx(this.tableName)
                        .update({ deleted: '1' })
                        .whereIn('id', ids)
                        .returning('*') :

                    await trx(this.tableName)
                        .del()
                        .whereIn('id', ids)
                        .returning('*');

                if (!effectedEntity) {
                    throw new Error(`${this.tableName} delete error`);
                }

                const queries = ids.map(id => {
                    return this.knex('logs')
                        .insert({
                            userId: req.auth.id,
                            entity: this.tableName,
                            entityId: id,
                            operation: 'delete'
                        })
                        .transacting(trx);
                });

                await Promise.all(queries);
            });


            if (callBack !== undefined && callBack.name !== 'next') {
                await callBack();
            }

            return res.status(204).send();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error });
        }
    }


    async addRow(req, data, tableName) {
        const table = tableName || this.tableName;

        try {
            const { effectedEntity: id } = await this.knex.transaction(async (trx) => {

                const [effectedEntity] = await trx(table).insert(data).returning('*')

                if (!effectedEntity) {
                    throw new Error(`${table} insert error`);
                }

                const [logId] = await trx('logs').insert({
                    userId: req.auth.id,
                    entity: table,
                    entityId: effectedEntity,
                    operation: 'insert',
                    payload: data
                })

                return {
                    effectedEntity,
                    logId
                };
            });

            return {
                id, ...data
            }

        } catch (error) {
            console.error(error);
            throw error;
        }

    }


    async addSubEntity(req, item, options) {

        const { subTableName } = options;

        try {

            const { effectedEntity: idStructure } = await this.knex.transaction(async (trx) => {

                const [effectedEntity] = await trx(subTableName).insert(item).returning('*')

                if (!effectedEntity) {
                    throw new Error(`${subTableName} insert error`);
                }

                const [logId] = await trx('logs').insert({
                    userId: req.auth.id,
                    entity: subTableName,
                    entityId: effectedEntity,
                    operation: 'insert',
                    payload: item
                })

                return {
                    effectedEntity,
                    logId
                };
            });

            return idStructure;

        } catch (error) {
            throw error;
        }
    }


    async editRow(req, id, data, tableName) {

        const table = tableName || this.tableName;


        await this.knex.transaction(async (trx) => {

            const effectedEntity = await this.knex(table).update(data).where({ id }).returning('*')

            if (!effectedEntity) {
                throw new Error(`${table} update error`);
            }


            if (Object.keys(data).length === 1 && data.hasOwnProperty('password')) {


                await trx('logs').insert({
                    userId: req.auth.id,
                    entity: table,
                    entityId: id,
                    operation: 'changePassword'
                })
            }

            else {
                await trx('logs').insert({
                    userId: req.auth.id,
                    entity: table,
                    entityId: id,
                    operation: 'update',
                    payload: data
                })
            }



            return {
                effectedEntity
            };
        });
    }


    async editMultiple(req, res, callBack) {

        const {
            enabled = undefined,
            ids = undefined
        } = req.body


        if (ids === undefined || !ids.length) {
            return res.status(404).json({
                code: 401,
                message: `Ids non valids.`
            });
        }

        if (enabled === undefined) {
            return res.status(404).json({
                code: 402,
                message: `Status non valid.`
            });
        }


        try {

            await this.knex.transaction(async (trx) => {

                const data = { enabled: enabled.toString() };

                const effectedEntity = await trx(this.tableName).update(data).whereIn('id', ids).returning('*')

                if (!effectedEntity) {
                    throw new Error('Data Logger update error');
                }

                const queries = ids.map(async id => {

                    return this.knex('logs')
                        .insert({
                            userId: req.auth.id,
                            entity: this.tableName,
                            entityId: id,
                            operation: 'update',
                            payload: data
                        }).transacting(trx);
                })

                await Promise.all(queries);

                return effectedEntity;
            });


            if (callBack !== undefined && callBack.name !== 'next') {
                await callBack();
            }

            return res.status(204).send();

        } catch (error) {
            console.log(error);
            return res.status(500).json(
                { error }
            );
        }

    }

}