/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    return knex.schema.hasTable('association_asset_alarm').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('association_asset_alarm', function (table) {
                table.bigIncrements('id').primary();
                table.bigInteger('assetId').unsigned().notNullable();
                table.bigInteger('alarmId').unsigned().notNullable();
                
                //table.enu('deleted', ['0', '1']).notNullable().defaultTo('0');
                table.timestamp('createdAt').defaultTo(knex.fn.now());
                table.specificType('updateAt', 'TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP').nullable();


                // Creazione del vincolo Foreign Key con un nome abbreviato
                table.foreign('assetId')
                    .references('id')
                    .inTable('device')
                    .onDelete('CASCADE')
                    .withKeyName('fk_asset_association_alarm');

                table.foreign('alarmId')
                    .references('id')
                    .inTable('configuration_alarms')
                    .onDelete('CASCADE')
                    .withKeyName('fk_alarm_association_asset');

            });
        } else {
            console.log("La tabella 'configuration_allarms' esiste già.");
        }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex.schema.dropTable('association_asset_alarm');
};
