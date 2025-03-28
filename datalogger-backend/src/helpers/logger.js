import fs from 'fs';


class Logger {
    constructor(filePath) {
        this.filePath = filePath;
    }

    // Aggiunge una riga di log con timestamp
    log(message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}\n`;
        
        try {
            fs.appendFileSync(this.filePath, logEntry);
        } catch (error) {
            console.error('Errore durante la scrittura del log:', error);
        }
    }

    // Aggiunge una riga di log con livello di severità
    logWithLevel(level, message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
        
        try {
            fs.appendFileSync(this.filePath, logEntry);
        } catch (error) {
            console.error('Errore durante la scrittura del log:', error);
        }
    }

    // Pulisce il file di log
    clear() {
        try {
            fs.writeFileSync(this.filePath, '');
        } catch (error) {
            console.error('Errore durante la pulizia del log:', error);
        }
    }
}


export default Logger