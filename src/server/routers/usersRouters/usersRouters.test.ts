import request from "supertest";
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
    password: "12345678",
    username: "Marc",
    email: "marc@girbau.com",
    avatar: "sdfsaf",
  };

  describe("When it receives a request with username `Marc` and password `marc1234`", () => {
    test("Then it should respond with a status 200 and with an object in its body with a property `token`", async () => {
      const expectedStatus = 200;

      const user = await User.create(mockUser);

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
