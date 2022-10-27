const { User,Photo,Comment } = require("../models");
const { ValidationError } = require('sequelize');

class PhotoController {
    /**
     * Create
     */
    static create(req,res) {
        let userId = res.locals.user.id;
        let {title,caption,poster_image_url} = req.body;

        Photo.create({
            title,
            caption,
            UserId: userId,
            poster_image_url,
        })
        .then(result => {
            let responseBody = {
                title,
                caption,
                id: result.id,
                UserId: userId,
                poster_image_url,
            }

            return res.status(201).json(responseBody);
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
                    messages.push({
                        key:error.path,
                        msg:error.message,
                    })
                });

                res.status(400).json({
                    message:messages,
                }); 
            }
        })
    }

    /**
     * Get All
     */
    static getAll(req,res) {
        // let userId = res.locals.user.id;

        Photo.findAll({
            // where:{
            //     UserId: userId
            // },
            include: [
                { model: User, attributes: ['id','username','profile_image_url']},
                { model: Comment, attributes: ['comment'],include:[{model: User, attributes: ['username']}]}
            ]
        })
        .then(result => {
            return res.status(200).json({
                photos: result
            });
        })
        .catch(err => {
            return res.status(500).json({
                error:true,
                message:err,
            });
        })
    }

    /**
     * Update
     */
    static update(req,res) {
        let {title,caption,poster_image_url} = req.body;

        Photo.update(
            {
                title,
                caption,
                poster_image_url
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
                photo: result[1][0]
            }

            return res.status(200).json(responseBody);
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

        Photo.destroy({
            where:{
                id: req.params.id
            },
        })
        .then(result => {
            return res.status(200).json({message:"Your photo has been successfully deleted"});
        })
        .catch(err => {
            return res.status(500).json(err);
        })
    }
}

module.exports = PhotoController;