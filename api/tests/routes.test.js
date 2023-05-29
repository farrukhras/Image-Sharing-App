// Description: This file contains the tests for the routes
// Tests for the user register and login routes

const mongoose = require('mongoose');
const request = require("supertest");
const app = require("../index.js");
require("dotenv").config();

// connect to the mongoDB database before running any tests
beforeAll(() => {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// clear the database and close the connection after running all tests
afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

// test user register
describe ("POST /api/auth/register", () => {
  // test the register route
  it("should register a new user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "testUser1",
      email: "testUser1@gmail.com",
      password: "12345678",
      type:"register a new user"
    });

    expect(response.statusCode).toBe(200);
  });

  // test the register route with an existing email
  it("should not register a user with an existing email", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "testUser2",
      email: "testUser1@gmail.com",
      password: "12345678",
      type:"register a user with an existing email"
    });
    expect(response.statusCode).toBe(400);
  });

  // test the register route with an existing username
  it("should not register a user with an existing username", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "testUser1",
      email: "tes@gmail.com",
      password: "12345678",
    });
    expect(response.statusCode).toBe(400);
  });
});

// test user logins
describe ("POST /api/auth/login", () => {
  // test the login route
  it("should login a user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "testUser1@gmail.com",
      password: "12345678",
    });
    expect(response.statusCode).toBe(200);
  });
  
  // test the login route with incorrect email
  it("should not login a user with incorrect email", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "testUser1122@gmail.com",
      password: "12345678",
    });
    expect(response.statusCode).toBe(404);
  });
  
  // test the login route with incorrect password
  it("should not login a user with incorrect password", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "testUser1@gmail.com",
      password: "123456789",
    });
  
    expect(response.statusCode).toBe(400);
  });
  
  // test the login route with incorrect email and password
  it("should not login a user with incorrect email and password", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "wrongemail@gmail.com",
      password: "123456789",
    });
    expect(response.statusCode).toBe(404);
  });
});