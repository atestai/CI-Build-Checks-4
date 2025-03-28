/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {

    const hasColumn = await knex.schema.hasColumn('configuration_alarms', 'condition_array');
    
    if (hasColumn) {
        return knex.schema.alterTable('configuration_alarms', table => {
            table.dropColumn('condition_array');
        });
    }

    const hasColumnCondition = await knex.schema.hasColumn('configuration_alarms', 'condition');
    
    if (hasColumnCondition) {

        return knex.schema.alterTable('configuration_alarms', table => {
            table.text('condition').notNullable().alter();
        });
    }
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  
};
