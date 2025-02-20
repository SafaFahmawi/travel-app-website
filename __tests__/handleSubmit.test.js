import { getGeoData, getWeatherData, getPhoto, getCountryData, getHotels } from "../src/client/js/APIurl";

global.fetch = jest.fn();

describe("API Functions", () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test("getGeoData returns correct latitude and longitude", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ lat: 40.7128, lng: -74.0060 })
        });

        const data = await getGeoData("New York");
        expect(data).toEqual({ lat: 40.7128, lng: -74.0060 });
    });

    test("getWeatherData returns weather information", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ temperature: 22, weather_condition: "Sunny" })
        });

        const data = await getWeatherData(40.7128, -74.0060, "2025-02-14");
        expect(data).toEqual({ temperature: 22, weather_condition: "Sunny" });
    });

    test("getPhoto returns image URL if available", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ imageURL: "https://example.com/image.jpg" })
        });

        const data = await getPhoto("Paris");
        console.log("Test getPhoto response:", data);
        expect(data).toBe("https://example.com/image.jpg");
    });

    test("getPhoto returns fallback image when no image is found", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({})
        });

        const data = await getPhoto("UnknownCity");
        expect(data).toBe("../images/plane.png");
    });

    test("getCountryData returns country details", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ name: "USA", currency: "USD", language: "English" })
        });

        const data = await getCountryData("Washington");
        expect(data).toEqual({ name: "USA", currency: "USD", language: "English" });
    });

    test("getHotels returns hotel list", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ hotels: [{ name: "Hotel A" }, { name: "Hotel B" }] })
        });

        const data = await getHotels(40.7128, -74.0060);
        expect(data).toEqual([{ name: "Hotel A" }, { name: "Hotel B" }]);
    });
});
