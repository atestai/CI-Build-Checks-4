// database.js
import knexConnect from 'knex';
import config from "./config.js"

const setupDatabase = async (knex) => {
  try {
    
    await knex.migrate.latest();
    console.log('Migrazioni completate con successo');

  } catch (err) {
    console.error('Errore durante le migrazioni:', err);
    process.exit(1);
  }
};


const knex = knexConnect(config.database);


export default { 
    db : knex,
    setupDatabase 
};