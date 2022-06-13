import 'dotenv/config'
import mongoose from 'mongoose'
import supertest from 'supertest'
import createServer from '../server'
// Environment variables
const dbName = process.env.TEST_DB_NAME;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

import { reviewdata as Review } from "../models/reviewdata.js";

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

const createReview = async () => {
  await Review.create({
    user: {_id: "5e9f8f8f8f8f8f8f8f8f8f8f", name: "test-wines"},
    wine: {_id: "5e9f8f8f8f8f8f8f8f8f8f8f", name: "Wine 0"},
    look_tone: "test-wines",
    look_intensity: "test-wines",
    nose: "test-wines",
    mouth: "test-wines",
    body: 1,
    balance: 1,
    acidity: 1,
    alcohol: 1,
    sweet: 1,
    remarks: "test-wines",
    rating: 1,
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

test("GET /api/reviews", async () => {

  await createReview();
  await register(app);
  await login(app);
  await supertest(app)
    .get("/api/reviews")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then((response) => {
      expect(response.body.length).toBe(1);
      expect(response.body[0].user.name).toBe("test-wines");
      expect(response.body[0].wine.name).toBe("Wine 0");
      expect(response.body[0].look_tone).toBe("test-wines");
      expect(response.body[0].look_intensity).toBe("test-wines");
      expect(response.body[0].nose).toBe("test-wines");
      expect(response.body[0].mouth).toBe("test-wines");
      expect(response.body[0].body).toBe(1);
      expect(response.body[0].balance).toBe(1);
      expect(response.body[0].acidity).toBe(1);
      expect(response.body[0].alcohol).toBe(1);
      expect(response.body[0].sweet).toBe(1);
      expect(response.body[0].remarks).toBe("test-wines");
      expect(response.body[0].rating).toBe(1);
    });
});

test("GET /api/reviews/:id", async () => {

    const review = await Review.create({
      user: {_id: "5e9f8f8f8f8f8f8f8f8f8f8f", name: "test-wines"},
      wine: {_id: "5e9f8f8f8f8f8f8f8f8f8f8f", name: "Wine 0"},
      look_tone: "test-wines",
      look_intensity: "test-wines",
      nose: "test-wines",
      mouth: "test-wines",
      body: 1,
      balance: 1,
      acidity: 1,
      alcohol: 1,
      sweet: 1,
      remarks: "test-wines",
      rating: 1,
    });

    await register(app);
    await login(app);
    await supertest(app)
      .get(`/api/reviews/${review._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body.user.name).toBe("test-wines");
        expect(response.body.wine.name).toBe("Wine 0");
        expect(response.body.look_tone).toBe("test-wines");
        expect(response.body.look_intensity).toBe("test-wines");
        expect(response.body.nose).toBe("test-wines");
        expect(response.body.mouth).toBe("test-wines");
        expect(response.body.body).toBe(1);
        expect(response.body.balance).toBe(1);
        expect(response.body.acidity).toBe(1);
        expect(response.body.alcohol).toBe(1);
        expect(response.body.sweet).toBe(1);
        expect(response.body.remarks).toBe("test-wines");
        expect(response.body.rating).toBe(1);
      });
});

test("POST /api/reviews", async () => {

    await register(app);
    await login(app);
    await supertest(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({
        user: {_id: "5e9f8f8f8f8f8f8f8f8f8f8f", name: "test-wines"},
        wine: {_id: "5e9f8f8f8f8f8f8f8f8f8f8f", name: "Wine 0"},
        look_tone: "test-wines",
        look_intensity: "test-wines",
        nose: "test-wines",
        mouth: "test-wines",
        body: 1,
        balance: 1,
        acidity: 1,
        alcohol: 1,
        sweet: 1,
        remarks: "test-wines",
        rating: 1,
      })
      .expect(200)
      .then((response) => {
        expect(response.body.user.name).toBe("test-wines");
        expect(response.body.wine.name).toBe("Wine 0");
        expect(response.body.look_tone).toBe("test-wines");
        expect(response.body.look_intensity).toBe("test-wines");
        expect(response.body.nose).toBe("test-wines");
        expect(response.body.mouth).toBe("test-wines");
        expect(response.body.body).toBe(1);
        expect(response.body.balance).toBe(1);
        expect(response.body.acidity).toBe(1);
        expect(response.body.alcohol).toBe(1);
        expect(response.body.sweet).toBe(1);
        expect(response.body.remarks).toBe("test-wines");
        expect(response.body.rating).toBe(1);
      });
});

test("PATCH /api/reviews/:id", async () => {

      const review = await Review.create({
        user: {_id: "5e9f8f8f8f8f8f8f8f8f8f8f", name: "test-wines"},
        wine: {_id: "5e9f8f8f8f8f8f8f8f8f8f8f", name: "Wine 0"},
        look_tone: "test-wines",
        look_intensity: "test-wines",
        nose: "test-wines",
        mouth: "test-wines",
        body: 1,
        balance: 1,
        acidity: 1,
        alcohol: 1,
        sweet: 1,
        remarks: "test-wines",
        rating: 1,
      });

      await register(app);
      await login(app);
      await supertest(app)
      .patch(`/api/reviews/${review._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        user: {_id: "5e9f8f8f8f8f8f8f8f8f8f8f", name: "test-wines"},
        wine: {_id: "5e9f8f8f8f8f8f8f8f8f8f8f", name: "Wine 0"},
        look_tone: "test-wines2",
        look_intensity: "test-wines2",
        nose: "test-wines2",
        mouth: "test-wines2",
        body: 2,
        balance: 2,
        acidity: 2,
        alcohol: 2,
        sweet: 2,
        remarks: "test-wines2",
        rating: 2,
      })
      .expect(200)
      .then((response) => {
        expect(response.body.user.name).toBe("test-wines");
        expect(response.body.wine.name).toBe("Wine 0");
        expect(response.body.look_tone).toBe("test-wines2");
        expect(response.body.look_intensity).toBe("test-wines2");
        expect(response.body.nose).toBe("test-wines2");
        expect(response.body.mouth).toBe("test-wines2");
        expect(response.body.body).toBe(2);
        expect(response.body.balance).toBe(2);
        expect(response.body.acidity).toBe(2);
        expect(response.body.alcohol).toBe(2);
        expect(response.body.sweet).toBe(2);
        expect(response.body.remarks).toBe("test-wines2");
        expect(response.body.rating).toBe(2);
      });
});

test("DELETE /api/reviews/:id", async () => {

        const review = await Review.create({
          user: {_id: "5e9f8f8f8f8f8f8f8f8f8f8f", name: "test-wines"},
          wine: {_id: "5e9f8f8f8f8f8f8f8f8f8f8f", name: "Wine 0"},
          look_tone: "test-wines",
          look_intensity: "test-wines",
          nose: "test-wines",
          mouth: "test-wines",
          body: 1,
          balance: 1,
          acidity: 1,
          alcohol: 1,
          sweet: 1,
          remarks: "test-wines",
          rating: 1,
        });

        await register(app);
        await login(app);
        await supertest(app)
        .delete(`/api/reviews/${review._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .then((response) => {
          expect(response.body.acknowledged).toBe(true);
          expect(response.body.deletedCount).toBe(1);
        });

        await supertest(app)
        .get(`/api/reviews/${review._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
        .then((response) => {
          expect(response.body.message).toEqual("Review not found");
        });
});
