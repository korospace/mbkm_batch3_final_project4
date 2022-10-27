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

let socmedId = "";

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
                                    done()
                                })
                        })
                })
        })
})

/**
 * Create socialmedias
 */

// - success
describe("POST - success /socialmedias", () => {
    it("should send response with 201 status code", (done) => {

        request(app)
            .post(`/socialmedias`)
            .set('token',token1)
            .send({ name: "facebook",social_media_url: "https://facebook.com/usertes1" })
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                socmedId = res.body.social_media.id;
                expect(res.status).toEqual(201);
                expect(res.body).toHaveProperty("social_media");
                expect(res.body.social_media).toHaveProperty("id");
                expect(res.body.social_media).toHaveProperty("name");
                expect(res.body.social_media).toHaveProperty("social_media_url");
                expect(res.body.social_media).toHaveProperty("UserId");
                expect(res.body.social_media).toHaveProperty("createdAt");
                expect(res.body.social_media).toHaveProperty("updatedAt");
                expect(typeof res.body.social_media.id).toEqual("number");
                expect(typeof res.body.social_media.UserId).toEqual("number");

                done()
            })
            
    })
})

// - failed - 1
describe("POST - failed-1 /socialmedias", () => {
    it("should send response with 401 status code", (done) => {

        request(app)
            .post(`/socialmedias`)
            .set('token',"")
            .send({ name: "facebook",social_media_url: "https://facebook.com/usertes1" })
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
describe("POST - failed-2 /socialmedias", () => {
    it("should send response with 400 status code", (done) => {

        request(app)
            .post(`/socialmedias`)
            .set('token',token1)
            .send({ name: "",social_media_url: "https://facebook/usertes1" })
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
 * Get socialmedias
 */

// - success
describe("GET - success /socialmedias", () => {
    it("should send response with 200 status code", (done) => {

        request(app)
            .get(`/socialmedias`)
            .set('token',token1)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(res.body).toHaveProperty("social_medias");
                expect(Array.isArray(res.body.social_medias)).toEqual(true);
                expect(res.body.social_medias[0]).toHaveProperty("id");
                expect(res.body.social_medias[0]).toHaveProperty("name");
                expect(res.body.social_medias[0]).toHaveProperty("social_media_url");
                expect(res.body.social_medias[0]).toHaveProperty("UserId");
                expect(res.body.social_medias[0]).toHaveProperty("createdAt");
                expect(res.body.social_medias[0]).toHaveProperty("updatedAt");
                expect(res.body.social_medias[0]).toHaveProperty("User");
                expect(typeof res.body.social_medias[0].id).toEqual("number");
                expect(typeof res.body.social_medias[0].UserId).toEqual("number");

                done()
            })
            
    })
})

// // - success
describe("GET - failed /socialmedias", () => {
    it("should send response with 401 status code", (done) => {

        request(app)
            .get(`/socialmedias`)
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
 * Update socialmedias
 */

// - success
describe("PUT - success /socialmedias/:id", () => {
    it("should send response with 200 status code", (done) => {

        request(app)
            .put(`/socialmedias/${socmedId}`)
            .set('token',token1)
            .send({ name: "facebook",social_media_url: "https://facebook.com/usertes1" })
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(res.body).toHaveProperty("social_media");
                expect(res.body.social_media).toHaveProperty("id");
                expect(res.body.social_media).toHaveProperty("name");
                expect(res.body.social_media).toHaveProperty("social_media_url");
                expect(res.body.social_media).toHaveProperty("UserId");
                expect(res.body.social_media).toHaveProperty("createdAt");
                expect(res.body.social_media).toHaveProperty("updatedAt");
                expect(typeof res.body.social_media.id).toEqual("number");
                expect(typeof res.body.social_media.UserId).toEqual("number");

                done()
            })
            
    })
})

// - failed-1
describe("PUT - failed-1 /socialmedias/:id", () => {
    it("should send response with 404 status code", (done) => {

        request(app)
            .put(`/socialmedias/2211`)
            .set('token',token1)
            .send({ name: "facebook",social_media_url: "https://facebook.com/usertes1" })
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(404);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("social media not found");

                done()
            })
            
    })
})

// - failed-2
describe("PUT - failed-2 /socialmedias/:id", () => {
    it("should send response with 400 status code", (done) => {

        request(app)
            .put(`/socialmedias/${socmedId}`)
            .set('token',token1)
            .send({ name: "",social_media_url: "https://facebook/usertes1" })
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

// // - failed-3
describe("PUT - failed-3 /socialmedias/:id", () => {
    it("should send response with 403 status code", (done) => {

        request(app)
            .put(`/socialmedias/${socmedId}`)
            .set('token',token2)
            .send({ name: "",social_media_url: "https://facebook/usertes1" })
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
 * Delete socialmedias
 */

// - failed-1
describe("DELETE - failed-1 /socialmedias/:id", () => {
    it("should send response with 401 status code", (done) => {

        request(app)
            .delete(`/socialmedias/${socmedId}`)
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
describe("DELETE - failed-2 /socialmedias/:id", () => {
    it("should send response with 404 status code", (done) => {

        request(app)
            .delete(`/socialmedias/2211`)
            .set('token',token1)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(404);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("social media not found");

                done()
            })
            
    })
})

// // - failed-3
describe("DELETE - failed-3 /socialmedias/:id", () => {
    it("should send response with 403 status code", (done) => {

        request(app)
            .delete(`/socialmedias/${socmedId}`)
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
describe("DELETE - success /socialmedias/:id", () => {
    it("should send response with 200 status code", (done) => {

        request(app)
            .delete(`/socialmedias/${socmedId}`)
            .set('token',token1)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("Your social media has been successfully deleted");

                done()
            })
            
    })
})

afterAll((done) => {
    sequelize.queryInterface.bulkDelete("Users", {})
    .then(() => {
            return done()
        })
        .catch((err) => {
            done(err)
        })
})