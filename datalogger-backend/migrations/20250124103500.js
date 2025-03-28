/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    // Check if column exists
    return knex.schema.alterTable('rel_device_interfaces', table => {
        table.bigInteger('interfaceId').unsigned().nullable().defaultTo(0).alter();
        table.enum('protocol', ['TCP', 'RTU', 'RTUoverTCP']).notNullable().defaultTo('TCP').collate('utf8mb4_general_ci').alter();
    });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return null;
};
