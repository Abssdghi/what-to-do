const container = document.getElementById("card-container");
const STORAGE_KEY = "seen_cards_history";

let database = {};
async function loadDatabase() {
    try {
        const response = await fetch("./database.json");
        const databasefetch = await response.json();
        return databasefetch;
    } catch (error) {
        console.error("database error: ", error);
    }
}

loadDatabase().then((db) => {
    database = db;
});

// Get Random Card Data
function getRandomCardFromDatabase() {
    const randomIndex = Math.floor(Math.random() * database.activities.length);
    return database.activities[randomIndex];
}

// Get Card Data with Seed (for consistent results)
function getRandomCardWithSeed(seed) {
    const randomIndex = seed % database.activities.length;
    return database.activities[randomIndex];
}

// Save History
function saveToHistory(data) {
    const old = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    old.push(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(old));
}

// Create Card
function createCard(zIndex) {
    const data = getRandomCardWithSeed(zIndex);

    const card = document.createElement("div");
    card.style.zIndex = zIndex;
    card.className = `
    absolute w-full h-full rounded-[50px] overflow-hidden
    shadow-2xl cursor-grab active:cursor-grabbing
    transition-transform bg-white
  `;

    const img = document.createElement("img");
    img.className = "w-full h-full object-cover drag-none";
    img.src =
        "/what-to-do/loading.webp" ||
        "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWFibWQxNGc1bjF1d2l5amZna29sdzJpcW16OHlvN2xtbXo5bjc0diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aD7el9eHQ6qjBfeFdm/giphy.gif";

    const contentDiv = document.createElement("div");
    contentDiv.className =
        "absolute bottom-0 w-full bg-gradient-to-t from-black via-black/60 to-transparent pt-12 pb-4 px-6 pb-9";
    contentDiv.innerHTML = `
    <h2 class="text-3xl font-serif text-white drop-shadow-lg leading-tight">${data.title}</h2>
    <p class="text-sm font-mono text-gray-200 mt-1.5 drop-shadow-md leading-relaxed max-w-2xl">${data.description}</p>
  `;

    const innerDiv = document.createElement("div");
    innerDiv.className = "w-full h-full relative";
    innerDiv.appendChild(img);
    innerDiv.appendChild(contentDiv);

    card.appendChild(innerDiv);

    addDrag(card, data);
    container.appendChild(card);

    getPic(data.keywords[0]).then((url) => {
        if (url) {
            img.src = url;
        }
    });

    return card;
}

// Drag + Touch
function addDrag(card, data) {
    let startX,
        startY,
        currentX = 0,
        currentY = 0;
    let dragging = false;

    const start = (x, y) => {
        dragging = true;
        startX = x;
        startY = y;
        card.style.transition = "none";
    };

    const move = (x, y) => {
        if (!dragging) return;
        currentX = x - startX;
        currentY = y - startY;

        card.style.transform = `
      translate(${currentX}px, ${currentY}px)
      rotate(${currentX * 0.05}deg)
    `;
    };

    const end = () => {
        if (!dragging) return;
        dragging = false;

        const threshold = 120;

        if (Math.abs(currentX) > threshold || Math.abs(currentY) > threshold) {
            saveToHistory(data);

            const dirX = currentX > 0 ? 1200 : -1200;
            const dirY = currentY > 0 ? 1200 : -1200;

            card.style.transition = "0.4s ease-out";
            card.style.transform = `translate(${dirX}px, ${dirY}px) rotate(${currentX * 0.1}deg)`;

            setTimeout(() => {
                card.remove();
            }, 400);
        } else {
            card.style.transition = "0.3s ease";
            card.style.transform = "translate(0,0) rotate(0)";
        }
    };

    // Mouse
    card.addEventListener("mousedown", (e) => start(e.clientX, e.clientY));
    document.addEventListener("mousemove", (e) => move(e.clientX, e.clientY));
    document.addEventListener("mouseup", end);

    // Touch
    card.addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        start(t.clientX, t.clientY);
    });

    document.addEventListener("touchmove", (e) => {
        const t = e.touches[0];
        move(t.clientX, t.clientY);
    });

    document.addEventListener("touchend", end);
}

// Show History in Console
function showHistory() {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    console.log("Seen Cards History:", history);
}

// Create Initial Cards
let zIndexCounter = Math.floor(Math.random() * 1000) + 1000;
setInterval(() => {
    if (container.children.length < 4) {
        createCard(zIndexCounter);
        zIndexCounter -= 1;
    }
}, 500);
