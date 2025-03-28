/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {


    const count = await knex('setting').where({group : 'modbus',  key : 'enableRTU' }).count('id as total').first();
    const { total } = count;

    if ( total == 0 ) {

        return knex('setting').insert({ 
            group : 'modbus',
            key : 'enableRTU',
            value : false,
            defaultValue : false,
            note : 'Enable or disable RTU'
        });
    }
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex('setting').where({ 
        group : 'modbus',
        key : 'enableRTU'
    }).del();
};
