const periodStartDateInput = document.querySelector('.periodStartDate input[type="date"]');
const periodEndDateInput = document.querySelector('.periodEndDate input[type="date"]');
let userData = {};
let periodStartDate;
let periodEndDate;
let userID = "850f4438-6838-47d3-a812-67a822dd53bf"

function displayDate() {
    let dates = document.getElementById("savedDates");

    periodStartDateInput.addEventListener('input', function (startDate) {
        periodStartDate = startDate.srcElement.value;
        dates.append("Start: ", startDate.srcElement.value);
    });

    periodEndDateInput.addEventListener('input', function (endDate) {
        periodEndDate = endDate.srcElement.value;
        dates.append(" | ", "End: ", endDate.srcElement.value);
        dates.appendChild(document.createElement("br"));
        dates.style.display = "block";
        userData = { id: userID, startDate: periodStartDate, endDate: periodEndDate };
    });
}

displayDate();

const request = window.indexedDB.open("database", 2);

function createDatabase() {
    console.log("database initialising")
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
            const userObjectStore = db.transaction("user", "readwrite").objectStore("user");
            userObjectStore.add(userData);
            userObjectStore.transaction.oncomplete = (event) => {
                console.log("User details added to database.");
            };
            userObjectStore.transaction.onerror = (event) => {
                console.error(`Database transaction error: ${event.target.errorCode}`);
            };
        };
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(["user"], "readwrite");
        const objectStore = transaction.objectStore("user");
        const request = objectStore.get(userID);
        request.onerror = (event) => {
            console.error(`Database error: ${event.target.errorCode}`);
        };
        request.onsuccess = (event) => {
            const user = event.target.result;
            console.log("User data retrieved from database:", user);
        };
    };
}
console.log('Before createDatabase() call');
createDatabase();
