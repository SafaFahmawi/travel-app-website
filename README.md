
# Travel App

## Description
This is a travel application that allows users to search for a city and receive information including:
- Geographic coordinates (latitude & longitude)
- Weather forecast
- City images
- Country details (name, currency, language)
- Nearby hotels

The application uses multiple APIs including:
- **GeoNames API** for location data
- **WeatherBit API** for weather forecast
- **Pixabay API** for images & videos
- **RestCountries API** for country details
- **Amadeus API** for hotels

## Features
- Search for a city and receive detailed travel information.
- View city weather forecast.
- Get relevant city images from Pixabay.
- Fetch details about the country including country name, currency and language.
- Find nearby hotels using Amadeus API.
- Responsive UI built with **SASS**.
- Optimized Webpack setup with development and production builds.

## Technologies Used
- **Frontend**: HTML, SCSS, JavaScript
- **Backend**: Node.js, Express.js
- **Build Tools**: Webpack, Babel
- **APIs Used**: GeoNames, WeatherBit, Pixabay, RestCountries, Amadeus

## Installation

### Prerequisites
- **Node.js** (v22.14.0)
- **npm** (comes with Node.js)

### Steps
1. **Clone the repository:**
   ``` git clone `https://github.com/SafaFahmawi/travel-app-website.git`

2. **Install dependencies:**
   ``` npm install

3. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following keys with your API credentials:
     ```env
     GEONAMES_USERNAME=your_username
     WEATHERBIT_API_KEY=your_api_key
     PIXABAY_API_KEY=your_api_key
     AMADEUS_API_KEY=your_api_key
     AMADEUS_API_SECRET=your_secret
     ```

4. **Start the development server:**
   ``` npm run build-dev
   ```
   The app will be available at `http://localhost:8080/`.

5. **Build for production:**
   ``` npm run build-prod

6. **Run the Express server:**
   ``` npm start

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/get-location?city={city}` | Get latitude and longitude for a city |
| GET | `/get-weather?lat={lat}&lng={lng}` | Get weather forecast |
| GET | `/get-photo?city={city}` | Fetch an image for the city |
| GET | `/get-country?city={city}` | Fetch country details |
| GET | `/get-hotels?latitude={lat}&longitude={lng}` | Fetch nearby hotels |

## Webpack Configuration
- **Development Mode** (`npm run build-dev`)
  - Uses `source-map` for debugging
  - Includes `style-loader` for live updates
- **Production Mode** (`npm run build-prod`)
  - Uses `MiniCssExtractPlugin` for CSS extraction
  - Includes hashed filenames for caching
  - Enables `WorkboxPlugin` for offline support
---

### 📌 Notes:
- Ensure API keys are correctly set in `.env` before running.

