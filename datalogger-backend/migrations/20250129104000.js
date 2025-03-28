/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    return  knex('setting').where({ 
        group : 'modbus',
        key : 'fPosMinReal'
    }).del();

};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
};
