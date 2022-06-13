import 'dotenv/config'
import mongoose from 'mongoose'
import supertest from 'supertest'
import createServer from '../server'
// Environment variables
const dbName = process.env.TEST_DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

import { userdata as User } from "../models/userdata.js";

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

test("GET /api/producers without auth", async () => {

  await supertest(app)
    .get("/api/producers")
    .expect(403)
    .then((response) => {
      expect(response.body.message).toBe("Unauthorized");
    });
});

test("GET /api/producer without auth", async () => {

  await supertest(app)
    .get("/api/producers/1")
    .expect(403)
    .then((response) => {
      expect(response.body.message).toBe("Unauthorized");
    });
});

test("POST /api/producers without auth", async () => {

  await supertest(app)
    .post("/api/producers", {})
    .expect(403)
    .then((response) => {
      expect(response.body.message).toBe("Unauthorized");
    });
});

test("PUT /api/producers without auth", async () => {

    await supertest(app)
      .patch("/api/producers/1", {})
      .expect(403)
      .then((response) => {
        expect(response.body.message).toBe("Unauthorized");
      });

});

test("DELETE /api/producers without auth", async () => {

    await supertest(app)
      .delete("/api/producers/1")
      .expect(403)
      .then((response) => {
        expect(response.body.message).toBe("Unauthorized");
      });
});

test("GET /api/wines without auth", async () => {

    await supertest(app)
      .get("/api/wines")
      .expect(403)
      .then((response) => {
        expect(response.body.message).toBe("Unauthorized");
      });
});

test("GET /api/wine without auth", async () => {

    await supertest(app)
      .get("/api/wines/1")
      .expect(403)
      .then((response) => {
        expect(response.body.message).toBe("Unauthorized");
      });
});

test("POST /api/wines without auth", async () => {

    await supertest(app)
      .post("/api/wines", {})
      .expect(403)
      .then((response) => {
        expect(response.body.message).toBe("Unauthorized");
      });
});

test("PUT /api/wines without auth", async () => {

    await supertest(app)
      .patch("/api/wines/1", {})
      .expect(403)
      .then((response) => {
        expect(response.body.message).toBe("Unauthorized");
      });
});

test("DELETE /api/wines without auth", async () => {

    await supertest(app)
      .delete("/api/wines/1")
      .expect(403)
      .then((response) => {
        expect(response.body.message).toBe("Unauthorized");
      });
});

test("GET /api/reviews without auth", async () => {

    await supertest(app)
      .get("/api/reviews")
      .expect(403)
      .then((response) => {
        expect(response.body.message).toBe("Unauthorized");
      });
});

test("GET /api/review without auth", async () => {

    await supertest(app)
      .get("/api/reviews/1")
      .expect(403)
      .then((response) => {
        expect(response.body.message).toBe("Unauthorized");
      });
});

test("POST /api/reviews without auth", async () => {

    await supertest(app)
      .post("/api/reviews", {})
      .expect(403)
      .then((response) => {
        expect(response.body.message).toBe("Unauthorized");
      });
});

test("PUT /api/reviews without auth", async () => {

    await supertest(app)
      .patch("/api/reviews/1", {})
      .expect(403)
      .then((response) => {
        expect(response.body.message).toBe("Unauthorized");
      });
});

test("DELETE /api/reviews without auth", async () => {

    await supertest(app)
      .delete("/api/reviews/1")
      .expect(403)
      .then((response) => {
        expect(response.body.message).toBe("Unauthorized");
      });
});

test("GET /api/users without auth", async () => {

    await supertest(app)
      .get("/api/users")
      .expect(403)
      .then((response) => {
        expect(response.body.message).toBe("Unauthorized");
      });
});

test("GET /api/user without auth", async () => {

    await supertest(app)
      .get("/api/users/1")
      .expect(403)
      .then((response) => {
        expect(response.body.message).toBe("Unauthorized");
      });
});

test("PUT /api/users without auth", async () => {

    await supertest(app)
      .patch("/api/users/1", {})
      .expect(403)
      .then((response) => {
        expect(response.body.message).toBe("Unauthorized");
      });
});

test("DELETE /api/users without auth", async () => {

      await supertest(app)
        .delete("/api/users/1")
        .expect(403)
        .then((response) => {
          expect(response.body.message).toBe("Unauthorized");
        });
});

test("Register a new user", async () => {

    const user = {
      name: "test",
      password: "test",
      email: "test@test.com",
    };

    await supertest(app)
      .post("/api/register")
      .send(user)
      .expect(201)
      .then((response) => {
        expect(response.body.name).toBe("test");
        expect(response.body.email).toBe("test@test.com");
        expect(response.body.role).toBe("user");
        expect(response.body.token).not.toBeUndefined();
        expect(response.body.id).not.toBeUndefined();
      });
});

test("Attempt to register a user with an existing email", async () => {

      const user = {
        name: "test",
        password: "test",
        email: "test@test.com",
      };

      await User.create(user);

      await supertest(app)
        .post("/api/register")
        .send(user)
        .expect(409)
        .then((response) => {
          expect(response.body.message).toBe("User Already Exist. Please Login");
        });
});

test("Attempt to register a user without sending all fields", async () => {

        const user = {
          name: "test",
          password: "test",
        };

        await supertest(app)
          .post("/api/register")
          .send(user)
          .expect(400)
          .then((response) => {
            expect(response.body.message).toBe("All inputs are required");
          });
});

test("Login a user", async () => {

  const user = {
    name: "test",
    password: "test123",
    email: "test@test.com",
  };

  await supertest(app)
    .post("/api/register")
    .send(user)
    .expect(201)

  await supertest(app)
    .post("/api/login")
    .send({
      email: "test@test.com",
      password: "test123",
    })
    .expect(200)
    .then((response) => {
          expect(response.body.email).toBe("test@test.com");
          expect(response.body.role).toBe("user");
          expect(response.body.token).not.toBeUndefined();
    });
});

test("Attempt to login a user with an invalid email", async () => {
    const user = {
      name: "test",
      password: "test123",
      email: "test@test.com",
    };

    await supertest(app)
      .post("/api/register")
      .send(user)
      .expect(201)

    await supertest(app)
        .post("/api/login")
        .send({
          email: "test123@test.com",
          password: "test123",
        })
        .expect(400)
        .then((response) => {
          expect(response.body.message).toBe("Invalid Credentials");
        });
});

test ("Attempt to login a user without sending required data", async () => {
  const user = {
    name: "test",
    password: "test123",
    email: "test@test.com",
  };

  await supertest(app)
    .post("/api/register")
    .send(user)
    .expect(201)

  await supertest(app)
    .post("/api/login")
    .send({
      email: "test123@test.com"
    })
    .expect(400)
    .then((response) => {
      expect(response.body.message).toBe("All inputs are required");
    });
});

