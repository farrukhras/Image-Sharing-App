// Description: This file contains the tests for the user routes
// Tests for getting a user based on username, getting a user based on userId, following a user, unfollowing a user

const mongoose = require('mongoose');
const request = require("supertest");
const app = require("../index.js");
require("dotenv").config();

let server;

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

// test getting a user based on username
describe ("GET /api/users?username=", () => {
  // test the get user route
  it("should get a user", async () => {
    // create a new user
    const response = await request(app).post("/api/auth/register").send({
      username: "testUser",
      email: "testUser@gmail.com",
      password: "12345678",
      type:"register a new user"
    });

    // get the user
    const response1 = await request(app).get(`/api/users/?username=${response.body.username}`);
    expect(response1.statusCode).toBe(200);
  });

  // test the get user route with a non-existing username
  it("should not get a user with a non-existing username", async () => {
    const response = await request(app).get("/api/users/?username=nonExistingUser");
    expect(response.statusCode).toBe(500);
  });
});

// test getting a user based on userId
describe ("GET /api/users/:userId", () => {
  // test the get user route
  it("should get a user", async () => {
    // get the user
    const response = await request(app).get("/api/users/?username=testUser");
    
    const response1 = await request(app).get(`/api/users/?userId=${response.body._id}`);
    expect(response1.statusCode).toBe(200);
  });

  // test the get user route with a non-existing userId
  it("should not get a user with a non-existing userId", async () => {
    const response = await request(app).get("/api/users/?userId=60c7f9a8f4b7d0e3d4c7a4e6");
    expect(response.statusCode).toBe(500);
  });
});

// test following a user
describe ("PUT /api/users/:userId/follow", () => {
  // test the follow user route
  it("should follow a user", async () => {
    // create a new user which will be followed by the existing user
    const response = await request(app).post("/api/auth/register").send({
      username: "userToFollow",
      email: "userToFollow@gmail.com",
      password: "12345678",
      type:"register a new user"
    });

    // get the newly created user
    const newUser = await request(app).get(`/api/users/?username=${response.body.username}`);

    // get the current user
    const currentUser = await request(app).get(`/api/users/?username=testUser`);

    // follow the user
    const response1 = await request(app).put(`/api/users/${newUser.body._id}/follow`).send({
      userId: currentUser.body._id
    });
    expect(response1.statusCode).toBe(200);
  });

  // test the follow user route with your own userId
  it("should not follow a user with your own userId", async () => {
    // get the current user
    const currentUser = await request(app).get(`/api/users/?username=testUser`);

    // follow the user
    const response = await request(app).put(`/api/users/${currentUser.body._id}/follow`).send({
      userId: currentUser.body._id
    });
    expect(response.statusCode).toBe(403);
  });

  // test the follow user route with existing userId in the following array
  it("should not follow a user who has already been followed", async () => {
    // get the current user
    const currentUser = await request(app).get(`/api/users/?username=testUser`);

    // get the already followed user
    const followedUser = await request(app).get(`/api/users/?username=userToFollow`);

    // follow the user
    const response = await request(app).put(`/api/users/${followedUser.body._id}/follow`).send({
      userId: currentUser.body._id
    });
    expect(response.statusCode).toBe(403);
  });
});

// test getting a user's followers
describe ("GET /api/users/followers/:userId", () => {
  // test the get followers route
  it("should get a user's followers", async () => {
    // get the current user
    const currentUser = await request(app).get(`/api/users/?username=testUser`);

    // get the followers
    const response = await request(app).get(`/api/users/followers/${currentUser.body._id}`);

    expect(response.statusCode).toBe(200);
  });
});

// test un following a user
describe ("PUT /api/users/:userId/unfollow", () => {
  // test the un follow user route
  it("should un follow a user", async () => {
    // get the current user
    const currentUser = await request(app).get(`/api/users/?username=testUser`);

    // get the already followed user
    const followedUser = await request(app).get(`/api/users/?username=userToFollow`);

    // un follow the user
    const response = await request(app).put(`/api/users/${followedUser.body._id}/unfollow`).send({
      userId: currentUser.body._id
    });
    expect(response.statusCode).toBe(200);
  });

  // test the un follow user route for the case where we can not un follow a user who has not been followed
  it("should not unfollow a user who has not been followed", async () => {
    // get the current user
    const currentUser = await request(app).get(`/api/users/?username=testUser`);

    // get the already followed user
    const followedUser = await request(app).get(`/api/users/?username=userToFollow`);

    // un follow the user
    const response = await request(app).put(`/api/users/${followedUser.body._id}/unfollow`).send({
      userId: currentUser.body._id
    });
    expect(response.statusCode).toBe(403);
  });

  // test the un follow user route with your own userId
  it("should not unfollow a user with your own userId", async () => {
    // get the current user
    const currentUser = await request(app).get(`/api/users/?username=testUser`);

    // unfollow the user
    const response = await request(app).put(`/api/users/${currentUser.body._id}/unfollow`).send({
      userId: currentUser.body._id
    });
    expect(response.statusCode).toBe(403);
  });
});