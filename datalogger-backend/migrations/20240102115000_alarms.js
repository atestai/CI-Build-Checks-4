/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
    return knex.schema.hasTable('alarms').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('alarms', function (table) {

                table.bigIncrements('id').primary();

                table.bigInteger('deviceId').unsigned().notNullable();
                table.bigInteger('configurationAlarmId').unsigned().notNullable();
                // table.bigInteger('deviceTypeId').unsigned().notNullable();
                // table.bigInteger('signalId').unsigned().notNullable();

                table.integer('severity').notNullable();
                table.text('message').notNullable();
                table.string('name').notNullable();

                // table.boolean('isActive').defaultTo(false)
                // table.integer('activeValue');
                // table.integer('previousValue');

                table.timestamp('timestampActive');
                table.timestamp('timestampDeactive');
             
                //table.integer('status').defaultTo('0');
                //table.enu('deleted', ['0', '1']).notNullable().defaultTo('0');

                table.timestamp('createdAt').defaultTo(knex.fn.now());
                table.specificType('updateAt', 'TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP').nullable();

                // Creazione del vincolo Foreign Key con un nome abbreviato
                table.foreign('configurationAlarmId')
                    .references('id')
                    .inTable('configuration_alarms')
                    .onDelete('CASCADE')
                    .withKeyName('fk_configurationAlarmId_alarms');  // Nome abbreviato per il vincolo

                table.foreign('deviceId')
                    .references('id')
                    .inTable('device')
                    .onDelete('CASCADE')
                    .withKeyName('fk_device_alarms');  // Nome abbreviato per il vincolo
            });
        } else {
            console.log("La tabella 'alarms' esiste già.");
        }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex.schema.dropTable('alarms');
};
