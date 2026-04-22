// ===============================
// 1. THE BILL DATA(OUR FAKE DATABASE)
// ===============================
let bills = { rent: false, water: false, electricity: false };

// ===============================
// HOUSE LISTINGS DATABASE (OUR FAKE DATABASE)
// ===============================
let houseListings = JSON.parse(localStorage.getItem('houseListings')) || [
    {
        id: 1,
        title: "1 Bedroom in Kilimani",
        location: "Kilimani, Nairobi",
        price: 25000,
        type: "Apartment",
        image: ""
    },
    {
        id: 2,
        title: "Studio in Westlands",
        location: "Westlands, Nairobi",
        price: 18000,
        type: "Studio",
        image: ""
    },
    {
        id: 3,
        title: "2 Bedroom in Ruaka",
        location: "Ruaka, Nairobi",
        price: 30000,
        type: "Apartment",
        image: ""
    }
];

// ===============================
// IMAGE CACHE (PERFORMANCE BOOST)
// ===============================
let imageCache = {};

// ===============================
// THE RECEIPT STORAGE
// ===============================
let receipts = JSON.parse(localStorage.getItem('receipts')) || [];

// ===============================
// FAVORITES STORAGE (NEW)
// ===============================
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// ===============================
// UNSPLASH IMAGE API
// ===============================
const UNSPLASH_KEY = CONFIG?.UNSPLASH_KEY || "";

// FETCH IMAGE BASED ON HOUSE TYPE
async function getHouseImage(type) {
    if (imageCache[type]) return imageCache[type];

    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${type}&per_page=1&client_id=${UNSPLASH_KEY}`
        );

        const data = await response.json();
        const url = data.results?.[0]?.urls?.small || "https://via.placeholder.com/300";

        imageCache[type] = url;
        return url;

    } catch (error) {
        console.error("Image API error:", error);
        return "https://via.placeholder.com/300";
    }
}

// ===============================
// SEARCH HOUSES
// ===============================
async function searchHouses() {
    const query = document.getElementById("searchInput").value.trim();
    const resultsContainer = document.getElementById("searchResult");

    if (!query) {
        alert("Please enter a location or keyword");
        return;
    }

    resultsContainer.innerHTML = `
        <div class="col-span-full py-10 text-center text-slate-500">
            Searching for "${query}"...
        </div>
    `;

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=6`);
        const data = await response.json();

        const types = ["Studio", "1 Bedroom", "Bedsitter", "2 Bedroom"];

        const mappedData = data.map(() => ({
            title: `${types[Math.floor(Math.random() * types.length)]} in ${query}`,
            location: `${query}, Nairobi`,
            price: Math.floor(Math.random() * 60000) + 15000,
            type: types[Math.floor(Math.random() * types.length)]
        }));

        renderHouseListings(mappedData);

    } catch (error) {
        console.error(error);
        resultsContainer.innerHTML = `<p class="text-red-500 text-center">Error loading data</p>`;
    }
}

// ===============================
// SAVE HOUSE LISTINGS
// ===============================
function saveHouseListings() {
    localStorage.setItem('houseListings', JSON.stringify(houseListings));
}

// ===============================
// RENDER HOUSE LISTINGS (WITH API IMAGES)
// ===============================
async function renderHouseListings(listings = houseListings) {
    const container = document.getElementById("searchResult");
    if (!container) return;

    container.innerHTML = "";

    if (!listings || listings.length === 0) {
        container.innerHTML = `
            <p class="text-center text-slate-400 py-10">No listings available</p>
        `;
        return;
    }

    for (let house of listings) {

        const title = house.title || "Property";
        const location = house.location || "Unknown location";
        const price = house.price || 0;
        const type = house.type || "House";

        let imageUrl = await getHouseImage(type);

        let card = document.createElement("div");
        card.className = "bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:scale-105 transition";

        
        card.innerHTML = `
    <img src="${imageUrl}" class="w-full h-40 object-cover" />

    <div class="p-5">
        <h3 class="font-black text-slate-800">${title}</h3>
        <p class="text-slate-500 text-sm">${location}</p>

        <p class="text-blue-600 font-black mt-2">
            KES ${Number(price).toLocaleString()}
        </p>

        <p class="text-xs text-slate-400">${type}</p>

        <button 
            class="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition view-btn"
        >
            View House
        </button>
    </div>
`;    

        container.appendChild(card);
        card.querySelector(".view-btn").addEventListener("click", () => {
    viewHouse(title, location, price, type, imageUrl);
});
    }
}

// ===============================
// VIEW HOUSE (AIRBNB STYLE PAGE)
// ===============================
function viewHouse(title, location, price, type, imageUrl) {

    const container = document.getElementById("houseDetails");

    container.innerHTML = `
        <div class="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

            <div class="h-80 w-full relative">
                <img src="${imageUrl}" class="w-full h-full object-cover"/>
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                <button 
                    onclick="goBack()"
                    class="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded-full text-sm font-bold"
                >
                    ← Back
                </button>
            </div>

            <div class="p-6 md:p-10">

                <h1 class="text-3xl font-black">${title}</h1>

                <p class="text-slate-500 mt-2">📍 ${location}</p>

                <p class="text-2xl font-black text-blue-600 mt-4">
                    KES ${Number(price).toLocaleString()} / month
                </p>

                <span class="inline-block mt-3 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                    ${type}
                </span>

                <div class="mt-6 text-slate-600">
                    <p>
                        This ${type.toLowerCase()} is located in ${location}. Modern, secure and ideal for comfortable living.
                    </p>
                </div>

                <div class="mt-8 flex gap-3">

                    <button 
    onclick="openBooking()"
    class="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold"
>
    Book Viewing
</button>

<button 
    onclick="openChat()"
    class="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold"
>
    Contact Landlord
</button>
                </div>

                <button 
                    onclick='toggleFavorite({ title: "${title}", location: "${location}", price: ${price}, type: "${type}", image: "${imageUrl}" })'
                    class="mt-6 w-full border border-red-300 text-red-500 py-3 rounded-xl font-bold hover:bg-red-50"
                >
                    ❤️ Save to Favorites
                </button>
 
            
            </div>
        </div>
    `;

    showSection("houseDetails");
}

// ===============================
// BACK NAVIGATION (NEW)
// ===============================
function goBack() {
    const last = localStorage.getItem("currentSection") || "searchSection";
    showSection(last);
}

// ===============================
// FAVORITES SYSTEM (NEW)
// ===============================
function toggleFavorite(house) {
    const exists = favorites.find(f => f.title === house.title);

    if (exists) {
        favorites = favorites.filter(f => f.title !== house.title);
    } else {
        favorites.push(house);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Saved to favorites ❤️");
}


function renderFavorites() {
    const container = document.getElementById("favoritesList");

    if (!container) return;

    container.innerHTML = "";

    if (favorites.length === 0) {
        container.innerHTML = `
            <p class="text-center text-slate-400 py-10">No favorites yet ❤️</p>
        `;
        return;
    }

    favorites.forEach(house => {
        const card = document.createElement("div");

        card.className = "bg-white rounded-3xl shadow-sm overflow-hidden border";

        card.innerHTML = `
            <img src="${house.image}" class="w-full h-40 object-cover"/>

            <div class="p-5">
                <h3 class="font-black">${house.title}</h3>
                <p class="text-slate-500 text-sm">${house.location}</p>

                <p class="text-blue-600 font-black mt-2">
                    KES ${Number(house.price).toLocaleString()}
                </p>

                <button onclick="removeFavorite('${house.title}')"
                    class="mt-4 w-full bg-red-500 text-white py-2 rounded-xl font-bold">
                    Remove ❤️
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}

function removeFavorite(title) {
    favorites = favorites.filter(f => f.title !== title);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
}
// ===============================
// UPDATE THE UI FUNCTION
// ===============================
function updateUI() {
    for (let bill in bills) {
        let billElement = document.getElementById(bill + 'Status');
        if (!billElement) continue;

        const payButton = billElement.parentElement.querySelector('button');

        if (bills[bill]) {
            billElement.textContent = 'PAID';
            billElement.className = "text-xl font-black py-2 text-green-500";

            if (payButton) {
                payButton.disabled = true;
                payButton.textContent = "Completed";
                payButton.className = "w-full mt-4 bg-slate-200 text-slate-400 py-3 rounded-2xl text-sm font-bold cursor-not-allowed";
            }
        } else {
            billElement.textContent = 'UNPAID';
            billElement.className = "text-xl font-black py-2 text-red-500";
        }
    }
}

// ===============================
// PAY BILL FUNCTION
// ===============================
function payBill(type) {
    const btn = event.target;
    btn.textContent = "Processing...";
    btn.disabled = true;

    setTimeout(() => {
        bills[type] = true;

        let receipt = {
            type: type,
            amount: type === 'rent' ? 500 : 50,
            date: new Date().toLocaleString()
        };

        receipts.push(receipt);
        localStorage.setItem('receipts', JSON.stringify(receipts));

        updateUI();
        renderReceipts();

        alert(`${type.toUpperCase()} paid successfully!`);
    }, 1000);
}

// ===============================
// RECEIPT RENDERING
// ===============================
function renderReceipts() {
    let container = document.getElementById('receiptList');
    if (!container) return;

    container.innerHTML = '';

    if (receipts.length === 0) {
        container.innerHTML = '<p class="p-8 text-center text-slate-400 text-sm">No receipts found yet.</p>';
        return;
    }

    [...receipts].reverse().forEach(receipt => {
        let li = document.createElement('li');
        li.className = "p-4 flex justify-between items-center";

        li.innerHTML = `
            <div>
                <p class="font-bold uppercase text-xs">${receipt.type}</p>
                <p class="text-[10px] text-slate-400">${receipt.date}</p>
            </div>
            <div class="text-blue-600 font-black">KES ${receipt.amount}</div>
        `;

        container.appendChild(li);
    });
}

// ===============================
// LOGIN FUNCTION
// ===============================
function login() {
    let user = document.getElementById("username").value;
    if (!user) return alert("Please enter your name");

    localStorage.setItem("user", user);
    document.getElementById("loginSection").classList.add('hidden');
    document.getElementById("app").classList.remove('hidden');

    updateUI();
}

// ===============================
// LOGOUT FUNCTION
// ===============================
function logout() {
    localStorage.removeItem("user");
    location.reload();
}

// ===============================
// NAVIGATION
// ===============================

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(s => s.classList.add('hidden'));

    const activeSection = document.getElementById(sectionId);
    if (activeSection) activeSection.classList.remove('hidden');

    localStorage.setItem("currentSection", sectionId);
}
// ===============================
// CHAT SYSTEM
// ===============================
let chatMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];

function openChat() {
    showSection("chatSection");
    renderChat();
}

function sendMessage() {
    const input = document.getElementById("chatInput");
    const message = input.value.trim();

    if (!message) return;

    const newMsg = {
        text: message,
        sender: "me",
        time: new Date().toLocaleTimeString()
    };

    chatMessages.push(newMsg);
    localStorage.setItem("chatMessages", JSON.stringify(chatMessages));

    input.value = "";

    renderChat();

    // fake landlord reply
    setTimeout(() => {
        chatMessages.push({
            text: "Got your message. I'll respond shortly 👍",
            sender: "landlord",
            time: new Date().toLocaleTimeString()
        });

        localStorage.setItem("chatMessages", JSON.stringify(chatMessages));
        renderChat();
    }, 1000);
}

function renderChat() {
    const box = document.getElementById("chatBox");
    if (!box) return;

    box.innerHTML = "";

    chatMessages.forEach(msg => {
        const div = document.createElement("div");

        div.className =
         msg.sender === "me"
        ? "bg-blue-600 text-white p-3 rounded-xl self-end ml-auto w-fit max-w-[80%]"
        : "bg-white border border-slate-200 text-slate-800 p-3 rounded-xl w-fit max-w-[80%]";

        div.innerHTML = `
            <p>${msg.text}</p>
            <span class="text-[10px] opacity-70">${msg.time}</span>
        `;

        box.appendChild(div);
    });

    box.scrollTop = box.scrollHeight;
}

// form listener
document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chatForm");

    if (chatForm) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            sendMessage();
        });
    }
});


// ===============================
// BOOKING SYSTEM
// ===============================
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

function openBooking() {
    showSection("bookingSection");
}

function bookViewing() {
    const date = document.getElementById("bookingDate").value;
    const status = document.getElementById("bookingStatus");

    if (!date) {
        status.textContent = "Please select a date";
        return;
    }

    const booking = {
        date,
        status: "pending"
    };

    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    status.textContent = "Booking confirmed ✔";
    status.className = "text-green-600 font-bold";
    renderBookings();

}
function renderBookings() {
    const container = document.getElementById("bookingList");
    if (!container) return;

    container.innerHTML = "";

    if (bookings.length === 0) {
        container.innerHTML = `<p class="text-slate-400">No bookings yet</p>`;
        return;
    }

    bookings.forEach(b => {
        const div = document.createElement("div");

        div.className = "bg-white p-4 rounded-xl shadow border border-slate-200 flex justify-between items-center text-slate-800";
        div.innerHTML = `
            <div>
                <p class="font-bold">Viewing Booking</p>
                <p class="text-sm text-slate-500">${b.date}</p>
            </div>

            <span class="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-600">
                ${b.status}
            </span>
        `;

        container.appendChild(div);
    });
}

// ===============================
// INITIALIZATION
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const savedSection = localStorage.getItem("currentSection");

    if (localStorage.getItem("user")) {
        document.getElementById("loginSection").classList.add('hidden');
        document.getElementById("app").classList.remove('hidden');
    }

    const form = document.getElementById("searchForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            searchHouses();
        });
    }

    updateUI();
    renderReceipts();
    renderHouseListings();
    renderHouseListings();
    renderBookings();
    renderChat();  

    if (savedSection) {
        showSection(savedSection);
    } else {
        showSection("dashboard");
    }
});  