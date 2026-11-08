// Creates a button representing a single seat and stores its information
function createSeat(section, row, number) {
    const seat = document.createElement("button");
    seat.type = "button";
    seat.className = "seat";
    seat.textContent = number;

    // Stores the seats unique ID and details in data attributes
    // so they can be accessed later when hanfling seat selection
    seat.dataset.id = `${section.id}-${row}-${number}`;
    seat.dataset.section = section.id;
    seat.dataset.row = row;
    seat.dataset.number = number;
    seat.dataset.price = section.price;
    seat.dataset.sectionName = section.name;

    // Gives an accessible label of the seat for screen readers
    seat.setAttribute(
        "aria-label",
        `${section.name}, row ${row}, seat ${number}, ${section.price} ${VENUE.currency}`
    );

    if (VENUE.unavailable.includes(seat.dataset.id)) {
        seat.classList.add("unavailable");
        seat.disabled = true;
        seat.setAttribute("aria-label", seat.getAttribute("aria-label") + ", unavailable");
    }
    
    // When this seat is clicked, show its details
    seat.addEventListener("click", function () {
        showSeatDetails(seat);
    });

    return seat;
}

// Creates a section of the venue by generating its rows and seats
function createSection(section) {
    const block = document.createElement("div");
    block.className = "section";

    // Loops through each row defined in the section
    section.rows.forEach(function (row) {
        const rowEl = document.createElement("div");
        rowEl.className = "row";

        // Creates and displays the row label
        const label = document.createElement("span");
        label.className = "row-label";
        label.textContent = row;
        rowEl.appendChild(label);

        for (let i = 0; i < section.seatsPerRow; i++) {
            rowEl.appendChild(createSeat(section, row, section.firstSeat + i));
        }

        // Adds the completed row to the section
        block.appendChild(rowEl);
    });
    return block;
}

// Generates the complete venue layput, including the front and back zones
function renderVenue() {
    const venueEl = document.getElementById("venue");
    venueEl.innerHTML = "";

    const stage = document.createElement("div");
    stage.className = "stage";
    stage.textContent = "STAGE";
    venueEl.appendChild(stage);

    // Create the front zone first, followed by the back zone
    ["front", "back"].forEach(function (zoneName) {
        const zoneEl = document.createElement("div");
        zoneEl.className = "zone zone-" + zoneName;

        VENUE.sections
            .filter(function (s) { return s.zone === zoneName; })
            .forEach(function (s) { zoneEl.appendChild(createSection(s)); });

        venueEl.appendChild(zoneEl);
    });
}
// Renders the venue layout when the script runs
renderVenue();

// Shows the color guide under the map that include seat colors with their prices
function showColorGuide() {
    const guideEl = document.getElementById("color-guide");
    guideEl.innerHTML = "";

    const items = [
        { cls: "zone-front", label: "Front: 20 " + VENUE.currency },
        { cls: "zone-back", label: "Back: 15 " + VENUE.currency },
        { cls: "unavailable", label: "Unavailable" }
    ];

    items.forEach(function (item) {
        const li = document.createElement("li");
        const colorBox = document.createElement("span");
        colorBox.className = "color-box " + item.cls;
        li.appendChild(colorBox);
        li.appendChild(document.createTextNode(item.label));
        guideEl.appendChild(li);
    });
}
showColorGuide();

// Shows the details of the clicked seat in the side panel
function showSeatDetails(seat) {
    document.getElementById("detail-section").textContent = seat.dataset.sectionName;
    document.getElementById("detail-row").textContent = seat.dataset.row;
    document.getElementById("detail-number").textContent = seat.dataset.number;
    document.getElementById("detail-price").textContent = seat.dataset.price + " " + VENUE.currency;
}