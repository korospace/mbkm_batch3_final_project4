const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { ValidationError } = require('sequelize');
const { User } = require("../models");

class UserController {
    /**
     * Register
     */
    static register(req,res) {
        let {full_name,email,username,password,profile_image_url,age,phone_number} = req.body;

        User.create({
            full_name,
            email,
            username,
            password,
            profile_image_url,
            age,
            phone_number,
        })
        .then(result => {
            let responseBody = {
                user: {
                    full_name,
                    email,
                    username,
                    profile_image_url,
                    age: result.age,
                    phone_number: result.phone_number,
                }
            }

            return res.status(201).json(responseBody);
        })
        .catch(err => {
            if (err instanceof ValidationError == false) {
                return res.status(500).json({
                    error:true,
                    message:err,
                });  
            } 
            else {
                const messages = [];
                err.errors.forEach((error) => {
                    messages.push({
                        key:error.path,
                        msg:error.message,
                    })
                });

                return res.status(400).json({
                    message:messages,
                }); 
            }
        })
    }

    /**
     * Login
     */
    static login(req,res) {
        let {email,password} = req.body;

        User.findOne({
            where:{
                email
            }
        })
        .then(result => {
            if (!result) {
                throw {
                    code: 401,
                    message: `email or password is wrong`
                }
            }

            const passIsCorrect = comparePassword(password,result.password);

            if (!passIsCorrect) {
                throw {
                    code: 401,
                    message: `email or password is wrong`
                }
            }

            let payload = {
                id: result.id,
                email: result.email,
            }

            let responseBody = {
                token: generateToken(payload)
            }

            return res.status(200).json(responseBody);
        })
        .catch(err => {
            return res.status(err.code).json({message:err.message});
        })
    }

    /**
     * Update
     */
    static update(req,res) {
        let {full_name,email,username,profile_image_url,age,phone_number} = req.body;

        User.update(
            {
                full_name,
                email,
                username,
                profile_image_url,
                age,
                phone_number
            },
            {
                where:{
                    id: req.params.id
                },
                returning:true
            }
        )
        .then(result => {
            let responseBody = {
                user: {
                    full_name,
                    email,
                    username,
                    profile_image_url,
                    age: result[1][0].age,
                    phone_number: result[1][0].phone_number,
                }
            }

            return res.status(200).json(responseBody);
        })
        .catch(err => {
            if (err instanceof ValidationError == false) {
                res.status(500).json({
                    error:true,
                    message:err,
                });  
            } 
            else {
                const messages = [];
                err.errors.forEach((error) => {
                    return messages.push({
                        key:error.path,
                        msg:error.message,
                    })
                });

                return res.status(400).json({
                    message:messages,
                }); 
            }
        })
    }

    /**
     * Delete
     */
     static delete(req,res) {

        User.destroy({
            where:{
                id: req.params.id
            },
        })
        .then(result => {
            return res.status(200).json({message:"Your account has been successfully deleted"});
        })
        .catch(err => {
            return res.status(500).json(err);
        })
    }
}

module.exports = UserController;