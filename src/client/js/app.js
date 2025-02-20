import { getGeoData, getWeatherData, getPhoto, getCountryData, getHotels } from "./APIurl.js";
import { handleRemoveClick, loadTripsFromStorage } from "./reusableFunction.js";

// Event listener that triggers when the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.querySelector("#btn-add");
  const printButton = document.querySelector("#printTrip");

  if (addButton) {
    addButton.addEventListener("click", handleSubmit);
  }
  if (printButton) {
    printButton.addEventListener("click", printTrip);
  }

  loadTripsFromStorage();

  document.getElementById("trip_list").addEventListener("click", handleRemoveClick);
});

// Handles form submission and adds a trip to local storage
async function handleSubmit(e) {
  e.preventDefault();

  const startCity = document.getElementById("startCity").value;
  const destinationCity = document.getElementById("destinationCity").value.toUpperCase();
  const departingDate = document.getElementById("departingDate").value;
  const arrivingDate = document.getElementById("arrivingDate").value;

  if (!startCity || !destinationCity || !departingDate || !arrivingDate) {
    alert("All required fields must be filled.");
    return;
  }

  let today = new Date();
  let tripDate = new Date(departingDate);
  let returnDate = new Date(arrivingDate);
  let countdown = Math.ceil((tripDate - today) / (1000 * 60 * 60 * 24));
  let tripLength = Math.ceil((returnDate - tripDate) / (1000 * 60 * 60 * 24));

  if (tripDate < today) {
    alert("Departure date cannot be in the past.");
    return;
  }
  if (returnDate <= tripDate) {
    alert("Arrival date must be after departure date.");
    return;
  }

  try {
    const latlng = await getGeoData(destinationCity);
    const cityImage = await getPhoto(destinationCity);
    const weatherData = await getWeatherData(latlng.lat, latlng.lng, departingDate);
    const countryData = (await getCountryData(destinationCity)) || {};
    const hotelData = (await getHotels(latlng.lat, latlng.lng)) || [];

    let trips = JSON.parse(localStorage.getItem("trips")) || [];

    const tripData = {
      startCity,
      destinationCity,
      departingDate,
      arrivingDate,
      countdown,
      tripLength,
      cityImage,
      temperature: weatherData.temperature,
      weather_condition: weatherData.weather_condition,
      name: countryData.name || "Country name not available",
      currency: countryData.currency || "Currency not available",
      language: countryData.language || "Language not available",
      hotel: hotelData.length > 0 ? hotelData : "No hotels available",
    };

    trips.push(tripData);
    localStorage.setItem("trips", JSON.stringify(trips));
    loadTripsFromStorage();
  } catch (error) {
    console.error("Error in handleSubmit:", error);
    alert("Something went wrong. Please try again.");
  }
}

// Export the functions for use in other parts of the project
export { handleSubmit };
