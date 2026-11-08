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
        // Removes the yellow from the previous seat
    if (inspectedSeat !== null) {
        inspectedSeat.classList.remove("inspected");
    }

    // Makes the new seat yellow and remembers it
    seat.classList.add("inspected");
    inspectedSeat = seat;

    document.getElementById("detail-section").textContent = seat.dataset.sectionName;
    document.getElementById("detail-row").textContent = seat.dataset.row;
    document.getElementById("detail-number").textContent = seat.dataset.number;
    document.getElementById("detail-price").textContent = seat.dataset.price + " " + VENUE.currency;
    updateAddButton();
}

// Remembers which seat is currenlty being inspected
let inspectedSeat = null;

// The tickets that the user has added already
let cart = [];

// Adds the inspected seat to the cart when the button is pressed
function addToCart() {
    if (inspectedSeat === null) {
        return;
    }
    // makes sure that the seat that is already in the cart cannot be added again
    if (inspectedSeat.classList.contains("in-cart")) {
        return;
    }

    cart.push({
        id: inspectedSeat.dataset.id,
        sectionName: inspectedSeat.dataset.sectionName,
            row: inspectedSeat.dataset.row,
        number: inspectedSeat.dataset.number,
        price: inspectedSeat.dataset.price
    });

    inspectedSeat.classList.add("in-cart");
    updateAddButton();
    updateCart();
    saveCart();
}

// Makes the button mathc the inspected seat. Usable or already in the cart
function updateAddButton() {
    const button = document.getElementById("add-to-cart");

    if (inspectedSeat === null) {
        button.disabled = true;
    } else if (inspectedSeat.classList.contains("in-cart")) {
        button.disabled = true;
        button.textContent = "ALREADY IN CART";
    } else {
        button.disabled = false;
        button.textContent = "ADD TO CART";
    
    }
}

document.getElementById("add-to-cart").addEventListener("click", addToCart);

// Redraws the cart list and the total price from the cart array
function updateCart() {
    const list = document.getElementById("cart-items");
    list.innerHTML = "";

    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        const item = document.createElement("li");
        item.textContent = cart[i].sectionName + ", row " + cart[i].row +
            ", seat " + cart[i].number + " - " + cart[i].price + " " + VENUE.currency;

        // Each ticket will get its own remove button
        const seatId = cart[i].id;
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-button";
        removeButton.textContent = "REMOVE";
        removeButton.addEventListener("click", function () {
            removeFromCart(seatId);
        });

        item.appendChild(removeButton);
        list.appendChild(item);

        total += Number(cart[i].price);
    }

    document.getElementById("cart-total").textContent = total;
}

// Removes a ticket from the cart and returns its seat to normal on the map
function removeFromCart(seatId) {
    // Takes the ticket out of the cart list
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === seatId) {
            cart.splice(i, 1);
            break;
        }
    }

    // finds the matching seat on the map and removes its red in-cart look
    const seats = document.querySelectorAll(".seat");
    for (let i = 0; i < seats.length; i++) {
        if (seats[i].dataset.id === seatId) {
            seats[i].classList.remove("in-cart");
        }
    }

    updateCart();
    saveCart();
    updateAddButton();
}

// Ssaves the cart in the browser so it survves a refresh
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Loads the saved cart after a refresh and shows it again on the page
function loadCart() {
    const saved = localStorage.getItem("cart");

    // case when nothing was saved yet, so there is nothing to restore
    if (saved === null) {
        return;
    }
    cart = JSON.parse(saved);

    // Turns the seats in the cart red again on the map
    const seats = document.querySelectorAll(".seat");
    for (let i = 0; i < cart.length; i++) {
        for (let j = 0; j < seats.length; j++) {
            if (seats[j].dataset.id === cart[i].id) {
            seats[j].classList.add("in-cart");
            }
        }
    }
    updateCart();
}

//loadCart();

// How zoomed in the map is (1 stands for normal size)
let zoomLevel = 1;
let moveX = 0;
let moveY = 0;

// Applies the current zoom to the venue and position
function updateView() {
    document.getElementById("venue").style.transform = 
    "translate(" + moveX + "px, "+moveY +"px) scale(" + zoomLevel + ")";
}
// Makes the venue bigegr up to a limit
function zoomIn() {
    if (zoomLevel < 2) {
        zoomLevel += 0.25;
        updateView();}
}

// Makes the venue smaller down to a limit
function zoomOut() {
    if (zoomLevel > 0.5) {
        zoomLevel -= 0.25;
        updateView();
    }
}

// Puts the venue back to its normal size
function resetView() {
    zoomLevel= 1;
    moveX = 0;
    moveY = 0;
    updateView();
}

document.getElementById("zoom-in").addEventListener("click", zoomIn);
document.getElementById("zoom-out").addEventListener("click", zoomOut);
document.getElementById("reset-view").addEventListener("click", resetView);

// Moves the map by the given amount, but never further than the limit
function moveMap(changeX, changeY) {
    moveX += changeX;
    moveY += changeY;

    if (moveX > 300) { moveX = 300; }
    if (moveX < -300) { moveX = -300; 
    }
    if (moveY > 300) { moveY = 300; }
    if (moveY < -300) { moveY = -300; }
    updateView();
}

document.getElementById("move-left").addEventListener("click", function () {
    moveMap(-50, 0);
});
document.getElementById("move-right").addEventListener("click", function () {
    moveMap(50, 0);
});
document.getElementById("move-up").addEventListener("click", function () {
    moveMap(0, -50);
});
document.getElementById("move-down").addEventListener("click", function () {
    moveMap(0, 50);
});

loadCart();