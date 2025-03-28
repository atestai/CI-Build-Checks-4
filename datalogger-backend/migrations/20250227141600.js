/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {

    const hasColumn = await knex.schema.hasColumn('devicetype_data_structure', 'signalType');
    
    if (!hasColumn) {
        return knex.schema.alterTable('devicetype_data_structure', table => {
            table.enum('signalType', ['measure','bitmask','enumeration']).notNullable().defaultTo('measure').collate('utf8mb4_general_ci').after('description');
        });
    }
}


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {

    const hasColumn = await knex.schema.hasColumn('devicetype_data_structure', 'signalType');

    if (hasColumn) {
        return knex.schema.alterTable('devicetype_data_structure', table => {
            table.dropColumn('signalType');
        });
    }
};
