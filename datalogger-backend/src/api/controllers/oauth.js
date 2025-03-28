import knexConnect from 'knex';
import config from '../../../config.js';

import validator from "../../helpers/validators.js";
import cryptoFunc from "../../helpers/crypto-func.js";


const knex = knexConnect(config.database);
const tableName = 'user'


const OAuth = {

    //     async accessToken(req, res) {

    //         const {
    //             grant_type = 'password',

    //             username = undefined,
    //             password = undefined

    //         } = req.body;


    //         if (grant_type === 'password' ){

    //             if (!validator.validateString(username)){
    //                 return res.status(400).json({
    //                     code : 300,
    //                     message : 'Invalid parameter: username'
    //                 });
    //             }

    //             if (!validator.validateString(password)){
    //                 return res.status(400).json({
    //                     code : 301,
    //                     message : 'Invalid parameter: password'
    //                 });
    //             }

    //             const where = {
    //                 username,
    //                 password : cryptoFunc.sha1(password),
    //                 deleted : '0',
    //                 enabled : '1'
    //             }

    //             const user = await knex(tableName).where(where).first()

    //             if ( user ){

    //                 delete user.password;

    //                 const currentTimestamp = Math.floor(Date.now() / 1000);
    //                 const expiryTimestamp = currentTimestamp + (30 * 60); // 30 minuti in secondi

    //                 const token = cryptoFunc.sing({
    //                     grant_type,
    //                     data : user,
    //                     iat : currentTimestamp,
    //                     exp : expiryTimestamp
    //                 })

    //                 return res.status(200).json({
    //                     token,
    //                     user, 
    //                     iat : currentTimestamp,
    //                     exp : expiryTimestamp
    //                 });
    //             }

    //             return res.status(401).json({
    //                 code : 401,
    //                 message : `User not found` 
    //             });
    //         }


    //         res.status(400).json({
    //             code : 400,
    //             message : `grant_type is invalid. You can choose between: [password, authorization_code]`
    //         });

    //     },

    async accessToken(req, res) {
        const {
            grant_type = 'password',
            username = undefined,
            password = undefined
        } = req.body;

        if (grant_type === 'password') {
            if (!validator.validateString(username)) {
                return res.status(400).json({
                    code: 300,
                    message: 'Invalid parameter: username'
                });
            }

            if (!validator.validateString(password)) {
                return res.status(400).json({
                    code: 301,
                    message: 'Invalid parameter: password'
                });
            }

            const where = {
                username,
                password: cryptoFunc.sha1(password),
                deleted: '0',
                enabled: '1'
            };

            const user = await knex(tableName).where(where).first();

            if (user) {
                // Controllo dei ruoli
                const { role } = user;
                if (!['operator', 'admin', 'supervisor'].includes(role)) {
                    return res.status(403).json({
                        code: 403,
                        message: 'Invalid role'
                    });
                }

                // Rimuovi la password dai dati restituiti
                delete user.password;

                // Creazione del token
                const currentTimestamp = Math.floor(Date.now() / 1000);
                const expiryTimestamp = currentTimestamp + (30 * 60); // 30 minuti in secondi

                const token = cryptoFunc.sing({
                    grant_type,
                    data: { ...user, role }, // Aggiungi il ruolo al payload
                    iat: currentTimestamp,
                    exp: expiryTimestamp
                });

                return res.status(200).json({
                    token,
                    user,
                   
                    iat: currentTimestamp,
                    exp: expiryTimestamp
                });
            }

            return res.status(401).json({
                code: 401,
                message: 'User not found'
            });
        }

        res.status(400).json({
            code: 400,
            message: 'grant_type is invalid. You can choose between: [password, authorization_code]'
        });
    },


    async refreshToken(req, res) {

        const {
            refresh_token = undefined
        } = req.body;



        try {
            const { data } = cryptoFunc.verify(refresh_token);


            if (data) {

                const auth = JSON.parse(cryptoFunc.decrypt(data))

                if (auth) {

                    if (auth.grant_type === 'password') {

                        const where = {
                            id: auth.data.id,
                            deleted: '0',
                            enabled: '1'
                        }

                        const user = await knex(tableName).where(where).first()

                        if (user) {

                            delete user.password;

                            const currentTimestamp = Math.floor(Date.now() / 1000);
                            const expiryTimestamp = currentTimestamp + (30 * 60); // 30 minuti in secondi

                            const token = cryptoFunc.sing({
                                grant_type: auth.grant_type,
                                data: user,
                                iat: currentTimestamp,
                                exp: expiryTimestamp
                            })

                            return res.status(200).json({
                                token,
                                iat: currentTimestamp,
                                exp: expiryTimestamp
                            });
                        }
                    }

                }

            }
        } catch (error) {

            console.log(error);

            if (error && error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    code: 501,
                    message: error.message
                });
            }


            return res.status(401).json({
                error
            });

        }

        res.status(401).json({
            code: 300,
            message: 'Unauthorized'

        });


    },

  
    async authorize(req, res, next) {
        const { authorization } = req.headers;
    
        if (authorization === undefined) {
            return res.status(401).json({
                code: 300,
                message: 'Token not defined'
            });
        }
    
        try {
            const token = authorization.substr(7);
            const { data } = cryptoFunc.verify(token);
            const auth = JSON.parse(cryptoFunc.decrypt(data));
    
            if (auth && auth.grant_type === 'password') {
                const { id, username, role } = auth.data;
    
                const where = {
                    id,
                    username,
                    role,
                    deleted: '0',
                    enabled: '1'
                };
    
                const user = await knex(tableName).where(where).first();
    
                if (user) {
                    req.auth = { id, role, username, authorization };
    
                    // **Logiche di autorizzazione in base al ruolo**
                    if (role === 'admin') {
                        // Admin può fare tutto
                        return next();
                    }
    
                    if (role === 'supervisor') {
                        // Supervisor può fare tutto tranne DELETE
                        if (req.method === 'DELETE') {
                            return res.status(403).json({
                                code: 403,
                                message: 'Forbidden: Supervisors cannot delete resources'
                            });
                        }
                        return next();
                    }
    
                    if (role === 'operator') {
                        // Consenti solo GET, tranne per le rotte specifiche di modifica dell'account personale
                        const allowedPaths = [
                            `/user/${req.params.id}/password`,
                            `/user/${req.params.id}`,
                            `/historical_download`,
                        ];
                    
                        const isException = allowedPaths.some(path => req.path === path);
                    
                        if (req.method !== 'GET' && !isException) {
                            return res.status(403).json({
                                code: 403,
                                message: 'Forbidden: Operators can only perform read operations'
                            });
                        }
                    
                        // Continua se è un'eccezione o una GET
                        return next();
                    }
    
    
                    // Se il ruolo non è valido
                    return res.status(403).json({
                        code: 403,
                        message: 'Forbidden: Invalid role'
                    });
                }
            }
    
            return res.status(401).json({
                code: 401,
                message: 'Unauthorized'
            });
    
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                code: 300,
                message: 'Token not defined'
            });
        }
    }
    
}

export default OAuth;
