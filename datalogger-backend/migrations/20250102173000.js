/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {

    const count = await knex('setting').where({group : 'saf',  key : 'forwardEnabled' }).count('id as total').first();
    const { total } = count;

    if ( total == 0 ) {

        return knex('setting').insert({ 
            group : 'saf',
            key : 'forwardEnabled',
            value : true,
            defaultValue : true,
            note : 'Enable or disable the restore task'
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex('setting').where({ 
        group : 'saf',
        key : 'forwardEnabled'
    }).del();
};
