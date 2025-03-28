
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

// Necessario quando usi ES modules per __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({
    path : [
		'/home/wisnam/geko5/.env', 
		'/home/Administrator/Geko5-backend/.env'
	]
})

//dotenv.config();

const WORKSPACE_DIR = process.env.WORKSPACE_DIR || __dirname;

const config = {

    database: {
		client: 'mysql2',
		debug: process.env.NODE_ENV === 'develop',
		connection: {
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASS
		},
		migrations: {
			directory: path.join(WORKSPACE_DIR, 'migrations'),
			loadExtensions: ['.js']
		},
		pool: {
			min: 2,
			max: 10
		}
    },

	redis : {
		port: 6379, // Redis port
		host: "127.0.0.1", // Redis host
		family: 4, // 4 (IPv4) or 6 (IPv6)
		db: 0
	},

	mongo : {
		url : 'mongodb://localhost:27017',
		db : 'geko5',
		signals : 'signals',
		alarms : 'alarms',
		configCollection : 'config',
		restoreTask : 'restore'
	},

	system : {
		MAX_DEVICE : 128,
		MAX_READ_PARAMETER : 64,
		MAX_VALUE_FOR_READ_PARAMETER : 64
	},

	workspaceDir : WORKSPACE_DIR,

	pagination :{
		page : 1,
		limit :50
	},

	convertType : {
		INT16: 1,
		UINT16: 1,
		INT32: 2,
		UINT32: 2,
		FLOAT32: 2,
		DOUBLE64: 4
	}
}

export default config;
