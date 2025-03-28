/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    // Check if column exists

    return knex.schema.hasTable('restore_task').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('restore_task', function (table) {

                table.bigIncrements('id').primary();
                table.timestamp('startTime').defaultTo(knex.fn.now());
                table.timestamp('endTime').defaultTo(null);
                table.integer('status').defaultTo(0);
                table.integer('totalItems').defaultTo(0);
            });
        } else {
            console.log("La tabella 'restore_task' esiste già.");
        }
    });   
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex.schema.dropTable('restore_task');
};
