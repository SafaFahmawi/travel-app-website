
import { jsPDF } from "jspdf";

// Handles the click event for removing a trip.
function handleRemoveClick(event) {
    if (event.target.classList.contains("remove-trip-btn")) {
        const tripDiv = event.target.closest(".trip-item");
        if (!tripDiv) return;

        const destinationCity = tripDiv.querySelector("h3").textContent;
        removeTrip(destinationCity);
    }
}

// Removes a trip from local storage and updates the UI.
function removeTrip(city) {
    try {
        let trips = JSON.parse(localStorage.getItem("trips")) || [];
        trips = trips.filter(trip => trip.destinationCity !== city);
        localStorage.setItem("trips", JSON.stringify(trips));
        loadTripsFromStorage();
    } catch (error) {
        console.error("Error removing trip:", error);
    }
}

// Loads trips from local storage and updates the UI.
function loadTripsFromStorage() {
    try {
        const trips = JSON.parse(localStorage.getItem("trips")) || [];
        const tripList = document.getElementById("trip_list");
        if (!tripList) return;

        tripList.innerHTML = ""; // Clear existing trips
        trips.reverse().forEach(updateUI); // Ensure new trips appear at the top

        togglePrintButton();

        // Get the trip details section element.
        const tripDetailsSection = document.getElementById("trip_details_section");
        if (tripDetailsSection) {
            // Show the section if there are trips; otherwise, hide it.
            tripDetailsSection.style.display = trips.length > 0 ? "block" : "none";
        }
    } catch (error) {
        console.error("Error loading trips:", error);
    }
}


// Toggles the visibility of the print button
function togglePrintButton() {
    let printButton = document.getElementById("printTrip");
    let trips = JSON.parse(localStorage.getItem("trips")) || [];

    if (trips.length > 0) {
        if (!printButton) {
            printButton = document.createElement("button");
            printButton.id = "printTrip";
            printButton.textContent = "Print Trip";
            printButton.addEventListener("click", printTrip);
            document.body.appendChild(printButton);
            console.log("Print button added");
        }
    } else {
        if (printButton) {
            printButton.remove();
        }
    }
}

function printTrip() {
    const doc = new jsPDF();
    let trips = JSON.parse(localStorage.getItem("trips")) || [];

    console.log(trips); // Debugging: Check the trips data

    // Remove duplicate trips based on destinationCity
    const uniqueTrips = [...new Map(trips.map(item => [item.destinationCity, item])).values()];

    let yOffset = 15; // Starting Y position for the first page
    const pageHeight = doc.internal.pageSize.height; // Get the page height

    uniqueTrips.forEach((trip, index) => {
        console.log(trip); // Debugging: Check each trip object

        // Function to check if there's enough space, if not, add a new page
        const checkPageBreak = (extraSpace = 10) => {
            if (yOffset + extraSpace > pageHeight - 10) {  // Ensure space at the bottom
                doc.addPage();
                yOffset = 15; // Reset Y position after page break
            }
        };

        // **Spacing Before Each Trip**
        if (index > 0) yOffset += 10; // Add extra space between trips

        // **Trip Title with Background**
        doc.setFillColor(220, 220, 220); // Light gray background
        doc.rect(10, yOffset - 5, 190, 10, 'F'); // Draw filled rectangle
        doc.setFontSize(14).setFont("helvetica", "bold");
        doc.text(`Trip ${index + 1}: ${trip.destinationCity || 'N/A'}`, 15, yOffset);
        yOffset += 10;
        checkPageBreak();

        // **Trip Details**
        doc.setFontSize(12).setFont("helvetica", "normal");
        doc.text(`Departure: ${trip.departingDate || 'N/A'}`, 10, yOffset);
        yOffset += 8;
        doc.text(`Arrival: ${trip.arrivingDate || 'N/A'}`, 10, yOffset);
        yOffset += 8;
        doc.text(`Weather: ${trip.temperature || 'N/A'}°C, ${trip.weather_condition || 'N/A'}`, 10, yOffset);
        yOffset += 8;
        doc.text(`Country: ${trip.name || 'N/A'}`, 10, yOffset);
        yOffset += 12;
        checkPageBreak();

        // **Thicker Separator Line Between Trips**
        doc.setDrawColor(50, 50, 50); // Dark gray line
        doc.setLineWidth(1); // Thicker line
        doc.line(10, yOffset, 200, yOffset); // Draw a line across the page
        yOffset += 8;
        checkPageBreak();

        // **Hotels Section**
        if (trip.hotel && Array.isArray(trip.hotel) && trip.hotel.length > 0) {
            doc.setFontSize(14).setFont("helvetica", "bold");
            doc.text('Hotels:', 10, yOffset);
            yOffset += 10;
            checkPageBreak();

            trip.hotel.forEach((hotel, hotelIndex) => {
                doc.setFontSize(12).setFont("helvetica", "normal");
                doc.text(`• ${hotel.name || 'N/A'}`, 15, yOffset);
                yOffset += 8;
                checkPageBreak();
                doc.text(`   ID: ${hotel.hotelId || 'N/A'}`, 20, yOffset);
                yOffset += 6;
                checkPageBreak();
                doc.text(`   Chain Code: ${hotel.chainCode || 'N/A'}`, 20, yOffset);
                yOffset += 6;
                checkPageBreak();
                doc.text(`   Distance: ${hotel.distance ? hotel.distance.value : 'N/A'} ${hotel.distance ? hotel.distance.unit : ''}`, 20, yOffset);
                yOffset += 10;
                checkPageBreak();
            });
        } else {
            doc.setFontSize(12).setFont("helvetica", "italic");
            doc.text('No hotels available', 10, yOffset);
            yOffset += 10;
            checkPageBreak();
        }

        // **Spacing Before Next Trip**
        yOffset += 10;
    });

    // Save the PDF
    doc.save('Trip_Information.pdf');
}


// Function to print the trip list
function showHotelCards(hotels) {
    const hotelSection = document.getElementById("hotel-cards-section");
    const hotelGrid = document.getElementById("hotel-grid");

    if (!hotelSection || !hotelGrid) return;

    hotelGrid.innerHTML = "";

    if (!Array.isArray(hotels) || hotels.length === 0) {
        hotelSection.style.display = "none";
        alert("No hotel information available.");
        return;
    }

    hotels.forEach(hotel => {
        const card = document.createElement("div");
        card.classList.add("hotel-card");

        card.innerHTML = `
            <p><strong>Name:</strong> ${hotel.name || 'N/A'}</p>
            <p><strong>Hotel ID:</strong> ${hotel.hotelId || 'N/A'}</p>
            <p><strong>Chain Code:</strong> ${hotel.chainCode || 'N/A'}</p>
            <p><strong>Distance:</strong> ${hotel.distance ? hotel.distance.value : 'N/A'} ${hotel.distance ? hotel.distance.unit : ''}</p>
            <p><strong>Country Code:</strong> ${hotel.countryCode || 'N/A'}</p>

            <button class="open-booking-modal" data-hotel="${hotel.name}">Book Now</button>
            <button class="info-hotel-btn" data-hotel="${hotel.name}">More Info</button>
        `;

        hotelGrid.appendChild(card);
    });

    hotelSection.style.display = "block";
    hotelSection.scrollIntoView({ behavior: "smooth" });

    // Attach event listeners to buttons
    document.querySelectorAll(".open-booking-modal").forEach(button => {
        button.addEventListener("click", function () {
            const hotelName = this.getAttribute("data-hotel");
            openBookingForm(hotelName);
        });
    });

    document.querySelectorAll(".info-hotel-btn").forEach(button => {
        button.addEventListener("click", function () {
            alert(`Showing more details for ${this.getAttribute("data-hotel")}`);
        });
    });
}

// Book Hotel function
function openBookingForm(hotelName) {
    const modal = document.getElementById("booking-form-container");
    const hotelNameInput = document.getElementById("hotelName");

    hotelNameInput.value = hotelName;
    modal.style.display = "block";

    // Close modal when clicking the close button
    document.querySelector(".close-modal").addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal when clicking outside the content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

// Handle form submission
document.getElementById("booking-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const bookingData = {
        hotel: document.getElementById("hotelName").value,
        guestName: document.getElementById("guestName").value,
        checkInDate: document.getElementById("checkInDate").value,
        checkOutDate: document.getElementById("checkOutDate").value,
        numGuests: document.getElementById("numGuests").value,
    };

    console.log("Booking Confirmed:", bookingData);
    alert("Booking confirmed for " + bookingData.hotel);

    // Close the modal after booking
    document.getElementById("booking-form-container").style.display = "none";
});


function updateUI(tripData) {
    const tripList = document.getElementById("trip_list");

    if (document.getElementById(`trip-${tripData.destinationCity}`)) {
        return;
    }

    const tripDiv = document.createElement("div");
    tripDiv.classList.add("trip");
    tripDiv.id = `trip-${tripData.destinationCity}`;

    if (tripData.countdown < 0) {
        tripDiv.classList.add("expired-trip");
    }

    const cityImage = tripData.cityImage;
    const hotelsLinkHTML = `<a href="#" class="show-hotels-link">Show Hotels</a>`;

    tripDiv.innerHTML = `
        <div class="trip-item">
            <h3>${tripData.destinationCity}</h3>
            <img src="${cityImage}" alt="Destination Image" onerror="this.onerror=null;">
            <button class="toggle-details-btn">Show Details</button>
            
            <div class="trip-info" style="display: none;">
                <p><strong>Departure:</strong> ${tripData.departingDate}</p>
                <p><strong>Arrival:</strong> ${tripData.arrivingDate}</p>
                <p><strong>Trip Length:</strong> ${tripData.tripLength} days</p>
                <p><strong>Days to go:</strong> ${tripData.countdown}</p>
                <p><strong>Weather:</strong> ${tripData.temperature}°C, ${tripData.weather_condition}</p>
                <p><strong>Country:</strong> ${tripData.name}</p>
                <p><strong>Currency:</strong> ${tripData.currency}</p>
                <p><strong>Language:</strong> ${tripData.language}</p>
                <div class="hotels-section">
                    <h4>Hotels Information: ${hotelsLinkHTML}</h4>
                </div>
            </div>

            <button class="remove-trip-btn">Remove</button>
        </div>
    `;

    tripList.appendChild(tripDiv);

    // Toggle trip details visibility
    const toggleBtn = tripDiv.querySelector(".toggle-details-btn");
    const tripInfo = tripDiv.querySelector(".trip-info");

    toggleBtn.addEventListener("click", function () {
        if (tripInfo.style.display === "none") {
            tripInfo.style.display = "block";
            toggleBtn.textContent = "Hide Details";
        } else {
            tripInfo.style.display = "none";
            toggleBtn.textContent = "Show Details";
        }
    });

    // Attach event listener to the "Show Hotels" link.
    const showHotelsLink = tripDiv.querySelector(".show-hotels-link");
    showHotelsLink.addEventListener("click", function (e) {
        e.preventDefault();
        showHotelCards(tripData.hotel);
    });

    adjustTripLayout();
}

// Function to adjust the trip list styling
function adjustTripLayout() {
    const tripList = document.getElementById("trip_list");
    const trips = tripList.querySelectorAll(".trip");

    if (trips.length === 1) {
        tripList.classList.add("single-trip");
    } else {
        tripList.classList.remove("single-trip");
    }
}

//usable arrow button
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("trip_list").addEventListener("click", handleRemoveClick);

    // for print pdf of trip by print trip button
    const printButton = document.getElementById("printTrip");
    if (printButton) {
        printButton.addEventListener("click", printTrip);
    }

    //for show hotel card
    const hotelSection = document.getElementById("hotel-cards-section");
    hotelSection.style.display = "none";

    // for sidebar button
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const sidebar = document.getElementById("sidebar");

    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });

    document.getElementById("sidebar-toggle").addEventListener("click", function () {
        document.getElementById("sidebar").classList.add("open");
    });

    document.getElementById("close-sidebar").addEventListener("click", function () {
        document.getElementById("sidebar").classList.remove("open");
    });

    // for arrow back to top button
    const backToTopButton = document.getElementById("back-to-top");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            backToTopButton.style.display = "flex";
        } else {
            backToTopButton.style.display = "none";
        }
    });

    backToTopButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });


    // for Book Hotel button
    const modal = document.getElementById("booking-form-container");
    const closeModalBtn = document.querySelector(".close-modal");

    // Show modal when clicking the button
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("open-booking-modal")) {
            const hotelName = event.target.getAttribute("data-hotel");
            openBookingForm(hotelName);
        }
    });


    // Hide modal when clicking close button
    closeModalBtn.addEventListener("click", function () {
        modal.classList.remove("active");
    });

    // Hide modal when clicking outside modal content
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.classList.remove("active");
        }
    });
});

export {
    handleRemoveClick,
    loadTripsFromStorage,
    updateUI,
    printTrip
}