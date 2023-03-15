const periodStartDateInput = document.querySelector('.periodStartDate input[type="date"]');
const periodEndDateInput = document.querySelector('.periodEndDate input[type="date"]');
let userData = {}; // object for user's data entered one at a time
let periodStartDate;
let periodEndDate;
let username = document.getElementById('username') // username entered by user
let userID //
let userStore
// let userID = "850f4438-6838-47d3-a812-67a822dd53bf"

let db
let request = indexedDB.open("UserDatabase", 10);

// function uuidv4() {
//     return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
//         (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
//     );
// }

function getDatesByUsername(userID) {
    db = request.result
    let reqUsername = db.transaction('user').objectStore('user').getAll(userID)
    reqUsername.onsuccess = () => {
        let user = reqUsername.result
        let dates = document.getElementById("savedDates");
        dates.append("Start: ", user.startDate);
        dates.append(" | ", "End: ", user.endDate);
        dates.appendChild(document.createElement("br"));
        dates.style.display = "block";
    }

    reqUsername.onerror = (err) => {
        console.log("Error retrieving", userID, "'s saved dates:", err)
    }
}

function displayDate() {
    username.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            userID = username.value
            getDatesByUsername(userID)
        }
    });
    console.log(userID)
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
        console.log("userstore:", userStore)
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

