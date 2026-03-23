import 'dotenv/config'
import mongoose from 'mongoose'
import supertest from 'supertest'
import createServer from '../server'

// Environment variables
const dbName = process.env.TEST_DB_NAME || process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

import { winedata as Wine } from "../models/winedata.js";
import { producerdata as Producer } from "../models/producerdata.js";

const admin = {
  name: "test-wines",
  password: "test123",
  email: "test-wines@test.com",
  role: 'admin',
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
  const url = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;
  mongoose.connect(
    url,
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

test("GET /api/reports/winesPerProducer", async () => {
  await register(app, admin);
  await login(app, admin);

  await Producer.create({ name: "Producer 1", region: "Tuscany", registered_on: "2020-01-01" });
  await Producer.create({ name: "Producer 2", region: "Piedmont", registered_on: "2020-01-01" });

  await Wine.create({ name: "Wine A", variety: "Cabernet", year: 2020, country: "Italy", region: "Tuscany", subregion: "Chianti", producer: null, review: "", rating: 8 });
  await Wine.create({ name: "Wine B", variety: "Merlot", year: 2019, country: "Italy", region: "Tuscany", subregion: "Bolgheri", producer: null, review: "", rating: 9 });
  await Wine.create({ name: "Wine C", variety: "Barolo", year: 2018, country: "Italy", region: "Piedmont", subregion: "Monferrato", producer: null, review: "", rating: 8 });

  await supertest(app)
    .get("/api/reports/winesPerProducer")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });
});

test("GET /api/reports/winesPerRegion", async () => {
  await register(app, admin);
  await login(app, admin);

  await Wine.create({ name: "Wine A", variety: "Cabernet", year: 2020, country: "Italy", region: "Tuscany", subregion: "Chianti", producer: null, review: "", rating: 8 });
  await Wine.create({ name: "Wine B", variety: "Merlot", year: 2019, country: "Italy", region: "Tuscany", subregion: "Bolgheri", producer: null, review: "", rating: 9 });
  await Wine.create({ name: "Wine C", variety: "Barolo", year: 2018, country: "Italy", region: "Piedmont", subregion: "Monferrato", producer: null, review: "", rating: 8 });

  await supertest(app)
    .get("/api/reports/winesPerRegion")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });
});

test("GET /api/reports/winesPerSubregion", async () => {
  await register(app, admin);
  await login(app, admin);

  await Wine.create({ name: "Wine A", variety: "Cabernet", year: 2020, country: "Italy", region: "Tuscany", subregion: "Chianti", producer: null, review: "", rating: 8 });
  await Wine.create({ name: "Wine B", variety: "Merlot", year: 2019, country: "Italy", region: "Tuscany", subregion: "Bolgheri", producer: null, review: "", rating: 9 });
  await Wine.create({ name: "Wine C", variety: "Barolo", year: 2018, country: "Italy", region: "Piedmont", subregion: "Monferrato", producer: null, review: "", rating: 8 });

  await supertest(app)
    .get("/api/reports/winesPerSubregion")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });
});

test("GET /api/reports/topWines", async () => {
  await register(app, admin);
  await login(app, admin);

  await Wine.create({ name: "Wine A", variety: "Cabernet", year: 2020, country: "Italy", region: "Tuscany", subregion: "Chianti", producer: null, review: "", rating: 8 });
  await Wine.create({ name: "Wine B", variety: "Merlot", year: 2019, country: "Italy", region: "Tuscany", subregion: "Bolgheri", producer: null, review: "", rating: 9 });
  await Wine.create({ name: "Wine C", variety: "Barolo", year: 2018, country: "Italy", region: "Piedmont", subregion: "Monferrato", producer: null, review: "", rating: 10 });

  await supertest(app)
    .get("/api/reports/topWines")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeLessThanOrEqual(10);
      if (response.body.length > 0) {
        expect(response.body[0].rating).toBeGreaterThanOrEqual(response.body[1]?.rating || 0);
      }
    });
});

test("GET /api/reports/winesPerProducer without auth", async () => {
  await supertest(app)
    .get("/api/reports/winesPerProducer")
    .expect(403)
    .then((response) => {
      expect(response.body.message).toBe("Unauthorized");
    });
});

test("GET /api/reports/winesPerRegion without auth", async () => {
  await supertest(app)
    .get("/api/reports/winesPerRegion")
    .expect(403)
    .then((response) => {
      expect(response.body.message).toBe("Unauthorized");
    });
});

test("GET /api/reports/winesPerSubregion without auth", async () => {
  await supertest(app)
    .get("/api/reports/winesPerSubregion")
    .expect(403)
    .then((response) => {
      expect(response.body.message).toBe("Unauthorized");
    });
});

test("GET /api/reports/topWines without auth", async () => {
  await supertest(app)
    .get("/api/reports/topWines")
    .expect(403)
    .then((response) => {
      expect(response.body.message).toBe("Unauthorized");
    });
});

test("GET /api/reports with empty database", async () => {
  await register(app, admin);
  await login(app, admin);

  // Test with empty database
  await supertest(app)
    .get("/api/reports/winesPerProducer")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.body)).toBeTruthy();
    });
});
