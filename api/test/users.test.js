import 'dotenv/config'
import mongoose from 'mongoose'
import supertest from 'supertest'
import createServer from '../server'
// Environment variables
const dbName = process.env.TEST_DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

import { userdata as User } from "../models/userdata.js";

const admin = {
  name: "test-wines",
  password: "test123",
  email: "test-wines@test.com",
  role: 'admin',
};

const notAdmin = {
  name: "test-wines",
  password: "test123",
  email: "test-wines2@test.com"
};

let token = "";

const register = async (app, user) => {
  await supertest(app)
    .post("/api/register")
    .send(user)
    .expect(201)
}

const login = async (app, user) => {

  await supertest(app)
    .post("/api/login")
    .send({
      email: user.email,
      password: user.password,
    })
    .expect(200)
    .then((response) => {
      token = response.body.token;
    });
}

beforeEach((done) => {
  mongoose.connect(
    `mongodb://${dbHost}:${dbPort}/${dbName}`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

const app = createServer();

test("GET /api/users", async () => {

  await register(app, admin);
  await login(app, admin);
  await supertest(app)
    .get("/api/users")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then((response) => {
      // Check the response type and length
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toEqual(1);

      // Check the response data
      expect(response.body[0].name).toEqual(admin.name);
      expect(response.body[0].email).toEqual(admin.email);
      expect(response.body[0].role).toEqual(admin.role);
    });
});

test("GET /api/users/:id", async () => {

    await register(app, admin);
    await login(app, admin);

    const user = await User.create({
      name: "test-wines",
      password: "test123",
      email: "dasd@asdas.com",
      role: 'admin',
    });

    await supertest(app)
      .get(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body.name).toEqual(user.name);
        expect(response.body.email).toEqual(user.email);
        expect(response.body.role).toEqual(user.role);
      });
});

test("PATCH /api/users/:id", async () => {

      await register(app, admin);
      await login(app, admin);

      const user = await User.create({
        name: "test-wines",
        password: "test123",
        email: "sadas@asd.com"
      });

      await supertest(app)
        .patch(`/api/users/${user.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "test-wines2",
          email: "test2@test.com",
        })
        .expect(200)
        .then((response) => {
          expect(response.body.name).toEqual("test-wines2");
          expect(response.body.email).toEqual("test2@test.com");
        });

});

test("DELETE /api/users/:id", async () => {

    await register(app, admin);
    await login(app, admin);

    const user = await User.create({
      name: "test-wines",
      password: "test123",
      email: "test-delete@test.com",
    });

    await supertest(app)
    .delete(`/api/users/${user.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then((response) => {
      expect(response.body.acknowledged).toBe(true);
      expect(response.body.deletedCount).toBe(1);
    });

    await supertest(app)
    .get(`/api/users/${user.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(404)
    .then((response) => {
      expect(response.body.message).toEqual("User not found");
    });
});

test("Attempt to get users without admin role", async () => {

    await register(app, notAdmin);
    await login(app, notAdmin);

    await supertest(app)
    .get("/api/users")
    .set("Authorization", `Bearer ${token}`)
    .expect(403)
    .then((response) => {
      expect(response.body.message).toEqual("Unauthorized");
    });
});

test("Attempt to get user without admin role", async () => {

      await register(app, notAdmin);
      await login(app, notAdmin);

      const user = await User.create({
        name: "test-wines",
        password: "test123",
        email: "test@test.com",
      });


      await supertest(app)
      .get(`/api/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(403)
      .then((response) => {
        expect(response.body.message).toEqual("Unauthorized");
      });
});

test("Attempt to patch user without admin role", async () => {

    await register(app, notAdmin);
    await login(app, notAdmin);

    const user = await User.create({
      name: "test-wines",
      password: "test123",
      email: "test-patch@test.com"
    });

    await supertest(app)
    .patch(`/api/users/${user.id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "test-wines2",
      email: "test-patch2@test.com"
    })
    .expect(403)
    .then((response) => {
      expect(response.body.message).toEqual("Unauthorized");
    });

});

test("Attempt to delete user without admin role", async () => {

    await register(app, notAdmin);
    await login(app, notAdmin);

    const user = await User.create({
      name: "test-wines",
      password: "test123",
      email: "test-delete@test.com",
    });

    await supertest(app)
    .delete(`/api/users/${user.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(403)
    .then((response) => {
      expect(response.body.message).toEqual("Unauthorized");
    });
});
