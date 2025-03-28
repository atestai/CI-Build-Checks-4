/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    // Check if column exists
    const hasColumn = await knex.schema.hasColumn('data_logger', 'location');
    
    if (!hasColumn) {
        return knex.schema.alterTable('data_logger', table => {
            table.text('location', 'varchar').nullable().after('host');
        });
    }
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex.schema.alterTable('data_logger', table => {
        table.dropColumn('location');
    });
};
