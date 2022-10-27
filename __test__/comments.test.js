const { generateToken,verifyToken } = require("../helpers/jwt");
const { sequelize } = require("../models");
const request = require("supertest");
const app = require("../app");

let token1 = "";
let token2 = "";

const registerData1 = {
    email : "user_tes@gmail.com",
    full_name : "user tes",
    username : "usertes",
    password : "usertes",
    profile_image_url : "http://user.com/profile.jpg",
    age : 20,
    phone_number : "0851",
}
const registerData2 = {
    email : "user_te2@gmail.com",
    full_name : "user tes2",
    username : "usertes2",
    password : "usertes2",
    profile_image_url : "http://user2.com/profile.jpg",
    age : 20,
    phone_number : "0851",
}

let photoId = "";
const photoData = {
    title : "gambar tes",
    caption : "ini gambar tes",
    poster_image_url : "https://tes.com/image/1.jpg",
}

let commentId = "";

beforeAll((done) => {
    // register user1
    request(app)
        .post('/users/register')
        .send(registerData1)
        .end(function (err,res) {
            if(err) {
                done(err)
            }

            // login user1
            request(app)
                .post('/users/login')
                .send(registerData1)
                .end(function (err,resLogin1) {
                    if(err) {
                        done(err)
                    }

                    token1 = resLogin1.body.token;
                    
                    // register user2
                    request(app)
                        .post('/users/register')
                        .send(registerData2)
                        .end(function (err,res) {
                            if(err) {
                                done(err)
                            }

                            // login user2
                            request(app)
                                .post('/users/login')
                                .send(registerData2)
                                .end(function (err,resLogin2) {
                                    if(err) {
                                        done(err)
                                    }

                                    token2 = resLogin2.body.token;

                                    // create photo user1
                                    request(app)
                                        .post(`/photos`)
                                        .set('token',token1)
                                        .send(photoData)
                                        .end(function (err,resPhoto) {
                                            if(err) {
                                                done(err)
                                            }
                                            
                                            photoId = resPhoto.body.id;
                                            done()
                                        })
                                })
                        })
                })
        })
})

/**
 * Create Comments
 */

// - success
describe("POST - success /comments", () => {
    it("should send response with 201 status code", (done) => {

        request(app)
            .post(`/comments`)
            .set('token',token1)
            .send({ comment: "wow that's cool",PhotoId: photoId })
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                commentId = res.body.comment.id;
                expect(res.status).toEqual(201);
                expect(res.body).toHaveProperty("comment");
                expect(res.body.comment).toHaveProperty("id");
                expect(res.body.comment).toHaveProperty("comment");
                expect(res.body.comment).toHaveProperty("UserId");
                expect(res.body.comment).toHaveProperty("PhotoId");
                expect(res.body.comment).toHaveProperty("createdAt");
                expect(res.body.comment).toHaveProperty("updatedAt");
                expect(typeof res.body.comment.id).toEqual("number");
                expect(typeof res.body.comment.UserId).toEqual("number");
                expect(typeof res.body.comment.PhotoId).toEqual("number");

                done()
            })
            
    })
})

// - failed - 1
describe("POST - failed-1 /comments", () => {
    it("should send response with 401 status code", (done) => {

        request(app)
            .post(`/comments`)
            .set('token',"")
            .send({ comment: "",PhotoId: photoId })
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(401);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("Unauthorized");

                done()
            })
            
    })
})

// - failed - 2
describe("POST - failed-2 /comments", () => {
    it("should send response with 400 status code", (done) => {

        request(app)
            .post(`/comments`)
            .set('token',token1)
            .send({ comment: "",PhotoId: photoId })
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(400);
                expect(res.body).toHaveProperty("message");
                expect(Array.isArray(res.body.message)).toEqual(true);
                expect(res.body.message[0]).toHaveProperty("key");
                expect(res.body.message[0]).toHaveProperty("msg");

                done()
            })
            
    })
})

/**
 * Get Comments
 */

// - success
describe("GET - success /comments", () => {
    it("should send response with 200 status code", (done) => {

        request(app)
            .get(`/comments`)
            .set('token',token1)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(res.body).toHaveProperty("comments");
                expect(Array.isArray(res.body.comments)).toEqual(true);
                expect(res.body.comments[0]).toHaveProperty("Photo");
                expect(res.body.comments[0]).toHaveProperty("User");

                done()
            })
            
    })
})

// - success
describe("GET - failed /comments", () => {
    it("should send response with 401 status code", (done) => {

        request(app)
            .get(`/comments`)
            .set('token',"")
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(401);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("Unauthorized");

                done()
            })
            
    })
})

/**
 * Update Comments
 */

// - success
describe("PUT - success /comments/:id", () => {
    it("should send response with 200 status code", (done) => {

        request(app)
            .put(`/comments/${commentId}`)
            .set('token',token1)
            .send({ comment: "wow that's cool" })
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(res.body).toHaveProperty("comment");
                expect(res.body.comment).toHaveProperty("id");
                expect(res.body.comment).toHaveProperty("comment");
                expect(res.body.comment).toHaveProperty("UserId");
                expect(res.body.comment).toHaveProperty("PhotoId");
                expect(res.body.comment).toHaveProperty("createdAt");
                expect(res.body.comment).toHaveProperty("updatedAt");
                expect(typeof res.body.comment.id).toEqual("number");
                expect(typeof res.body.comment.UserId).toEqual("number");
                expect(typeof res.body.comment.PhotoId).toEqual("number");

                done()
            })
            
    })
})

// - failed-1
describe("PUT - failed-1 /comments/:id", () => {
    it("should send response with 404 status code", (done) => {

        request(app)
            .put(`/comments/2211`)
            .set('token',token1)
            .send({ comment: "wow that's cool" })
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(404);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("comment not found");

                done()
            })
            
    })
})

// - failed-2
describe("PUT - failed-2 /comments/:id", () => {
    it("should send response with 400 status code", (done) => {

        request(app)
            .put(`/comments/${commentId}`)
            .set('token',token1)
            .send({ comment: "" })
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(400);
                expect(res.body).toHaveProperty("message");
                expect(Array.isArray(res.body.message)).toEqual(true);
                expect(res.body.message[0]).toHaveProperty("key");
                expect(res.body.message[0]).toHaveProperty("msg");

                done()
            })
            
    })
})

// - failed-3
describe("PUT - failed-3 /comments/:id", () => {
    it("should send response with 403 status code", (done) => {

        request(app)
            .put(`/comments/${commentId}`)
            .set('token',token2)
            .send({ comment: "" })
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(403);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("access denied");

                done()
            })
            
    })
})

/**
 * Delete Comments
 */

// - failed-1
describe("DELETE - failed-1 /comments/:id", () => {
    it("should send response with 401 status code", (done) => {

        request(app)
            .delete(`/comments/${commentId}`)
            .set('token',"")
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(401);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("Unauthorized");

                done()
            })
            
    })
})

// - failed-2
describe("DELETE - failed-2 /comments/:id", () => {
    it("should send response with 404 status code", (done) => {

        request(app)
            .delete(`/comments/2211`)
            .set('token',token1)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(404);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("comment not found");

                done()
            })
            
    })
})

// - failed-3
describe("DELETE - failed-3 /comments/:id", () => {
    it("should send response with 403 status code", (done) => {

        request(app)
            .delete(`/comments/${commentId}`)
            .set('token',token2)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(403);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("access denied");

                done()
            })
            
    })
})

// - success
describe("DELETE - success /comments/:id", () => {
    it("should send response with 200 status code", (done) => {

        request(app)
            .delete(`/comments/${commentId}`)
            .set('token',token1)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("Your comment has been successfully deleted");

                done()
            })
            
    })
})

afterAll((done) => {
    sequelize.queryInterface.bulkDelete("Comments", {})
        .then(() => {
            sequelize.queryInterface.bulkDelete("Users", {})
                .then(() => {
                    return done()
                })
                .catch((err) => {
                    done(err)
                })
        })
        .catch((err) => {
            done(err)
        })
})