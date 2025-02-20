import request from "supertest";
import app from "../src/server/app";

describe("API Endpoints", () => {
    test("GET /get-location should return latitude and longitude", async () => {
        const response = await request(app).get("/get-location?city=New York");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("lat");
        expect(response.body).toHaveProperty("lng");
    });

    test("GET /get-weather should return weather data", async () => {
        const response = await request(app).get("/get-weather?lat=40.7128&lng=-74.0060");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("temperature");
        expect(response.body).toHaveProperty("weather_condition");
    });

    test("GET /get-photo should return an image URL", async () => {
        const response = await request(app).get("/get-photo?city=Paris");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("imageURL");
    });

    test("GET /get-country should return country data", async () => {
        const response = await request(app).get("/get-country?city=London");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("currency");
        expect(response.body).toHaveProperty("language");
    });

    test("GET /get-hotels should return hotel data", async () => {
        const response = await request(app).get("/get-hotels?latitude=48.8566&longitude=2.3522");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("hotels");
        expect(Array.isArray(response.body.hotels)).toBe(true);
    });
});
