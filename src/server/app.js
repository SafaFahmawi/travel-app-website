import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("dist"));

// Serve homepage
app.get("/", (req, res) => {
    res.sendFile("dist/index.html", { root: process.cwd() });
});

// Helper function to fetch data from APIs (fixes 301 redirect issue)
const fetchData = async (url, headers = {}) => {
    try {
        const response = await fetch(url, { headers });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return null; // Return null on failure
    }
};

// Get Location Data (GeoNames)
app.get("/get-location", async (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "City is required" });

    const geoURL = `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${process.env.GEONAMES_USERNAME}`;
    const data = await fetchData(geoURL);

    if (!data || data.totalResultsCount === 0) return res.status(404).json({ error: "City not found" });
    res.json({ lat: data.geonames[0].lat, lng: data.geonames[0].lng });
});

// Get Weather Data (WeatherBit)
app.get("/get-weather", async (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: "Missing parameters" });

    const weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&key=${process.env.WEATHERBIT_API_KEY}`;
    const data = await fetchData(weatherURL);

    if (!data || !data.data) return res.status(404).json({ error: "Weather data not found" });
    res.json({ temperature: data.data[0].temp, weather_condition: data.data[0].weather.description });
});

// Get City Photo (Pixabay)
app.get("/get-photo", async (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "City is required" });

    const photoURL = `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${city}&image_type=photo`;
    const data = await fetchData(photoURL);

    if (!data || !data.hits || data.hits.length === 0) return res.status(404).json({ error: "No photo found for city" });
    res.json({ imageURL: data.hits[0].webformatURL });
});

// Route to fetch country data
app.get("/get-country", async (req, res) => {
    const { city } = req.query;

    if (!city) return res.status(400).json({ error: "City is required" });

    try {
        const response = await fetch(`https://restcountries.com/v3.1/capital/${city}`);
        if (!response.ok) throw new Error("Failed to fetch country data");

        const countryData = await response.json();

        if (!countryData || countryData.length === 0) {
            throw new Error("No country data found");
        }
        console.log(countryData); // Check the structure of the fetched data
        
        const result = {
            name: countryData[0]?.name?.common || 'Country name not available',
            currency: countryData[0]?.currencies ? Object.keys(countryData[0].currencies)[0] : 'Currency not available',
            language: countryData[0]?.languages ? Object.values(countryData[0].languages)[0] : 'Language not available'
        };

        res.json(result);
    } catch (error) {
        console.error("Error fetching country data:", error);
        res.status(500).json({ error: "Failed to retrieve country data" });
    }
});

let Amadeus_access_token = "";

// Get Amadeus API Token
const getAmadeusToken = async () => {
    try {
        const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: process.env.AMADEUS_API_KEY,
                client_secret: process.env.AMADEUS_API_SECRET
            })
        });

        if (!response.ok) throw new Error("Failed to retrieve Amadeus API token");

        const tokenData = await response.json();
        Amadeus_access_token = tokenData.access_token;
        return Amadeus_access_token;
    } catch (error) {
        console.error("Error fetching access token:", error);
        return null;
    }
};

// Get Hotels (Amadeus) (Fixes undefined data issue)
app.get("/get-hotels", async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and Longitude are required!" });
    }

    if (!Amadeus_access_token) {
        await getAmadeusToken();
    }

    try {
        const response = await fetch(`https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode?latitude=${latitude}&longitude=${longitude}`, {
            headers: { Authorization: `Bearer ${Amadeus_access_token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error fetching hotels:", errorData);
            return res.status(response.status).json({ error: "Failed to fetch hotels", details: errorData });
        }

        const data = await response.json();
        // Process the hotels data to extract only the necessary fields.
        const hotels = data.data.map(hotel => ({
            name: hotel.name,
            hotelId: hotel.hotelId,
            chainCode: hotel.chainCode,
            distance: hotel.distance,
            countryCode: hotel.address ? hotel.address.countryCode : "N/A",
            geoCode: hotel.geoCode,
            lastUpdate: hotel.lastUpdate
        }));

        res.json({ hotels });
    } catch (error) {
        console.error("Error fetching hotels:", error.message);
        res.status(500).json({ error: "Failed to fetch hotels" });
    }
});

export default app;
