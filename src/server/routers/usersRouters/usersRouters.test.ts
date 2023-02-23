import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDataBase from "../../../database/connectDataBase";
import { app } from "../../index";
import User from "../../../database/models/User";
import { type UserStructure } from "../../../types";

let mongodbServer: MongoMemoryServer;

beforeAll(async () => {
  mongodbServer = await MongoMemoryServer.create();
  const mongoServerUrl = mongodbServer.getUri();

  await connectDataBase(mongoServerUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongodbServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("Given a POST `/users/login` endpoint", () => {
  const loginUrl = "/users/login";
  const mockUser: UserStructure = {
    password: "ronaldinho10",
    username: "ronaldinho",
    email: "ronaldinho@gronaldinho.com",
    avatar: "ronnie",
  };

  describe("When it receives a request with username `ronaldinho` and password `ronaldinho10`", () => {
    test("Then it should respond with a status 200 and with an object in its body with a property `token`", async () => {
      jwt.sign = jest.fn().mockImplementation(() => ({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2M2Y3ZDNmNTNkMjE1NzQyNGMzZDIyZmMiLCJ1c2VybmFtZSI6InJvbmFsZGluaG8iLCJpYXQiOjE2NzcxODkzNzF9.ckk0butuhuffjr3ly5sg5HiIBA7bg5z9C72MFO7HnbU",
      }));
      const expectedStatus = 200;
      const hashedpassword = await bcrypt.hash(mockUser.password, 10);

      await User.create({ ...mockUser, password: hashedpassword });

      const response = await request(app)
        .post(loginUrl)
        .send(mockUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("token");
    });
  });

  describe("When it receives a request with a non-registered username `Róman` and password `roman1234`", () => {
    beforeAll(async () => {
      await User.create(mockUser);
    });

    test("Then it should response with a status 401 and and error with a message `Wrong credentials`", async () => {
      const expectedErrorMessage = "Wrong credentials";
      const mockRomanUser: UserStructure = {
        username: "Róman",
        password: "roman1234",
        email: "",
        avatar: "asdfasdfa",
      };

      const expectedStatus = 401;

      const response = await request(app)
        .post(loginUrl)
        .send(mockRomanUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });
});
