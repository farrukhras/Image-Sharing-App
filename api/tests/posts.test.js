// Description: This file contains the tests for the posts routes
// Tests for the posts routes

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

// test the create post route first time
describe ("POST /api/posts/", () => {
  it("should create a new post - post 1", async () => {
    // create a new user
    const response = await request(app).post("/api/auth/register").send({
      username: "testUserForPosts",
      email: "testUser@gmail.com",
      password: "12345678",
      type:"register a new user"
    });

    // create a new post
    const response1 = await request(app).post("/api/posts").send({
      userId: response.body._id,
      desc: "This is post 1",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/150px-Wikipedia-logo-v2.svg.png",
      type:"create a new post"
    });
    expect(response1.statusCode).toBe(200);
  });

  it("should create another new post - post 2", async () => {
    // get a user based on username
    const response = await request(app).get("/api/users/?username=testUserForPosts").send({
      type:"get a user based on username"
    });

    // create a new post
    const response1 = await request(app).post("/api/posts").send({
      userId: response.body._id,
      desc: "Hey my name is post 2",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/150px-Wikipedia-logo-v2.svg.png",
      type:"create a new post"
    });
    expect(response1.statusCode).toBe(200);
  });
});

// test the get timeline posts route
describe ("GET /api/posts/timeline/:id", () => {
  it("should get all timeline posts", async () => {
    // get a user based on username
    const response = await request(app).get("/api/users/?username=testUserForPosts").send({
      type:"get a user based on username"
    });

    const response1 = await request(app).get(`/api/posts/timeline/${response.body._id}`).send({
      type:"get all timeline posts"
    });

    expect(response1.statusCode).toBe(200);
  });
});

// test the get all posts of a user
describe ("GET /api/posts/profile/:username", () => {
  let posts = [];
  it("should get all user posts", async () => {
    const response = await request(app).get("/api/posts/profile/testUserForPosts").send({
      type:"get all user posts"
    });
    posts = response.body;
    expect(response.statusCode).toBe(200);
  });
});