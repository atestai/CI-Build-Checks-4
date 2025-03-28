/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    // Check if column exists

    // return knex.schema.createTable('restore_task', function (table) {

    //     table.bigIncrements('id').primary();
    //     table.timestamp('startTime').defaultTo(knex.fn.now());
    //     table.timestamp('endTime').defaultTo(null);
    //     table.integer('status').defaultTo(0);
    //     table.integer('totalItems').defaultTo(0);
    // });

    return knex('setting').where({ 
        group : 'saf',
        key : 'timeDbClean'
    }).del();

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
      return knex('setting').insert({ 
        group : 'saf',
        key : 'timeDbClean',
        value : 60000,
        defaultValue : 60000,
        note : 'Time to clean the database (Milliseconds)'
    });
};
