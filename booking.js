let selectedMovie = "";
let selectedTime = "";
let selectedSeats = [];
let ticketPrice = 0;
let selectedTheatre = "";
let selectedDate = "";
let eventType = "movie"; // "movie", "laughter", or "liveEvent"
let quantity = 0;



// 🎭 Theatre-wise timing & price data
const theatreShows = {
    "AB Miniplex": [
        { time: "10:00 AM", price: 140 },
        { time: "1:00 PM", price: 170 },
        { time: "7:00 PM", price: 210 }
    ],
    "PVR": [
        { time: "9:30 AM", price: 180 },
        { time: "2:30 PM", price: 220 },
        { time: "9:00 PM", price: 280 }
    ],
    "City Gold": [
        { time: "11:00 AM", price: 160 },
        { time: "4:00 PM", price: 200 },
        { time: "8:30 PM", price: 240 }
    ],
    "Complex": [
        { time: "10:30 AM", price: 130 },
        { time: "3:30 PM", price: 160 },
        { time: "6:30 PM", price: 190 }
    ]
};

// 🎪 Event pricing data for Laughter Therapy and Live Events
const eventTimings = {
    timings: [
        { time: "2:00 PM", price: 500 },
        { time: "5:00 PM", price: 600 },
        { time: "8:00 PM", price: 750 }
    ]
};

function openBooking(eventName, type = "movie") {

    selectedMovie = eventName;
    eventType = type;
    selectedSeats = [];
    quantity = 0;

    if (type === "movie") {
        openMovieBooking(eventName);
    } else {
        openEventBooking(eventName, type);
    }
}

function openMovieBooking(movieName) {
    selectedMovie = movieName;
    selectedSeats = [];

    // 🎭 Theatre selection
    let theatre = prompt(
        "Select Theatre:\n" +
        "1. AB Miniplex\n" +
        "2. PVR\n" +
        "3. City Gold\n" +
        "4. Complex"
    );

    if (!theatre) return;

    if (theatre == 1) selectedTheatre = "AB Miniplex";
    else if (theatre == 2) selectedTheatre = "PVR";
    else if (theatre == 3) selectedTheatre = "City Gold";
    else if (theatre == 4) selectedTheatre = "Complex";
    else {
        alert("Invalid theatre selection");
        return;
    }

    // 🕒 Build timing prompt dynamically
    let shows = theatreShows[selectedTheatre];
    let timingMsg = "Select timing:\n";

    shows.forEach((show, index) => {
        timingMsg += (index + 1) + ". " + show.time + " (₹" + show.price + ")\n";
    });

    let timing = prompt(timingMsg);
    if (!timing) return;

    let selectedShow = shows[timing - 1];
    if (!selectedShow) {
        alert("Invalid timing selection");
        return;
    }

    selectedTime = selectedShow.time;
    ticketPrice = selectedShow.price;

    document.getElementById("seatSection").style.display = "block";
    document.getElementById("seatMovie").innerText =
        "Movie: " + selectedMovie + " | Theatre: " + selectedTheatre;
    document.getElementById("seatTime").innerText =
        "Time: " + selectedTime + " | Price: ₹" + ticketPrice + " per seat";

    generateSeats();
}

function openEventBooking(eventName, type) {
    selectedMovie = eventName;
    eventType = type;

    // Close any open modals first (event details modal)
    let openModals = document.querySelectorAll('.modal.show');
    openModals.forEach(function(modal) {
        let bootstrapModal = bootstrap.Modal.getInstance(modal);
        if (bootstrapModal) {
            bootstrapModal.hide();
        }
    });

    // Set the modal title based on event type
    let title = type === "laughter" ? "🎭 Laughter Therapy" : "🎪 Live Event";
    document.getElementById("eventModalTitle").innerText = title + " - " + eventName;

    // Set minimum date to today
    let today = new Date();
    let minDate = today.toISOString().split('T')[0];
    document.getElementById("eventDate").min = minDate;
    document.getElementById("eventDate").value = "";

    // Reset modal to Step 1
    document.getElementById("dateSelectionStep").style.display = "block";
    document.getElementById("timingSelectionStep").style.display = "none";
    document.getElementById("quantitySelectionStep").style.display = "none";

    // Show the booking modal after a small delay to ensure previous modal is closed
    setTimeout(function() {
        let modal = new bootstrap.Modal(document.getElementById("eventBookingModal"));
        modal.show();
    }, 300);
}

function proceedToEventTiming() {
    let date = document.getElementById("eventDate").value;
    
    if (!date) {
        alert("Please select a date");
        return;
    }

    selectedDate = date;
    
    // Display selected date in alert
    let dateObj = new Date(date);
    let formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    alert("✅ Date Selected: " + formattedDate);

    // Move to timing selection step
    document.getElementById("dateSelectionStep").style.display = "none";
    document.getElementById("timingSelectionStep").style.display = "block";
    document.getElementById("quantitySelectionStep").style.display = "none";
    document.getElementById("eventTiming").value = "";
}

function goBackToDateSelection() {
    document.getElementById("dateSelectionStep").style.display = "block";
    document.getElementById("timingSelectionStep").style.display = "none";
    document.getElementById("quantitySelectionStep").style.display = "none";
}

function proceedToQuantitySelection() {
    let timingIndex = document.getElementById("eventTiming").value;
    
    if (timingIndex === "") {
        alert("Please select a timing");
        return;
    }

    let selectedTiming = eventTimings.timings[parseInt(timingIndex)];
    selectedTime = selectedTiming.time;
    ticketPrice = selectedTiming.price;
    
    // Display selected timing in alert
    alert("✅ Timing Selected: " + selectedTiming.time + " - ₹" + selectedTiming.price);

    // Move to quantity selection step
    document.getElementById("dateSelectionStep").style.display = "none";
    document.getElementById("timingSelectionStep").style.display = "none";
    document.getElementById("quantitySelectionStep").style.display = "block";
    document.getElementById("eventQuantity").value = "";
}

function goBackToTimingSelection() {
    document.getElementById("dateSelectionStep").style.display = "none";
    document.getElementById("timingSelectionStep").style.display = "block";
    document.getElementById("quantitySelectionStep").style.display = "none";
}

function completeEventBooking() {
    let qty = document.getElementById("eventQuantity").value;
    
    if (!qty) {
        alert("Please select number of tickets");
        return;
    }

    quantity = parseInt(qty);

    // Close the modal and proceed to payment
    let modalEl = document.getElementById("eventBookingModal");
    let modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    // Proceed directly to payment (no seat selection)
    proceedToPayment();
}


function generateSeats() {

    const layout = document.getElementById("seatLayout");
    layout.innerHTML = "";

    const seatConfig = [
        { label: "RECLINER", rows: ["A"], class: "recliner" },
        { gap: true },
        { label: "GOLD", rows: ["B", "C", "D"], class: "gold" },
        { gap: true },
        { label: "SILVER", rows: ["E", "F", "G", "H"], class: "silver" }
    ];

    const cols = 14;

    seatConfig.forEach(section => {

        // Section label
        if (section.label) {
            const label = document.createElement("div");
            label.className = "seat-label";
            label.innerText = section.label;
            layout.appendChild(label);
        }

        // Gap between sections
        if (section.gap) {
            const gap = document.createElement("div");
            gap.className = "seat-gap";
            layout.appendChild(gap);
            return;
        }

        // Seats
        section.rows.forEach(row => {
            for (let i = 1; i <= cols; i++) {

                const seat = document.createElement("div");
                seat.className = `seat ${section.class}`;
                seat.innerText = row + i;

                seat.onclick = function () {
                    toggleSeat(seat.innerText, seat);
                };

                layout.appendChild(seat);
            }
        });
    });
}


function toggleSeat(seatNo, seatDiv) {

    if (seatDiv.classList.contains("selected")) {
        seatDiv.classList.remove("selected");
        selectedSeats = selectedSeats.filter(s => s !== seatNo);
    } else {
        seatDiv.classList.add("selected");
        selectedSeats.push(seatNo);
    }
}

function proceedToPayment() {
    let totalAmount = quantity * ticketPrice;

    let payment = prompt(
        "Select Payment Method:\n" +
        "1. UPI\n" +
        "2. Debit Card\n" +
        "3. Credit Card\n" +
        "4. Net Banking"
    );

    if (!payment) return;

    processPayment(totalAmount, payment);
}

function processPayment(totalAmount, paymentOption) {
    let paymentMethod = "";
    let paymentDetails = "";

    if (paymentOption == 1) {
        paymentMethod = "UPI";
        let upiId = prompt("Enter UPI ID (example@upi):");
        if (!upiId || upiId.indexOf("@") === -1) {
            alert("Invalid UPI ID");
            return;
        }
        paymentDetails = "UPI ID: " + upiId;
    }
    else if (paymentOption == 2) {
        paymentMethod = "Debit Card";
        let cardNo = prompt("Enter Debit Card Number (10 digits):");
        if (cardNo.length !== 10 || isNaN(cardNo)) {
            alert("Card number must be exactly 10 digits");
            return;
        }
        let pin = prompt("Enter Debit Card PIN (4 digits):");
        if (pin.length !== 4 || isNaN(pin)) {
            alert("PIN must be exactly 4 digits");
            return;
        }
        paymentDetails = "Debit Card Ending: " + cardNo.slice(-4);
    }
    else if (paymentOption == 3) {
        paymentMethod = "Credit Card";
        let cardNo = prompt("Enter Credit Card Number (10 digits):");
        if (cardNo.length !== 10 || isNaN(cardNo)) {
            alert("Card number must be exactly 10 digits");
            return;
        }
        let expiry = prompt("Enter Expiry Date (MM/YY):");
        if (!expiry || expiry.length !== 5 || expiry[2] !== "/") {
            alert("Expiry must be in MM/YY format");
            return;
        }
        let cvv = prompt("Enter CVV (3 digits):");
        if (cvv.length !== 3 || isNaN(cvv)) {
            alert("CVV must be exactly 3 digits");
            return;
        }
        paymentDetails = "Credit Card Ending: " + cardNo.slice(-4);
    }
    else if (paymentOption == 4) {
        paymentMethod = "Net Banking";
        let bank = prompt("Enter Bank Name:");
        let userId = prompt("Enter Net Banking User ID:");
        if (!bank || !userId) {
            alert("Net banking details required");
            return;
        }
        paymentDetails = "Bank: " + bank;
    }
    else {
        alert("Invalid payment option");
        return;
    }

    // Generate booking summary based on event type
    generateBookingSummary(totalAmount, paymentMethod);
}

function generateBookingSummary(totalAmount, paymentMethod) {
    let summaryHTML = "";

    if (eventType === "movie") {
        // Movie booking summary with seats
        summaryHTML = `
            <p><b>🎬 Movie:</b> ${selectedMovie}</p>
            <p><b>🏢 Theatre:</b> ${selectedTheatre}</p>
            <p><b>⏰ Time:</b> ${selectedTime}</p>
            <p><b>💺 Seats:</b> ${selectedSeats.join(", ")}</p>
            <p><b>🎟 Tickets:</b> ${selectedSeats.length}</p>
            <p><b>💰 Price per seat:</b> ₹${ticketPrice}</p>
            <p><b>💵 Total Amount:</b> ₹${totalAmount}</p>
            <p><b>💳 Payment Method:</b> ${paymentMethod}</p>
            <hr>
            <p class="text-success fw-bold text-center">✅ Payment Successful!</p>
        `;

        // QR Code for movie
        document.getElementById("qrCode").innerHTML = "";
        new QRCode(document.getElementById("qrCode"), {
            text: JSON.stringify({
                movie: selectedMovie,
                theatre: selectedTheatre,
                time: selectedTime,
                seats: selectedSeats,
                amount: totalAmount
            }),
            width: 140,
            height: 140
        });
    } else {
        // Laughter Therapy or Live Event booking summary (no seats)
        let eventTypeLabel = eventType === "laughter" ? "🎭 Stand-up Comedy" : "🎪 Live Event";
        summaryHTML = `
            <p><b>${eventTypeLabel}:</b> ${selectedMovie}</p>
            <p><b>📅 Date:</b> ${selectedDate}</p>
            <p><b>⏰ Time:</b> ${selectedTime}</p>
            <p><b>🎟 Tickets:</b> ${quantity}</p>
            <p><b>💰 Price per ticket:</b> ₹${ticketPrice}</p>
            <p><b>💵 Total Amount:</b> ₹${totalAmount}</p>
            <p><b>💳 Payment Method:</b> ${paymentMethod}</p>
            <hr>
            <p class="text-success fw-bold text-center">✅ Payment Successful!</p>
            <div class="text-center mt-3">
                <button class="btn btn-primary" onclick="downloadEventTicketPDF()">
                    <i class="fa-solid fa-download"></i> Download Ticket PDF
                </button>
            </div>
        `;

        // QR Code for event
        document.getElementById("qrCode").innerHTML = "";
        new QRCode(document.getElementById("qrCode"), {
            text: JSON.stringify({
                event: selectedMovie,
                date: selectedDate,
                time: selectedTime,
                tickets: quantity,
                amount: totalAmount
            }),
            width: 140,
            height: 140
        });
    }

    document.getElementById("bookingSummaryContent").innerHTML = summaryHTML;

    /* ✅ SHOW MODAL */
    let modal = new bootstrap.Modal(
        document.getElementById("bookingSummaryModal")
    );
    modal.show();

    // ✅ REMOVE / HIDE SEAT SELECTION AREA AFTER SUCCESS
    document.getElementById("seatSection").style.display = "none";

    // OPTIONAL: Clear seat layout
    document.getElementById("seatLayout").innerHTML = "";

    // Reset variables
    resetBookingVariables();
}

function resetBookingVariables() {
    selectedSeats = [];
    selectedMovie = "";
    selectedTime = "";
    selectedTheatre = "";
    selectedDate = "";
    ticketPrice = 0;
    quantity = 0;
    eventType = "movie";
    document.getElementById("seatLayout").innerHTML = "";
}

function confirmBooking() {

    if (selectedSeats.length === 0) {
        alert("Please select at least one seat");
        return;
    }

    let totalAmount = selectedSeats.length * ticketPrice;

    let payment = prompt(
        "Select Payment Method:\n" +
        "1. UPI\n" +
        "2. Debit Card\n" +
        "3. Credit Card\n" +
        "4. Net Banking"
    );

    if (!payment) return;

    processPayment(totalAmount, parseInt(payment));
}


function downloadEventTicketPDF() {
    try {
        // Access jsPDF correctly
        const jsPDFLib = window.jspdf.jsPDF;
        const doc = new jsPDFLib();
        
        // Set document properties
        let eventTypeLabel = eventType === "laughter" ? "Stand-up Comedy" : "Live Event";
        
        // Title
        doc.setFillColor(0, 150, 0);
        doc.rect(10, 10, 190, 20, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.text("ShowBuzz - Event Ticket", 105, 25, { align: "center" });
        
        // Reset text color
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont("helvetica", "regular");
        
        let yPos = 40;
        const spacing = 6;
        
        // Section header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("BOOKING DETAILS", 15, yPos);
        yPos += spacing + 2;
        
        // Details
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        
        doc.text(`Event Type:     ${eventTypeLabel}`, 15, yPos);
        yPos += spacing;
        
        doc.text(`Event Name:     ${selectedMovie}`, 15, yPos);
        yPos += spacing;
        
        doc.text(`Date:               ${selectedDate}`, 15, yPos);
        yPos += spacing;
        
        doc.text(`Time:               ${selectedTime}`, 15, yPos);
        yPos += spacing;
        
        doc.text(`Tickets:           ${quantity}`, 15, yPos);
        yPos += spacing;
        
        doc.text(`Price/Ticket:    ₹${ticketPrice}`, 15, yPos);
        yPos += spacing + 3;
        
        // Total amount in bold
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        let totalAmount = quantity * ticketPrice;
        doc.text(`TOTAL AMOUNT:      ₹${totalAmount}`, 15, yPos);
        yPos += spacing + 5;
        
        // Divider line
        doc.setDrawColor(0, 150, 0);
        doc.line(15, yPos, 195, yPos);
        yPos += 8;
        
        // QR Code section
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("SCAN QR CODE AT VENUE", 15, yPos);
        yPos += 10;
        
        // Get QR code canvas and add to PDF
        let qrCanvas = document.querySelector("#qrCode canvas");
        if (qrCanvas) {
            try {
                let qrImage = qrCanvas.toDataURL("image/png");
                doc.addImage(qrImage, "PNG", 70, yPos, 60, 60);
                yPos += 65;
            } catch (err) {
                console.log("Could not add QR code to PDF");
            }
        }
        
        // Footer
        yPos += 5;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        
        doc.text("This is your digital event ticket. Please present the QR code at the venue entrance.", 105, yPos, { align: "center", maxWidth: 180 });
        doc.text("For support: www.showbuzz.com | Contact: +91-XXXX-XXXX", 105, yPos + 5, { align: "center", maxWidth: 180 });
        
        // Download the PDF
        let filename = selectedMovie.replace(/\s+/g, '_');
        doc.save(`ShowBuzz_${filename}_Ticket.pdf`);
        
        alert("✅ PDF downloaded successfully!");
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("❌ Error downloading PDF. Please try again.");
    }
}