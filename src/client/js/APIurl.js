// Fetches geographical coordinates (latitude and longitude) for a given city from the backend.
async function getGeoData(city) {
    try {
        const response = await fetch(`http://localhost:8000/get-location?city=${city}`);
        if (!response.ok) throw new Error("Failed to fetch location data");
        const geoData = await response.json();
        return geoData.lat && geoData.lng ? geoData : null;
    } catch (error) {
        console.error("Error fetching location:", error);
        alert("Location API is available, but there was an issue fetching data.");
        return null;
    }
}

// Fetches weather data for the given latitude, longitude, and date.
async function getWeatherData(lat, lng, date) {
    try {
        const response = await fetch(`http://localhost:8000/get-weather?lat=${lat}&lng=${lng}&date=${date}`);
        if (!response.ok) throw new Error("Failed to fetch weather data");
        return await response.json();
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Weather API is available, but there was an issue fetching data.");
        return null;
    }
}

// Fetches a city image from Pixabay. If no image is found, returns a default placeholder image.
async function getPhoto(city) {
    try {
        const response = await fetch(`http://localhost:8000/get-photo?city=${city}`);
        console.log("Response status:", response.status);

        if (!response.ok) throw new Error("Failed to fetch photo");

        const imageData = await response.json();

        if (imageData.imageURL) {
            return imageData.imageURL;
        } else {
            console.warn("No imageURL found, using fallback image.");
            return "../images/plane.png";
        }
    } catch (error) {
        console.error("Error fetching photo:", error);
        alert("Photo API is available, but there was an issue fetching data.");
        return "../images/plane.png";
    }
}


// Fetches country details based on the capital city using the REST Countries API.
async function getCountryData(city) {
    if (!city) {
        alert("Please enter a capital city");
        return {};
    }

    try {
        const response = await fetch(`http://localhost:8000/get-country?city=${city}`);
        if (!response.ok) throw new Error("Failed to fetch country data");

        const countryData = await response.json();

        if (!countryData || countryData.length === 0) {
            console.warn("No country available, proceeding without country data.");
            return {}; // Return an empty object if no country data is found
        }

        return countryData;
    } catch (error) {
        console.error("Error fetching country data:", error);
        alert("Country API is available, but there was an issue fetching data.");
        return {}; // Return an empty object in case of an error
    }
}

// Fetches hotel availability from Amadeus API
async function getHotels(cityLatitude, cityLongitude) {
    try {
        const response = await fetch(`http://localhost:8000/get-hotels?latitude=${cityLatitude}&longitude=${cityLongitude}`);
        if (!response.ok) throw new Error("Failed to fetch hotel data");

        const hotelData = await response.json();
        // Extract the hotels array from the returned object.
        const hotels = hotelData.hotels;

        if (!hotels || hotels.length === 0) {
            console.warn("No hotels available, proceeding without hotel data.");
            return []; // Return an empty array if no hotels are found
        }

        return hotels;
    } catch (error) {
        console.error("Error fetching hotel data:", error);
        alert("Hotel API is available, but there was an issue fetching data.");
        return []; // Return an empty array in case of an error
    }
}

export {
    getGeoData,
    getWeatherData,
    getPhoto,
    getCountryData,
    getHotels
}; 