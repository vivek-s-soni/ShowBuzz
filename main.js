const moodMap = {
  fun: ["F1"],
  action: ["WAR-2", "Border 2"],
  emotional: ["Dhurandhar", "Arijit Singh"],
  comedy: ["Anubhav Singh Bassi", "Zakir Khan"]
};

function filterByMood(mood) {
  alert("Recommended for you: \n" + moodMap[mood].join(", "));
}
function autoSeat(type) {
  selectedSeats = [];
  document.querySelectorAll('.seat').forEach(s => s.classList.remove('selected'));

  let seats = {
    best: ["C7", "C8"],
    couple: ["A5", "A6"],
    cheap: ["H1", "H2"]
  };

  seats[type].forEach(seatNo => {
    let seatDiv = [...document.querySelectorAll('.seat')]
      .find(s => s.innerText === seatNo);
    if (seatDiv) {
      seatDiv.classList.add("selected");
      selectedSeats.push(seatNo);
    }
  });
}
