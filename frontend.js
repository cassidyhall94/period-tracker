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

function database() {
    let userStore
    let db
    let request = indexedDB.open("UserDatabase", 10);

    request.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
    };

    request.onsuccess = (event) => {
        db = event.target.result
        console.log("success", db)
    };

    request.onupgradeneeded = (event) => {
        console.log("onupgraded initialising")

        db = event.target.result

        let oldVersion = event.oldVersion
        let newVersion = event.newVersion || db.version
        console.log("DB updated from version", oldVersion, "to", newVersion)

        if (!db.objectStoreNames.contains("user")) {
            userStore = db.createObjectStore("user", { keyPath: "id" });
        }
        console.log(userStore)
    };

    periodEndDateInput.addEventListener('input', (event) => {
        db = request.result
        event.preventDefault()
        let startDate = periodStartDate
        let endDate = periodEndDate

        let userInput = {
            id: userID,
            startDate,
            endDate
        }

        let transaction = db.transaction("user", "readwrite")
        transaction.oncomplete = (event) => {
            console.log("transaction successful:", event)
        }
        transaction.onerror = (err) => {
            console.log("transaction onerror:", err)
        }

        let store = transaction.objectStore("user")

        let req = store.add(userInput)
        req.onsuccess = (event) => {
            console.log("successfully added User object into database,", event)
        }
        req.onerror = (err) => {
            console.log("req onerror:", err)
        }
    })
}

database()