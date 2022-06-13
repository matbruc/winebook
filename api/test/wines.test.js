import 'dotenv/config'
import mongoose from 'mongoose'
import supertest from 'supertest'
import createServer from '../server'
// Environment variables
const dbName = process.env.TEST_DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

import { winedata as Wine } from "../models/winedata.js";

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

test("GET /api/wines", async () => {
  const wine = await Wine.create({
    name: "Wine 0",
    year: 1900,
    variety: "Grapes 1",
    producer: {_id: "1", name: "Producer 1"},
    region: "Region 1",
    subregion: "Subregion 1",
    country: "Country 1",
    review: "Review 1",
    rating: 90,
  });

  await register(app);
  await login(app);

  await supertest(app)
    .get("/api/wines")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then((response) => {
      // Check the response type and length
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toEqual(1);

      // Check the response data
      expect(response.body[0].name).toBe(wine.name);
      expect(response.body[0].year).toBe(wine.year);
      expect(response.body[0].variety).toBe(wine.variety);
      expect(response.body[0].producer._id).toBe(wine.producer._id);
      expect(response.body[0].producer.name).toBe(wine.producer.name);
      expect(response.body[0].region).toBe(wine.region);
      expect(response.body[0].subregion).toBe(wine.subregion);
      expect(response.body[0].country).toBe(wine.country);
      expect(response.body[0].review).toBe(wine.review);
      expect(response.body[0].rating).toBe(wine.rating);
    });

});

test("POST /api/wines", async () => {
  await register(app);
  await login(app);

  await supertest(app)
    .post("/api/wines")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Wine 1",
      year: 1900,
      variety: "Grapes 1",
      producer: {_id: "1", name: "Producer 1"},
      region: "Region 1",
      subregion: "Subregion 1",
      country: "Country 1",
      review: "Review 1",
      rating: 90,
    })
    .expect(200)
    .then((response) => {
      // Check the response data
      expect(response.body.name).toBe("Wine 1");
      expect(response.body.year).toBe(1900);
      expect(response.body.variety).toBe("Grapes 1");
      expect(response.body.producer._id).toBe("1");
      expect(response.body.producer.name).toBe("Producer 1");
      expect(response.body.region).toBe("Region 1");
      expect(response.body.subregion).toBe("Subregion 1");
      expect(response.body.country).toBe("Country 1");
      expect(response.body.review).toBe("Review 1");
      expect(response.body.rating).toBe(90);
    });

});

test("GET /api/wines/:id", async () => {
  const wine = await Wine.create({
    name: "Wine 1",
    year: 1900,
    variety: "Grapes 1",
    producer: {_id: "1", name: "Producer 1"},
    region: "Region 1",
    subregion: "Subregion 1",
    country: "Country 1",
    review: "Review 1",
    rating: 90,
  });

  await register(app);
  await login(app);

  await supertest(app)
    .get(`/api/wines/${wine._id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then((response) => {
      // Check the response data
      expect(response.body.name).toBe(wine.name);
      expect(response.body.year).toBe(wine.year);
      expect(response.body.variety).toBe(wine.variety);
      expect(response.body.producer._id).toBe(wine.producer._id);
      expect(response.body.producer.name).toBe(wine.producer.name);
      expect(response.body.region).toBe(wine.region);
      expect(response.body.subregion).toBe(wine.subregion);
      expect(response.body.country).toBe(wine.country);
      expect(response.body.review).toBe(wine.review);
      expect(response.body.rating).toBe(wine.rating);
    });
});

test("PATCH /api/wines/:id", async () => {
  const wine = await Wine.create({
    name: "Wine 1",
    year: 1900,
    variety: "Grapes 1",
    producer: {_id: "1", name: "Producer 1"},
    region: "Region 1",
    subregion: "Subregion 1",
    country: "Country 1",
    review: "Review 1",
    rating: 90,
  });

  await register(app);
  await login(app);

  await supertest(app)
    .patch(`/api/wines/${wine._id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Wine 2",
      year: 1900,
      variety: "Grapes 2",
      producer: {_id: "2", name: "Producer 2"},
      region: "Region 2",
      subregion: "Subregion 2",
      country: "Country 2",
      review: "Review 2",
      rating: 91,
    })
    .expect(200)
    .then((response) => {
      // Check the response data
      expect(response.body.name).toBe("Wine 2");
      expect(response.body.year).toBe(1900);
      expect(response.body.variety).toBe("Grapes 2");
      expect(response.body.producer._id).toBe("2");
      expect(response.body.producer.name).toBe("Producer 2");
      expect(response.body.region).toBe("Region 2");
      expect(response.body.subregion).toBe("Subregion 2");
      expect(response.body.country).toBe("Country 2");
      expect(response.body.review).toBe("Review 2");
      expect(response.body.rating).toBe(91);
    });

});

test("DELETE /api/wines/:id", async () => {
  const wine = await Wine.create({
    name: "Wine 3",
    year: 1900,
    variety: "Grapes 1",
    producer: {_id: "1", name: "Producer 1"},
    region: "Region 1",
    subregion: "Subregion 1",
    country: "Country 1",
    review: "Review 1",
    rating: 90,
  });

  await register(app);
  await login(app);

  await supertest(app)
    .delete(`/api/wines/${wine._id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then((response) => {
      expect(response.body.acknowledged).toBe(true);
      expect(response.body.deletedCount).toBe(1);
    });

  await supertest(app)
    .get(`/api/wines/${wine._id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBe("Wine not found");
    });

});

