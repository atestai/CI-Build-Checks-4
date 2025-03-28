/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {

    const hasColumn = await knex.schema.hasColumn('bitmask', 'bit');
    
    if (!hasColumn) {

        // return knex.schema.alterTable('devicetype_data_structure', table => {
        //     table.enum('signalType', ['measure','bitmask','enumeration']).notNullable().defaultTo('measure').collate('utf8mb4_general_ci').after('description');
        // });

        return knex.schema.alterTable('bitmask', function(table) {
            // 1. Change column name from 'position' to 'bit' with ENUM type
            knex.raw(`
              ALTER TABLE bitmask
              CHANGE COLUMN position bit ENUM('0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31') 
              NOT NULL DEFAULT '0' COLLATE 'utf8mb4_general_ci'
            `).then();
            
            // 2. Drop the existing unique index
            //table.dropUnique(null, 'unique_bit');
            
            // 3. Add the new unique index
            table.unique(['device_type_data_structure_id', 'bit'], {
              indexName: 'unique_bit',
              storageEngineIndexType: 'BTREE'
            });
          });
    }
}


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {

    return knex.schema.alterTable('bitmask', function(table) {
        // Reverse the changes in down migration
        
        // 1. Drop the new unique index
        table.dropUnique(null, 'unique_bit');
        
        // 2. Add back the original unique index (assuming its original configuration)
        // Note: This is a guess since we don't know the original index structure
        table.unique(['device_type_data_structure_id', 'position'], {
          indexName: 'unique_bit',
          storageEngineIndexType: 'BTREE'
        });
        
        // 3. Change column name back from 'bit' to 'position'
        knex.raw(`
          ALTER TABLE bitmask
          CHANGE COLUMN bit position ENUM('0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31') 
          NOT NULL DEFAULT '0' COLLATE 'utf8mb4_general_ci'
        `).then();
      });
};
