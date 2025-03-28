/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
    return knex.schema.hasTable('historical_download').then((exists) => {
        if (!exists) {

            return knex.schema.createTable('historical_download', function (table) {
                table.bigIncrements('id').primary();
                table.string('payload').notNullable();
                table.boolean('status').defaultTo(false);
                table.timestamp('createdAt').defaultTo(knex.fn.now());
                table.specificType('updateAt', 'TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP').nullable();

            
            });
        } else {
            console.log("La tabella 'configuration_allarms' esiste già.");
        }
    });
};

/**
 * @param { import("knex").Knex } knex
 * 
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex.schema.dropTable('historical_download');
};

