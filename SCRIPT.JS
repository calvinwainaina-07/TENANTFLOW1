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

    const filtered = houseListings.filter(house =>
        house.location.toLowerCase().includes(query.toLowerCase()) ||
        house.type.toLowerCase().includes(query.toLowerCase()) ||
        house.title.toLowerCase().includes(query.toLowerCase())
    );

    await renderHouseListings(filtered);
}
//===============================
// THE RECIEPT STORAGE
//===============================
let receipts = JSON.parse(localStorage.getItem('receipts')) || [];

// ===============================
// UNSPLASH IMAGE API
// ===============================
const UNSPLASH_KEY = CONFIG.UNSPLASH_KEY;

// FETCH IMAGE BASED ON HOUSE TYPE
async function getHouseImage(type) {
    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${type}&per_page=1&client_id=${UNSPLASH_KEY}`
        );

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            return data.results[0].urls.small;
        }

        return "https://via.placeholder.com/300";

    } catch (error) {
        console.error("Image API error:", error);
        return "https://via.placeholder.com/300";
    }
}

//===============================
// THE SPA NAVIGATION
//===============================
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(s => s.classList.add('hidden'));
    const activeSection = document.getElementById(sectionId);
    if (activeSection) activeSection.classList.remove('hidden');
}

//===============================
// UPDATE THE UI FUNCTION
//===============================
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

//===============================
// SAVE HOUSE LISTINGS
//===============================
function saveHouseListings() {
    localStorage.setItem('houseListings', JSON.stringify(houseListings));
}

//===============================
// RENDER HOUSE LISTINGS (WITH API IMAGES)
//===============================
async function renderHouseListings(listings = houseListings) {
    const container = document.getElementById("searchResult");
    if (!container) return;

    container.innerHTML = "";

    for (let house of listings) {

        // AUTO IMAGE FROM API
        let imageUrl = await getHouseImage(house.type);

        let card = document.createElement("div");
        card.className = "bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden";

        card.innerHTML = `
            <img src="${imageUrl}" class="w-full h-40 object-cover" />
            <div class="p-5">
                <h3 class="font-black text-slate-800">${house.title}</h3>
                <p class="text-slate-500 text-sm">${house.location}</p>
                <p class="text-blue-600 font-black mt-2">KES ${house.price}</p>
                <p class="text-xs text-slate-400">${house.type}</p>
            </div>
        `;

        container.appendChild(card);
    }
}

//===============================
// NEW: ASYNC FETCH (WEB APIs)
//===============================
async function fetchGlobalAnnouncements() {
    const MY_API_KEY = CONFIG.NEWS_API_KEY;
    const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${MY_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "error") {
            console.error("NewsAPI Error:", data.message);
            return;
        }

        let memoList = document.getElementById('memoList');
        if (!memoList) return;
        memoList.innerHTML = "";

        let reminderLi = document.createElement('li');
        reminderLi.className = "p-4 bg-orange-50 border-l-4 border-orange-500 text-orange-800 text-sm mb-2 list-none font-bold rounded-r-xl";
        reminderLi.innerHTML = `⚠️ [SYSTEM]: Rent is due on the 5th of the month.`;
        memoList.appendChild(reminderLi);

        const articles = data.articles || [];
        articles.forEach((article) => {
            let li = document.createElement('li');
            li.className = "p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800 text-sm mb-2 list-none rounded-r-xl shadow-sm";
            li.innerHTML = `<strong>[NEWS]:</strong> ${article.title}`;
            memoList.appendChild(li);
        });

    } catch (error) {
        console.log("Async Fetch Error:", error);
    }
}

//===============================
// PAY BILL FUNCTION
//===============================
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

//===============================
// RECEIPT RENDERING
//===============================
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
        li.className = "p-4 flex justify-between items-center hover:bg-slate-50 transition-colors";

        li.innerHTML = `
            <div>
                <p class="font-bold uppercase text-xs text-slate-800">${receipt.type}</p>
                <p class="text-[10px] text-slate-400">${receipt.date}</p>
            </div>
            <div class="text-blue-600 font-black">$${receipt.amount}</div>
        `;

        container.appendChild(li);
    });
}

//===============================
// LOGIN FUNCTION
//===============================
function login() {
    let user = document.getElementById("username").value;
    if (!user) return alert("Please enter your name");

    localStorage.setItem("user", user);
    document.getElementById("loginSection").classList.add('hidden');
    document.getElementById("app").classList.remove('hidden');

    updateUI();
}

//===============================
// LOGOUT FUNCTION
//===============================
function logout() {
    localStorage.removeItem("user");
    location.reload();
}

//===============================
// INITIALIZATION
//===============================
document.addEventListener("DOMContentLoaded", () => {
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
    fetchGlobalAnnouncements();
    renderHouseListings();
});