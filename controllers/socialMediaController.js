const { User,SocialMedia } = require("../models");
const { ValidationError } = require('sequelize');

class SocialMediaController {
    /**
     * Create
     */
    static create(req,res) {
        let userId = res.locals.user.id;
        let {name,social_media_url} = req.body;

        SocialMedia.create({
            name,
            UserId: userId,
            social_media_url,
        })
        .then(result => {
            let responseBody = {
                social_media: result
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
        let userId = res.locals.user.id;

        SocialMedia.findAll({
            where:{
                UserId: userId
            },
            include: [
                { model: User, attributes: ['id','username','profile_image_url']},
            ]
        })
        .then(result => {
            return res.status(200).json({
                social_medias: result
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
        let {name,social_media_url} = req.body;

        SocialMedia.update(
            {
                name,
                social_media_url
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
                social_media: result[1][0]
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
        SocialMedia.destroy({
            where:{
                id: req.params.id
            },
        })
        .then(result => {
            return res.status(200).json({message:"Your social media has been successfully deleted"});
        })
        .catch(err => {
            return res.status(500).json(err);
        })
    }
}

module.exports = SocialMediaController;