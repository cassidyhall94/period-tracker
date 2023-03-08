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
        createDatabase()
    });
    console.log("savedDates: ", dates.value)
}

displayDate();

const request = window.indexedDB.open("database", 2);

function createDatabase() {
    console.log("DB userData: ", userData)
    console.log("database initialising")
    console.log("Before request: ", request)

    request.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
    };

    console.log("hi")

    request.onupgradeneeded = (event) => {
        console.log("onupgraded initialising")
        const db = event.target.result;

        // Create an objectStore to hold information about user
        const objectStore = db.createObjectStore("user", { keyPath: "id" });
        objectStore.createIndex("period_start_date", ["startDate"], { unique: true, })
        objectStore.createIndex("period_end_date", ["endDate"], { unique: true, })
        // Use transaction oncomplete to make sure the objectStore creation is
        // finished before adding data into it.
        objectStore.transaction.oncomplete = (event) => {
            console.log("transaction initialising")
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

    console.log("hru")

    request.onsuccess = (event) => {
        console.log("request success: ", request)
        const db = event.target.result;
        const transaction = db.transaction(["user"], "readwrite");
        const objectStore = transaction.objectStore("user");
        const request = objectStore.get(userID);
        request.onerror = (event) => {
            console.error(`Database error: ${event.target.errorCode}`);
        };
        request.onsuccess = (event) => {
            const user = event.target.result;
            console.log(event.target)
            console.log("User data retrieved from database:", user);
        };
    };
    console.log("AFTER request: ", request)
    console.log("bye")
}