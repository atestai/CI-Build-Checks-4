/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
    return knex.schema.hasTable('digital').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('digital', function (table) {

                table.bigIncrements('id').primary();
                table.bigInteger('device_type_data_structure_id').unsigned().notNullable();
                table.string('description', 255).notNullable();

                table.specificType('value', 'BIT(1)').notNullable().defaultTo(knex.raw("b'0'"));


                table.enum('type', ['Fault', 'Information', 'Service', 'Warning']).notNullable().defaultTo('Information');
                table.integer('priority').notNullable().defaultTo(1000);



                table.foreign('device_type_data_structure_id', 'FK_digital_devicetype_data_structure') // Assegna il nome al vincolo
                    .references('id')
                    .inTable('devicetype_data_structure')
                    .onDelete('CASCADE');

                // Vincolo di unicità su device_type_data_structure_id + bit
                table.unique(['device_type_data_structure_id', 'value'], {
                    indexName: 'unique_device_value',
                    storageEngineIndexType: 'BTREE'
                });

            });
        } else {
            console.log("La tabella 'digital' esiste già.");
        }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
    return knex.schema.dropTable('digital');
};
