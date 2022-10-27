const { ValidationError } = require('sequelize');
const { User,Photo,Comment } = require("../models");

class CommentController {
    /**
     * Create
     */
    static create(req,res) {
        let userId = res.locals.user.id;
        let {comment,PhotoId} = req.body;

        Comment.create({
            comment,
            PhotoId,
            UserId: userId,
        })
        .then(result => {
            let responseBody = {
                comment: result
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

        Comment.findAll({
            // where:{
            //     UserId: userId
            // },
            include: [
                { model: User, attributes: ['id','username','profile_image_url','phone_number']},
                { model: Photo, attributes: ['id','title','caption','poster_image_url']}
            ]
        })
        .then(result => {
            return res.status(200).json({
                comments:result
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
        let {comment} = req.body;

        Comment.update(
            {
                comment,
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
                comment: result[1][0]
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

        Comment.destroy({
            where:{
                id: req.params.id
            },
        })
        .then(result => {
            return res.status(200).json({message:"Your comment has been successfully deleted"});
        })
        .catch(err => {
            return res.status(500).json(err);
        })
    }
}

module.exports = CommentController;