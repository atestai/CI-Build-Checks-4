import core from './src/core.js';

try {
    console.log('node:', process.env.NODE_ENV);
    
    const app = core();
    await app.start();

} catch (error) {
    console.log(error);
}


// Gestione degli errori
process.on('uncaughtException', (error) => {
    console.error('Errore non gestito:', error);
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('Ricevuto segnale SIGTERM, chiusura del server...');
    process.exit(0);
});

