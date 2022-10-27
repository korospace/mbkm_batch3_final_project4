const { generateToken } = require("../helpers/jwt");
const { sequelize } = require("../models");
const request = require("supertest");
const app = require("../app");

let token = "";
let token2 = "";
const registerData = {
    email : "user_tes@gmail.com",
    full_name : "user tes",
    username : "usertes",
    password : "usertes",
    profile_image_url : "http://user.com/profile.jpg",
    age : 20,
    phone_number : "0851",
}
const registerData2 = {
    email : "user_tes2@gmail.com",
    full_name : "user tes2",
    username : "usertes2",
    password : "usertes2",
    profile_image_url : "http://user2.com/profile.jpg",
    age : 20,
    phone_number : "0851",
}

beforeAll((done) => {
    // register user1
    request(app)
        .post('/users/register')
        .send(registerData)
        .end(function (err,res) {
            if(err) {
                done(err)
            }

            // login user1
            request(app)
                .post('/users/login')
                .send(registerData)
                .end(function (err,res) {
                    if(err) {
                        done(err)
                    }

                    token = res.body.token;
                    
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
                                .end(function (err,res) {
                                    if(err) {
                                        done(err)
                                    }

                                    token2 = res.body.token;
                                    done()
                                })
                        })
                })
        })
})

/**
 * Create
 */
let photoId = "";
const photoData = {
    title : "gambar tes",
    caption : "ini gambar tes",
    poster_image_url : "https://tes.com/image/1.jpg",
}
const wrongPhotoData = {
    title : "",
    caption : "",
    poster_image_url : "https://tes/image/1.jpg",
}

// - success
describe("POST - success /photos", () => {
    it("should send response with 201 status code", (done) => {

        request(app)
            .post(`/photos`)
            .set('token',token)
            .send(photoData)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                photoId = res.body.id;
                expect(res.status).toEqual(201);
                expect(res.body).toHaveProperty("id");
                expect(res.body).toHaveProperty("poster_image_url");
                expect(res.body).toHaveProperty("title");
                expect(res.body).toHaveProperty("caption");
                expect(res.body).toHaveProperty("UserId");
                expect(typeof res.body.id).toEqual("number");
                expect(typeof res.body.UserId).toEqual("number");

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

// - failed-2
describe("POST - failed-2 /photos", () => {
    it("should send response with 400 status code", (done) => {

        request(app)
            .post(`/photos`)
            .set('token',token)
            .send(wrongPhotoData)
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
 * Get Photos
 */

// - success
describe("GET - success /photos", () => {
    it("should send response with 200 status code", (done) => {

        request(app)
            .get(`/photos`)
            .set('token',token)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(res.body).toHaveProperty("photos");
                expect(Array.isArray(res.body.photos)).toEqual(true);
                expect(res.body.photos[0]).toHaveProperty("id");
                expect(res.body.photos[0]).toHaveProperty("title");
                expect(res.body.photos[0]).toHaveProperty("caption");
                expect(res.body.photos[0]).toHaveProperty("poster_image_url");
                expect(res.body.photos[0]).toHaveProperty("UserId");
                expect(res.body.photos[0]).toHaveProperty("createdAt");
                expect(res.body.photos[0]).toHaveProperty("updatedAt");
                expect(res.body.photos[0]).toHaveProperty("Comments");
                expect(res.body.photos[0]).toHaveProperty("User");

                done()
            })
            
    })
})

// - success
describe("GET - failed /photos", () => {
    it("should send response with 401 status code", (done) => {

        request(app)
            .get(`/photos`)
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
 * Update
 */

// - success
describe("PUT - success /photos/:id", () => {
    it("should send response with 200 status code", (done) => {

        request(app)
            .put(`/photos/${photoId}`)
            .set('token',token)
            .send(photoData)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(res.body).toHaveProperty("photo");
                expect(res.body.photo).toHaveProperty("id");
                expect(res.body.photo).toHaveProperty("poster_image_url");
                expect(res.body.photo).toHaveProperty("title");
                expect(res.body.photo).toHaveProperty("caption");
                expect(res.body.photo).toHaveProperty("UserId");
                expect(res.body.photo).toHaveProperty("createdAt");
                expect(res.body.photo).toHaveProperty("updatedAt");
                expect(typeof res.body.photo.id).toEqual("number");
                expect(typeof res.body.photo.UserId).toEqual("number");

                done()
            })
            
    })
})

// - failed-1
describe("PUT - failed-1 /photos/:id", () => {
    it("should send response with 404 status code", (done) => {

        request(app)
            .put(`/photos/2211`)
            .set('token',token)
            .send(photoData)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(404);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("photo not found");

                done()
            })
            
    })
})

// - failed-2
describe("PUT - failed-2 /photos/:id", () => {
    it("should send response with 400 status code", (done) => {

        request(app)
            .put(`/photos/${photoId}`)
            .set('token',token)
            .send(wrongPhotoData)
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
describe("PUT - failed-3 /photos/:id", () => {
    it("should send response with 403 status code", (done) => {

        request(app)
            .put(`/photos/${photoId}`)
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
 * Delete
 */

// - failed-1
describe("DELETE - failed-1 /photos/:id", () => {
    it("should send response with 401 status code", (done) => {

        request(app)
            .delete(`/photos/${photoId}`)
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
describe("DELETE - failed-2 /photos/:id", () => {
    it("should send response with 404 status code", (done) => {

        request(app)
            .delete(`/photos/2211`)
            .set('token',token)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(404);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("photo not found");

                done()
            })
            
    })
})

// - failed-3
describe("DELETE - failed-3 /photos/:id", () => {
    it("should send response with 403 status code", (done) => {

        request(app)
            .delete(`/photos/${photoId}`)
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
describe("DELETE - success /photos/:id", () => {
    it("should send response with 200 status code", (done) => {

        request(app)
            .delete(`/photos/${photoId}`)
            .set('token',token)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("Your photo has been successfully deleted");

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