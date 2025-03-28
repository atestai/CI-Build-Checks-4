/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    // Check if column exists
    const hasColumnOrder = await knex.schema.hasColumn('setting', 'order');
    
    if (!hasColumnOrder) {
        return knex.schema.alterTable('setting', table => {
            table.text('order', 'int').nullable().after('group');
            table.text('domain', 'mediumtext').nullable().after('defaultValue');
        });
    }
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex.schema.alterTable('setting', table => {
        table.dropColumn('order');
        table.dropColumn('domain');
    });
};
