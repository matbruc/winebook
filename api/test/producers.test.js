import 'dotenv/config'
import mongoose from 'mongoose'
import supertest from 'supertest'
import createServer from '../server'
import { producerdata as Producer } from "../models/producerdata.js";
// Environment variables
const dbName = process.env.TEST_DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

const user = {
  name: "test-wines",
  password: "test123",
  email: "test-wines@test.com",
};

let token = "";

const register = async app => {
  await supertest(app)
    .post("/api/register")
    .send(user)
    .expect(201)
}

const login = async app => {

  await supertest(app)
    .post("/api/login")
    .send({
      email: "test-wines@test.com",
      password: "test123",
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



test("GET /api/producers", async () => {
  const producer = await Producer.create({
    name: "Producer 1",
    region: "Region 1",
  });

  await register(app);
  await login(app);

  await supertest(app)
    .get("/api/producers")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then((response) => {
      // Check the response type and length
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toEqual(1);

      // Check the response data
      expect(response.body[0]._id).toBe(producer.id);
      expect(response.body[0].name).toBe(producer.name);
      expect(response.body[0].region).toBe(producer.region);
    });
});

test("GET /api/producers/:id", async () => {
  const producer = await Producer.create({
    name: "Producer 1",
    region: "Region 1",
  });

  await register(app);
  await login(app);

  await supertest(app)
    .get(`/api/producers/${producer.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then((response) => {
      expect(response.body.name).toBe(producer.name);
      expect(response.body.region).toBe(producer.region);
    });
});

test("POST /api/producers", async () => {
  await register(app);
  await login(app);

  await supertest(app)
    .post("/api/producers")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Producer 1",
      region: "Region 1",
    })
    .expect(200)
    .then((response) => {
      expect(response.body.name).toBe("Producer 1");
      expect(response.body.region).toBe("Region 1");
    });
});

test("PATCH /api/producers/:id", async () => {
  const producer = await Producer.create({
    name: "Producer 1",
    region: "Region 1",
  });

  await register(app);
  await login(app);

  await supertest(app)
    .patch(`/api/producers/${producer.id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Producer 2",
      region: "Region 2",
    })
    .expect(200)
    .then((response) => {
      expect(response.body.name).toBe("Producer 2");
      expect(response.body.region).toBe("Region 2");
    });

});

test("DELETE /api/producers/:id", async () => {
  const producer = await Producer.create({
    name: "Producer 1",
    region: "Region 1",
  });

  await register(app);
  await login(app);

  await supertest(app)
    .delete(`/api/producers/${producer.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then((response) => {
      expect(response.body.acknowledged).toBe(true);
      expect(response.body.deletedCount).toBe(1);
    });

  await supertest(app)
    .get(`/api/producers/${producer.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Producer not found");
    });
});
