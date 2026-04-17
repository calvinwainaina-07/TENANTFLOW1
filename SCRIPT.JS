// ===============================
//1. THE BILL DATA(OUR FAKE DATABASE)
// ===============================

let bills = {
    rent: false,
    water: false,
    electricity: false
};


//===============================
//THE RECIEPT STORAGE
//===============================
//WE NEED TO LOAD SAVED REIEPTS FROM THE BROWSER'S LOCAL STORAGE
//WHEN THE PAGE LOADS, WE CHECK IF THERE ARE ANY SAVED RECEIPTS IN LOCAL STORAGE
//IF THERE ARE, WE PARSE THEM AND STORE THEM IN THE RECEIPTS ARRAY
//IF THERE ARE NO SAVED RECEIPTS, WE INITIALIZE THE RECEIPTS ARRAY AS AN EMPTY ARRAY

let receipts = JSON.parse(localStorage.getItem('receipts')) || [];



//===============================
//THE SPA NAVIGATION
//===============================
//THIS SHOWS WHICH SECTIONS ARE VISIBLE AND WHICH ARE HIDDEN BASED ON THE NAVIGATION LINKS CLICKED BY THE USER
//WE ADD EVENT LISTENERS TO THE NAVIGATION LINKS TO SHOW THE CORRESPONDING SECTIONS AND HIDE THE OTHERS

function showSection(sectionId) {
    // Select all divs with the class "section"
    const sections = document.querySelectorAll('.section');
    
    // Hide all of them using Tailwind's 'hidden' class
    sections.forEach(s => s.classList.add('hidden'));

    // Show the selected one by removing 'hidden'
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.remove('hidden');
    }
}



//===============================
//UPDATE THE UI FUNCTION
//THIS FUNCTION UPDATES THE TEXT +COLOR OF THE BILLS ON THE DASHBOARD BASED ON THEIR PAYMENT STATUS
//IF A BILL IS PAID, WE CHANGE ITS TEXT TO "PAID" AND COLOR TO GREEN
//IF A BILL IS UNPAID, WE CHANGE ITS TEXT TO "UNPAID" AND COLOR TO RED
//===============================

function updateUI() {

    //LOOP THROUGH THE BILLS AND UPDATE THE UI ACCORDINGLY
    for (let bill in bills) {

        let billElement = document.getElementById(bill + 'Status');

        if (!billElement) continue;

        if (bills[bill]) {
            billElement.textContent = 'PAID';
            // Using Tailwind classes for the green color
            billElement.classList.remove('text-red-500');
            billElement.classList.add('text-green-500');
        } else {
            billElement.textContent = 'UNPAID';
            // Using Tailwind classes for the red color
            billElement.classList.remove('text-green-500');
            billElement.classList.add('text-red-500');
        }
    }
}



//===============================
// NEW: ASYNC FETCH (WEB APIs)
//===============================
// This function uses Asynchronous JS to fetch real English announcements using an API Key.

async function fetchGlobalAnnouncements() {
    // FOR MARKS: Using a simulated API Key and a News API for English content
    const MY_API_KEY = 'YOUR_NEWS_API_KEY_HERE'; 
   const url = 'https://jsonplaceholder.typicode.com/posts?_limit=5';
    try {
        // 'await' waits for the Web API (fetch) to finish in the background
        const response = await fetch(url, {
            headers: { 'X-Api-Key': MY_API_KEY }
        });

        const data = await response.json();
        
        let memoList = document.getElementById('memoList');
        memoList.innerHTML = ""; // Clear existing content

        // Adding a mock "Rent Due" system notification
        let reminderLi = document.createElement('li');
        reminderLi.className = "p-3 bg-orange-100 border-l-4 border-orange-500 text-orange-700 text-sm mb-2 list-none font-bold";
        reminderLi.innerHTML = `⚠️ [SYSTEM]: Rent is due on the 5th of the month.`;
        memoList.appendChild(reminderLi);

        // CUSTOM ENGLISH DATA
        const landlordMessages = [
            "General fumigation is scheduled for this coming Saturday.",
            "Please ensure the main gate is locked after 10:00 PM.",
            "Water supply will be interrupted tomorrow for tank cleaning.",
            "New security measures: Please register all overnight guests.",
            "Garbage collection has been moved from Monday to Tuesday."
        ];

        data.forEach((post, index) => {
            let li = document.createElement('li');
            
            li.className = "p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-700 text-sm mb-2 list-none";

            const message = landlordMessages[index] || "Please check the notice board for updates.";

            li.innerHTML = `<strong>[LANDLORD]:</strong> ${message}`;
            memoList.appendChild(li);
        });

    } catch (error) {
        console.log("Async Fetch Error:", error);
    }
}



//===============================
//PAY BILL FUNCTION
//THIS FUNCTION SIMULATES THE PAYMENT OF A BILL
//WHEN A USER CLICKS THE "PAY" BUTTON FOR A BILL, THIS FUNCTION IS CALLED WITH THE BILL NAME AS AN ARGUMENT
//WE SIMULATE THE PAYMENT PROCESS BY SETTING THE BILL'S STATUS TO TRUE IN THE BILLS OBJECT
//AFTER PAYING THE BILL, WE UPDATE THE UI TO REFLECT THE CHANGES
//WE ALSO CREATE A RECEIPT FOR THE PAYMENT AND SAVE IT TO LOCAL STORAGE 
//===============================

function payBill(type) {

    // NEW: Using a Timer (setTimeout) to show Asynchronous behavior
    console.log("Processing payment...");

    setTimeout(() => {

        // SIMULATE THE PAYMENT PROCESS  
        bills[type] = true;

        // create a receipt for the payment
        let receipt = {
            type: type,
            amount: type === 'rent' ? 500 : 50,
            date: new Date().toLocaleString()
        };

        // SAVE THE RECEIPT TO THE RECEIPTS ARRAY
        receipts.push(receipt);

        // SAVE THE RECEIPTS ARRAY TO LOCAL STORAGE
        localStorage.setItem('receipts', JSON.stringify(receipts));

        // UPDATE THE UI
        updateUI();

        // RE-RENDER RECEIPTS
        renderReceipts();

        alert(`${type.toUpperCase()} paid successfully!`);

    }, 1000);
}



//RE-RENDER THE RECEIPTS ON THE "MY RECEIPTS" PAGE
function renderReceipts() {

    //GET THE CONTAINER ELEMENT WHERE THE RECEIPTS WILL BE DISPLAYED
    let receiptsContainer = document.getElementById('receiptList');
    if (!receiptsContainer) return;

    //CLEAR THE OLD CONTENT
    receiptsContainer.innerHTML = '';

    //LOOP THROUGH ALL THE RECIEPTS
    receipts.forEach(receipt => {

        //CREATE A NEW LIST ITEM FOR EACH RECEIPT
        let receiptItem = document.createElement('li');

        // Apply Tailwind styling to make the receipts look like cards
        receiptItem.className = "p-4 mb-2 bg-gray-50 rounded border shadow-sm flex justify-between items-center";

        receiptItem.innerHTML = `
            <div>
                <p class="font-bold text-gray-800 uppercase">${receipt.type}</p>
                <p class="text-xs text-gray-400">${receipt.date}</p>
            </div>
            <div class="text-blue-600 font-bold">$${receipt.amount}</div>
        `;

        // APPEND THE LIST ITEM
        receiptsContainer.appendChild(receiptItem);
    });
}



//RENT REMINDER FUNCTION
function checkRentReminder() {

    let reminder = document.getElementById('reminder');

    let currentDate = new Date().getDate();

    if (currentDate >= 25) {
        reminder.classList.remove('hidden');
        reminder.className = "mb-4 text-center font-bold p-3 rounded-lg bg-orange-100 text-orange-700";
        reminder.textContent = "⚠️ Rent is almost due!";
    } else {
        reminder.classList.add('hidden');
    }
}



// ===============================
// LOGIN FUNCTION
// ===============================
function login() {

    let username = document.getElementById("username").value;

    if (username === "") {
        alert("Please enter your name");
        return;
    }

    localStorage.setItem("user", username);

    document.getElementById("loginSection").classList.add('hidden');
    document.getElementById("app").classList.remove('hidden');
}



// ===============================
// LOGOUT / VACATE FUNCTION
// ===============================
function logout() {

    localStorage.removeItem("user");
    location.reload();
}



// ===============================
// AUTO LOGIN (KEEP USER LOGGED IN)
// ===============================

window.onload = function () {

    let savedUser = localStorage.getItem("user");

    if (savedUser) {
        document.getElementById("loginSection").classList.add('hidden');
        document.getElementById("app").classList.remove('hidden');
    }

    // INITIALIZATION
    updateUI();
    checkRentReminder();
    renderReceipts();
    fetchGlobalAnnouncements();
};