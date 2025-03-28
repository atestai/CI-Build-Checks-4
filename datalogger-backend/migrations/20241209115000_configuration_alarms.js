/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
    return knex.schema.hasTable('configuration_alarms').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('configuration_alarms', function (table) {
                table.bigIncrements('id').primary();
                // table.bigInteger('deviceId').unsigned().notNullable();
                // table.bigInteger('deviceTypeId').unsigned().notNullable();
                // table.bigInteger('signalId').unsigned().notNullable();
                table.string('name').notNullable();
                table.text('condition').notNullable();
                //table.text('condition_array').notNullable();
                table.integer('active_time');
                table.integer('deactive_time');
                table.text('message').notNullable();
                table.integer('severity').notNullable();
                table.enu('deleted', ['0', '1']).notNullable().defaultTo('0');
                table.timestamp('createdAt').defaultTo(knex.fn.now());
                table.specificType('updateAt', 'TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP').nullable();

                // // Creazione del vincolo Foreign Key con un nome abbreviato
                // table.foreign('deviceId')
                //     .references('id')
                //     .inTable('device')
                //     .onDelete('CASCADE')
                //     .withKeyName('fk_device_configuration_alarms');  // Nome abbreviato per il vincolo

                // table.foreign('deviceTypeId')
                //     .references('id')
                //     .inTable('device_type')
                //     .onDelete('CASCADE')
                //     .withKeyName('fk_device_type_configuration_alarms');  // Nome abbreviato per il vincolo

                // table.foreign('signalId')
                //     .references('id')
                //     .inTable('devicetype_data_structure')
                //     .onDelete('CASCADE')
                //     .withKeyName('fk_devicetype_data_structure_configuration_alarms');  // Nome abbreviato per il vincolo
            });
        } else {
            console.log("La tabella 'configuration_alarms' esiste già.");
        }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex.schema.dropTable('configuration_alarms');
};
