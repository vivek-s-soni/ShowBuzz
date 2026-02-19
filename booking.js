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

    // Populate theatre list in modal
    populateTheatreList();
    
    // Reset modal to Step 1 (theatre selection)
    document.getElementById("theatreSelectionStep").style.display = "block";
    document.getElementById("timingSelectionStep").style.display = "none";
    
    // Show the modal
    let modal = new bootstrap.Modal(document.getElementById("theatreTimingModal"));
    modal.show();
}

function populateTheatreList() {
    let theatreListContainer = document.getElementById("theatreListContainer");
    theatreListContainer.innerHTML = "";
    
    let theatreNames = Object.keys(theatreShows);
    
    theatreNames.forEach(theatre => {
        let theatreBtn = document.createElement("div");
        theatreBtn.className = "col-md-6 col-12";
        theatreBtn.innerHTML = `
            <button class="btn btn-outline-primary w-100" onclick="selectTheatre('${theatre}')">
                <strong>${theatre}</strong>
            </button>
        `;
        theatreListContainer.appendChild(theatreBtn);
    });
}

function selectTheatre(theatre) {
    selectedTheatre = theatre;
    
    // Populate timing list for selected theatre
    populateTimingList(theatre);
    
    // Move to Step 2 (timing selection)
    document.getElementById("theatreSelectionStep").style.display = "none";
    document.getElementById("timingSelectionStep").style.display = "block";
    document.getElementById("selectedTheatreName").innerText = theatre;
}

function populateTimingList(theatre) {
    let timingListContainer = document.getElementById("timingListContainer");
    timingListContainer.innerHTML = "";
    
    let shows = theatreShows[theatre];
    
    shows.forEach((show, index) => {
        let timingBtn = document.createElement("div");
        timingBtn.className = "col-md-6 col-12";
        timingBtn.innerHTML = `
            <button class="btn btn-outline-success w-100" onclick="selectTiming(${index}, '${theatre}')">
                <strong>${show.time}</strong><br>
                <small>₹${show.price}</small>
            </button>
        `;
        timingListContainer.appendChild(timingBtn);
    });
}

function selectTiming(timingIndex, theatre) {
    let shows = theatreShows[theatre];
    let selectedShow = shows[timingIndex];
    
    selectedTime = selectedShow.time;
    ticketPrice = selectedShow.price;
    
    // Close theatre/timing modal
    let modalEl = document.getElementById("theatreTimingModal");
    let modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    
    // Show seat selection modal
    setTimeout(function() {
        showSeatSelectionModal();
    }, 300);
}

function showSeatSelectionModal() {
    // Update modal title with movie info
    document.getElementById("seatModalTitle").innerText = "💺 Select Seats - " + selectedMovie;
    document.getElementById("seatMovieInfo").innerText = 
        "Movie: " + selectedMovie + " | Theatre: " + selectedTheatre;
    document.getElementById("seatTimeInfo").innerText = 
        "Time: " + selectedTime + " | Price: ₹" + ticketPrice + " per seat";
    
    // Generate seats
    generateSeats();
    
    // Show seat selection modal
    let seatModal = new bootstrap.Modal(document.getElementById("seatSelectionModal"));
    seatModal.show();
}

function closeSeatModal() {
    let modalEl = document.getElementById("seatSelectionModal");
    let modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
}

function goBackToTheatreSelection() {
    document.getElementById("theatreSelectionStep").style.display = "block";
    document.getElementById("timingSelectionStep").style.display = "none";
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

    // Use fixed date/time and price for events (matches modal content)
    selectedDate = '2026-03-01';
    selectedTime = '7:00 PM';
    ticketPrice = 500;

    // Ensure quantity selector is cleared
    const qtyEl = document.getElementById("eventQuantity");
    if (qtyEl) qtyEl.value = "";

    // Show the booking modal after a small delay to ensure previous modal is closed
    setTimeout(function() {
        let modal = new bootstrap.Modal(document.getElementById("eventBookingModal"));
        modal.show();
    }, 300);
}

// Removed step-based event selection functions; events use fixed date/time and quantity only.

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
    
    // Update selected seats display in modal
    let seatsDisplay = selectedSeats.length > 0 ? selectedSeats.join(", ") : "None";
    document.getElementById("selectedSeatsDisplay").innerText = seatsDisplay;
}

function proceedToPayment() {
    let totalAmount = quantity > 0 ? quantity * ticketPrice : selectedSeats.length * ticketPrice;
    
    // Store total amount for payment modal
    window.paymentTotalAmount = totalAmount;
    document.getElementById("paymentTotalAmount").innerText = totalAmount;
    
    // Reset payment modal to step 1
    resetPaymentModal();
    
    // Show payment modal
    let modal = new bootstrap.Modal(document.getElementById("paymentModal"));
    modal.show();
}

function resetPaymentModal() {
    document.getElementById("paymentMethodStep").style.display = "block";
    document.getElementById("upiDetailsStep").style.display = "none";
    document.getElementById("cardDetailsStep").style.display = "none";
    document.getElementById("netbankingDetailsStep").style.display = "none";
    document.getElementById("otpVerificationStep").style.display = "none";
    
    // Clear all input fields
    document.getElementById("upiId").value = "";
    document.getElementById("cardNumber").value = "";
    document.getElementById("cardExpiry").value = "";
    document.getElementById("cardCVV").value = "";
    document.getElementById("cardPin").value = "";
    document.getElementById("bankName").value = "";
    document.getElementById("bankUserId").value = "";
    document.getElementById("otpCode").value = "";
    
    // Reset payment method tracking
    window.selectedPaymentMethod = null;
}

function selectPaymentMethod(method) {
    window.selectedPaymentMethod = method;
    document.getElementById("paymentMethodStep").style.display = "none";
    
    if (method === "upi") {
        document.getElementById("upiDetailsStep").style.display = "block";
        document.getElementById("upiId").focus();
    } else if (method === "debit" || method === "credit") {
        document.getElementById("cardDetailsStep").style.display = "block";
        document.getElementById("cardNumber").focus();
        window.cardType = method === "debit" ? "Debit Card" : "Credit Card";
    } else if (method === "netbanking") {
        document.getElementById("netbankingDetailsStep").style.display = "block";
        document.getElementById("bankName").focus();
    }
}

function goBackToPaymentMethod() {
    resetPaymentModal();
}

function goBackToCardDetails() {
    document.getElementById("otpVerificationStep").style.display = "none";
    document.getElementById("cardDetailsStep").style.display = "block";
}

function validateUpiId(upiId) {
    // Valid UPI format: username@bankname (e.g., user@okhdfcbank)
    const upiRegex = /^[a-zA-Z0-9.-]{3,}@[a-zA-Z]{3,}$/;
    return upiRegex.test(upiId);
}

function validateCardNumber(cardNo) {
    // Check if exactly 10 digits
    return cardNo.length === 10 && /^\d{10}$/.test(cardNo);
}

function validateExpiry(expiry) {
    // MM/YY format
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [month, year] = expiry.split('/');
    const monthNum = parseInt(month);
    return monthNum >= 1 && monthNum <= 12;
}

function validateCVV(cvv) {
    // Exactly 3 digits
    return cvv.length === 3 && /^\d{3}$/.test(cvv);
}

function validateCardPin(pin) {
    // Exactly 4 digits
    return pin.length === 4 && /^\d{4}$/.test(pin);
}

function submitUpiPayment() {
    let upiId = document.getElementById("upiId").value.trim();
    
    if (!upiId) {
        alert("❌ Please enter UPI ID");
        return;
    }
    
    if (!validateUpiId(upiId)) {
        alert("❌ Invalid UPI ID format. Use format: username@bankname (e.g., user@okhdfcbank)");
        return;
    }
    
    // Store payment details and complete
    window.paymentMethod = "UPI";
    window.paymentDetails = "UPI ID: " + upiId;
    
    // Close modal and generate booking summary
    let modalEl = document.getElementById("paymentModal");
    let modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    
    generateBookingSummary(window.paymentTotalAmount, "UPI");
}

function submitCardPayment() {
    let cardNo = document.getElementById("cardNumber").value.trim();
    let expiry = document.getElementById("cardExpiry").value.trim();
    let cvv = document.getElementById("cardCVV").value.trim();
    let pin = document.getElementById("cardPin").value.trim();
    
    // Validation
    if (!cardNo) {
        alert("❌ Please enter card number");
        return;
    }
    if (!validateCardNumber(cardNo)) {
        alert("❌ Card number must be exactly 10 digits");
        return;
    }
    
    if (!expiry) {
        alert("❌ Please enter expiry date");
        return;
    }
    if (!validateExpiry(expiry)) {
        alert("❌ Expiry must be in MM/YY format (01-12 for month)");
        return;
    }
    
    if (!cvv) {
        alert("❌ Please enter CVV");
        return;
    }
    if (!validateCVV(cvv)) {
        alert("❌ CVV must be exactly 3 digits");
        return;
    }
    
    if (!pin) {
        alert("❌ Please enter card PIN");
        return;
    }
    if (!validateCardPin(pin)) {
        alert("❌ Card PIN must be exactly 4 digits");
        return;
    }
    
    // Store card details
    window.storedCardNo = cardNo;
    window.storedExpiry = expiry;
    window.storedCVV = cvv;
    window.storedPin = pin;
    
    // Generate random 6-digit OTP
    window.generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Move to OTP verification
    document.getElementById("cardDetailsStep").style.display = "none";
    document.getElementById("otpVerificationStep").style.display = "block";
    
    // Display masked email
    let maskedEmail = "tempvrajpatel0625@gmail.com";
    document.getElementById("maskedEmail").innerText = maskedEmail;
    
    // Clear OTP input field
    document.getElementById("otpCode").value = "";
    document.getElementById("otpCode").focus();
    
    // Show OTP sent message
    alert("✅ OTP has been sent to your registered email: " + maskedEmail + "\n\nDemo OTP (for testing): " + window.generatedOTP);
}

function submitNetBankingPayment() {
    let bankName = document.getElementById("bankName").value.trim();
    let bankUserId = document.getElementById("bankUserId").value.trim();
    
    if (!bankName) {
        alert("❌ Please enter bank name");
        return;
    }
    if (!bankUserId) {
        alert("❌ Please enter net banking user ID");
        return;
    }
    
    // Store payment details and complete
    window.paymentMethod = "Net Banking";
    window.paymentDetails = "Bank: " + bankName + " | User ID: " + bankUserId;
    
    // Show success and close modal
    alert("✅ Net Banking initiated. Please complete payment at your bank's portal.");
    
    let modalEl = document.getElementById("paymentModal");
    let modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    
    generateBookingSummary(window.paymentTotalAmount, "Net Banking");
}

function verifyOtp() {
    let otpCode = document.getElementById("otpCode").value.trim();
    
    if (!otpCode) {
        alert("❌ Please enter OTP");
        return;
    }
    
    if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
        alert("❌ OTP must be exactly 6 digits");
        return;
    }
    
    // Verify OTP against generated OTP
    if (otpCode === window.generatedOTP) {
        // Store payment details
        window.paymentMethod = window.cardType;
        window.paymentDetails = window.cardType + " Ending: " + window.storedCardNo.slice(-4);
        
        alert("✅ OTP verified! Payment successful.");
        
        // Close modal and generate booking summary
        let modalEl = document.getElementById("paymentModal");
        let modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
        
        generateBookingSummary(window.paymentTotalAmount, window.cardType);
    } else {
        alert("❌ Invalid OTP. Please try again. Entered: " + otpCode + " | Expected: " + window.generatedOTP);
    }
}

// Old processPayment function replaced with modal-based payment system

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

    /* Save booking to localStorage */
    saveBookingToLocalStorage(totalAmount, paymentMethod);

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

    // Store quantity for payment
    quantity = selectedSeats.length;
    
    // Close seat selection modal
    let seatModalEl = document.getElementById("seatSelectionModal");
    let seatModal = bootstrap.Modal.getInstance(seatModalEl);
    if (seatModal) {
        seatModal.hide();
    }
    
    // Proceed to payment modal (after a small delay to ensure modal is closed)
    setTimeout(function() {
        proceedToPayment();
    }, 300);
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

// Save booking to localStorage
function saveBookingToLocalStorage(totalAmount, paymentMethod) {
    try {
        const currentUser = localStorage.getItem('showbuzz_currentUser');
        if (!currentUser) return;

        let bookings = JSON.parse(localStorage.getItem('showbuzz_bookings') || '{}');
        if (!bookings[currentUser]) {
            bookings[currentUser] = [];
        }

        const bookingDetails = {
            movie: eventType === "movie" ? selectedMovie : null,
            event: eventType !== "movie" ? selectedMovie : null,
            type: eventType,
            theatre: selectedTheatre || "N/A",
            date: selectedDate || new Date().toLocaleDateString(),
            time: selectedTime,
            seats: selectedSeats || [],
            quantity: quantity,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod,
            bookingDate: new Date().toLocaleString()
        };

        bookings[currentUser].push(bookingDetails);
        localStorage.setItem('showbuzz_bookings', JSON.stringify(bookings));
    } catch (e) {
        console.error("Error saving booking:", e);
    }
}