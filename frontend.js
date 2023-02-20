const periodStartDateInput = document.querySelector('.periodStartDate input[type="date"]');
const periodEndDateInput = document.querySelector('.periodEndDate input[type="date"]');
let periodStartDate
let periodEndDate

function displayDate() {
    let dates = document.getElementById("savedDates")
    // let startDate = document.createElement("div")
    // let endDate = document.createElement("div")

    periodStartDateInput.addEventListener('input', function (startDate) {
        periodStartDate = startDate.srcElement.value
        dates.append("Start: ", startDate.srcElement.value)
    });

    periodEndDateInput.addEventListener('input', function (endDate) {
        periodEndDate = endDate.srcElement.value
        dates.append(" | ", "End: ", endDate.srcElement.value)
        dates.appendChild(document.createElement("br"))
        dates.style.display = "block"
    });
}

displayDate()

const uuidv4 = require("uuid/v4")
const userData = { id: uuidv4, startDate: periodStartDate, endDate: periodEndDate }

const request = window.indexedDB.open("database", 2);

request.onerror = (event) => {
    console.error(`Database error: ${event.target.errorCode}`);
};

request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Create an objectStore to hold information about user
    const objectStore = db.createObjectStore("user", { keyPath: "id" });

    // Use transaction oncomplete to make sure the objectStore creation is
    // finished before adding data into it.
    objectStore.transaction.oncomplete = (event) => {
        // Store values in the newly created objectStore.
        const userObjectStore = db.transaction("users", "readwrite").objectStore("users");
        userData.forEach((user) => {
            userObjectStore.add(user);
        });
    };
};