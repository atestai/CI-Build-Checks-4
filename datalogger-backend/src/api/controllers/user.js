import {BaseController}  from './baseController.js';
import validators from "../../helpers/validators.js";
import { createHash } from "crypto";
import cryptoFunc from '../../helpers/crypto-func.js';
export class User extends BaseController{

    constructor() {
        super(
            'user',
            {
                parameters: [
                    'name',
                    'email',
                    'username',
                    'role'
                ],
                sort: 'name'
            }
        );
    }

    async add( req, res ){

        const token = req.headers['authorization']?.split(' ')[1];
        const decoded = cryptoFunc.verify(token);
        const decryptedData = cryptoFunc.decrypt(decoded.data); 
        const userPayload = JSON.parse(decryptedData);
        const roleToken = userPayload.data.role;
        
       

        const {
            name        = undefined,
            email       = undefined,
            username    = undefined,
            password    = undefined,
            role        = 'operator',
            enabled     = '1',
        } = req.body


   

        if(roleToken === 'supervisor' && role === 'admin'){
        
            return res.status(403).json({
                code: 403,
                message: 'You must be an admin to create an admin user.'
            });
        }


        if (!validators.validateString(name)){
            return res.status(400).json({
                code : 400,
                message : 'Invalid parameter: name'
            });
        }

        try {
            const data = await this.knex(this.tableName).where({ name,  deleted : '0' }).first()

            if (data){
                return res.status(409).json({
                    code : 402,
                    message : `Name ${name} has already been used.`
                });
            }
        } catch (error) {
            console.log( error );

            return res.status(500).json({
                code : 500,
                message : error
            });
           
        }


        if (!validators.validateString(username)){
            return res.status(400).json({
                code : 401,
                message : 'Invalid parameter: username'
            });
        }

        try {
            const data = await this.knex(this.tableName).where({ username,  deleted : '0' }).first()

            if (data){
                return res.status(409).json({
                    code : 402,
                    message : `Username ${username} has already been used.`
                });
            }
        } catch (error) {
            console.log( error );

            return res.status(500).json({
                code : 500,
                message : error
            });
           
        }


        if (!validators.validateUserRole(role)){
            return res.status(400).json({
                code : 404,
                message : 'Invalid parameter: role'
            });
        }


        if (email){

            if (!validators.validateEmail(email)){
                return res.status(400).json({
                    code : 402,
                    message : 'Invalid parameter: email'
                });
            }
        }

       

        if (!validators.validateString(password)) {
            return res.status(400).json({
                code: 403,
                message: 'Invalid parameter: password'
            });
        }

        const user = await this.addRow (req, {
            name,
            email,
            username,
            password : createHash('sha1').update(password).digest('hex'),
            role,
            enabled
            
        })            

        if (user?.id) {

            const meta = {
                body: req.body,
                token: req.newToken
            }

            delete user.password;

            return res.status(201).json({ user , meta });
        }
        else{
            return res.status(500).send();
        }

    }


    
    async changePassword(req, res){
    


        const { id } = req.params;

        if (!validators.validateId(id)) {
            return res.status(404).send();
        }

  


        if (Number(req.auth.id) !== Number(id)) {
            return res.status(403).json({
                code: 101,
                message: 'User non authorizated'
            });
        }


        
        const {
            oldPassword = undefined,
            newPassword = undefined
        } = req.body


        if (!validators.validateString(oldPassword)) {
            return res.status(400).json({
                code: 401,
                message: 'Invalid parameter: Old password'
            });
        }

        if (!validators.validateString(newPassword)) {
            return res.status(400).json({
                code: 402,
                message: 'Invalid parameter: New password'
            });
        }


        try {
            const obj = await this.knex(this.tableName).where({ 
                id, 
                password : createHash('sha1').update(oldPassword).digest('hex'),
                deleted : '0'  
            }).first();


            if (!obj){
                return res.status(404).json({
                    code : 404,
                    message : `A user with this credentials does not exist.`
                });
            }
            

            await this.editRow(req, id, {
                password : createHash('sha1').update(newPassword).digest('hex')
            })

            return res.status(200).json({
                user: { id }
            });

        } catch (error) {
            
            console.log(error);
            return res.status(500).json(
                {error}
            );
        }
    
    }


    async edit(req, res) {

        const token = req.headers['authorization']?.split(' ')[1];
        const decoded = cryptoFunc.verify(token);
        const decryptedData = cryptoFunc.decrypt(decoded.data); 
        const userPayload = JSON.parse(decryptedData);
        const roleToken = userPayload.data.role;
        
       

        const { id } = req.params;

        if (!validators.validateId(id)) {
            return res.status(404).send();
        }

        try {
            const obj = await this.knex(this.tableName).where({ id, deleted : '0'  }).first();

            if (!obj){
                return res.status(404).json({
                    code : 404,
                    message : `A Element with this id: ${id} does not exist.`
                });
            }

            if( roleToken === 'supervisor' && (obj.role === 'admin' || obj.role === 'supervisor')){
                return res.status(403).json({
                    code: 403,
                    message: 'You must be an admin to edit an admin/supervisor user.'
                });
            }
        } catch (error) {
            
            console.log(error);
            return res.status(500).json(
                {error}
            );
        }


        const {
            name        = undefined,
            email       = undefined,
            username    = undefined,
            password    = undefined,
            role        = undefined,
            enabled     = undefined,
        } = req.body

        if(roleToken === 'supervisor' && ( role === 'admin' || role === 'supervisor' )){
        
            return res.status(403).json({
                code: 403,
                message: 'A supervisor cannot change the role to admin.'
            });
        }


        if ( name ){

            if (!validators.validateString(name)){
                return res.status(400).json({
                    code : 401,
                    message : 'Invalid parameter: name'
                });
            }
            
            try {
                const data = await this.knex(this.tableName).where({ name, deleted : '0' }).whereNot('id', id).first();

                if (data){
                    return res.status(409).json({
                        code : 402,
                        message : `Name ${name} has already been used.`
                    });
                }
            } catch (error) {
                console.log( error );
                return res.status(500).json({
                    code : 500,
                    message : error
                });
            }
        }


        if ( username){

            if (!validators.validateString(username)){
                return res.status(400).json({
                    code : 401,
                    message : 'Invalid parameter: username'
                });
            }
    
            try {
                const data = await this.knex(this.tableName).
                where({ username,  deleted : '0' }).
                whereNot('id', id).first();
    
                if (data){
                    return res.status(409).json({
                        code : 402,
                        message : `Username ${username} has already been used.`
                    });
                }
            } catch (error) {
                console.log( error );
    
                return res.status(500).json({
                    code : 500,
                    message : error
                });
               
            }
        }


        if (role){
            
            if (!validators.validateUserRole(role)){
                return res.status(400).json({
                    code : 404,
                    message : 'Invalid parameter: role'
                });
            }

        }


        if (email){

            if (!validators.validateEmail(email)){
                return res.status(400).json({
                    code : 402,
                    message : 'Invalid parameter: email'
                });
            }
        }

    
        if (password){

            if (!validators.validateString(password)){
                return res.status(400).json({
                    code : 300,
                    message : 'Invalid parameter: password'
                });
            }
        }

      

        try {

            await this.editRow(req, id, {
                name,
                email,
                username,
                password : password ? createHash('sha1').update(password).digest('hex') : undefined,
                role,
                enabled
            })

            return res.status(200).json({
                user: { id }
            });

        } catch (error) {

            console.log(error);

            return res.status(500).json(
                { error }
            );
        }


    }

}

export default new User();