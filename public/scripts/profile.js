function toggleProfileBox() {
  var profileBox = document.getElementById("profile_box");

  // profileBox.style.display = profileBox.style.display === "none" ? "block" : "none";
  profileBox.style.top = profileBox.style.top === "-25%" ? "50%" : "-25%";
  profileBox.style.left = profileBox.style.left === "-20%" ? "50%" : "-20%";
  profileBox.style.width = profileBox.style.width === "20%" ? "50%" : "20%";
  profileBox.style.rotate =
    profileBox.style.rotate === "0deg" ? "45deg" : "0deg";
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  const clockElement = document.getElementById("digital-clock");
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initial update
updateClock();
