const { generateToken,verifyToken } = require("../helpers/jwt");
const { sequelize } = require("../models");
const request = require("supertest");
const app = require("../app");

/**
 * Register
 */
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

const wrongRegisterData = {
    email : "user_tes",
    full_name : "",
    username : "",
    password : "",
    profile_image_url : "http://user/profile.jpg",
    age : '20s',
    phone_number : "0851s",
}

// - success
describe("POST - success /users/register", () => {
    it("should send response with 201 status code", (done) => {

        request(app)
            .post('/users/register')
            .send(registerData)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(201);
                expect(res.body).toHaveProperty("user");
                expect(res.body.user).toHaveProperty("email");
                expect(res.body.user).toHaveProperty("full_name");
                expect(res.body.user).toHaveProperty("username");
                expect(res.body.user).toHaveProperty("profile_image_url");
                expect(res.body.user).toHaveProperty("age");
                expect(res.body.user).toHaveProperty("phone_number");
                expect(typeof res.body.user.age).toEqual("number");
                expect(typeof res.body.user.phone_number).toEqual("number");

                // register user2
                request(app)
                    .post('/users/register')
                    .send(registerData2)
                    .end(function (err,res) {
                        if(err) {
                            done(err)
                        }

                        done()
                    })
            })
            
    })
})

// - failed
describe("POST - failed /users/register", () => {
    it("should send response with 201 status code", (done) => {

        request(app)
            .post('/users/register')
            .send(wrongRegisterData)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(400);
                expect(res.body).toHaveProperty("message");
                expect(Array.isArray(res.body.message)).toEqual(true);
                expect(res.body.message.length).toEqual(7);
                expect(res.body.message[0]).toHaveProperty("key");
                expect(res.body.message[0]).toHaveProperty("msg");
                done()
            })
            
    })
})

/**
 * Login
 */
let token = "";
let token2 = "";
const wrongLoginData = {
    email : "user_tess@gmail.com",
    password : "usertess",
}

// - success
describe("POST - success /users/login", () => {
    it("should send response with 200 status code", (done) => {

        request(app)
            .post('/users/login')
            .send(registerData)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                token = res.body.token;
                expect(res.status).toEqual(200);
                expect(res.body).toHaveProperty("token");
                expect(typeof token).toEqual("string");
                expect(verifyToken(token)).toHaveProperty("id");
                expect(verifyToken(token)).toHaveProperty("email");

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

// - failed
describe("POST - failed /users/login", () => {
    it("should send response with 401 status code", (done) => {

        request(app)
            .post('/users/login')
            .send(wrongLoginData)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(401);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("email or password is wrong");
                done()
            })
            
    })
})

/**
 * Update
 */

// - success
describe("PUT - success /users/:id", () => {
    it("should send response with 200 status code", (done) => {

        request(app)
            .put(`/users/${verifyToken(token).id}`)
            .set('token',token)
            .send(registerData)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(res.body).toHaveProperty("user");
                expect(res.body.user).toHaveProperty("email");
                expect(res.body.user).toHaveProperty("full_name");
                expect(res.body.user).toHaveProperty("username");
                expect(res.body.user).toHaveProperty("profile_image_url");
                expect(res.body.user).toHaveProperty("age");
                expect(res.body.user).toHaveProperty("phone_number");
                expect(typeof res.body.user.age).toEqual("number");
                expect(typeof res.body.user.phone_number).toEqual("number");

                done()
            })
            
    })
})

// - failed-1
describe("PUT - failed-1 /users/:id", () => {
    it("should send response with 404 status code", (done) => {

        request(app)
            .put(`/users/2211`)
            .set('token',token)
            .send(registerData)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(404);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("user not found");

                done()
            })
            
    })
})

// - failed-2
describe("PUT - failed-2 /users/:id", () => {
    it("should send response with 403 status code", (done) => {

        request(app)
            .put(`/users/${verifyToken(token2).id}`)
            .set('token',token)
            .send(registerData)
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
describe("DELETE - failed-1 /users/:id", () => {
    it("should send response with 401 status code", (done) => {

        request(app)
            .delete(`/users/${verifyToken(token).id}`)
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
describe("DELETE - failed-2 /users/:id", () => {
    it("should send response with 403 status code", (done) => {

        request(app)
            .delete(`/users/${verifyToken(token2).id}`)
            .set('token',token)
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
describe("DELETE - success /users/:id", () => {
    it("should send response with 200 status code", (done) => {

        request(app)
            .delete(`/users/${verifyToken(token).id}`)
            .set('token',token)
            .end(function (err,res) {
                if(err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("Your account has been successfully deleted");

                done()
            })
            
    })
})

/**
 * Clear Database
 */
afterAll((done) => {
    sequelize.queryInterface.bulkDelete("Users", {})
        .then(() => {
            return done()
        })
        .catch((err) => {
            done(err)
        })
})