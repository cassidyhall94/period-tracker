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
        // createDatabase()
    });
    console.log("savedDates: ", dates.value)
}

displayDate();

const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
const request = indexedDB.open("UserDatabase", 1);

// function createDatabase() {
request.onerror = (event) => {
    console.error(`Database error: ${event.target.errorCode}`);
};

console.log("hi")

request.onupgradeneeded = () => {
    console.log("onupgraded initialising")

    const db = request.result;
    const userStore = db.createObjectStore("user", { keyPath: "id" });
    userStore.createIndex("period_start_date", ["startDate"], { unique: false, })
    userStore.createIndex("period_end_date", ["endDate"], { unique: false, })

    // userStore.transaction.oncomplete = (event) => {
    //     console.log("transaction initialising")

    //     const userTransaction = db.transaction("user", "readwrite").objectStore("user");
    //     userTransaction.add(userData);
    //     userTransaction.transaction.oncomplete = (event) => {
    //         console.log("User details added to database.");
    //     };
    //     userTransaction.transaction.onerror = (event) => {
    //         console.error(`Database transaction error: ${event.target.errorCode}`);
    //     };
    // };
};

console.log("hru")

request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction("user", "readwrite");

    const userStore = transaction.objectStore("user");

    userStore.put({ id: userData.id, startDate: "2023-03-07", endDate: "2023-03-14" })

    const userIDQuery = userStore.get(userData.id)
    console.log(userIDQuery)
    userIDQuery.onerror = (event) => {
        console.error(`Database userIDQuery error: ${event.target.errorCode}`);
    };
    userIDQuery.onsuccess = () => {
        const user = userIDQuery.result;
        console.log("User data retrieved from database:", user);
    };
    transaction.oncomplete = function () {
        db.close()
    }
};
// }