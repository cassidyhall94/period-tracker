const periodStartDateInput = document.querySelector('.periodStartDate input[type="date"]');
const periodEndDateInput = document.querySelector('.periodEndDate input[type="date"]');
let userData = {}; // object for user's data entered one at a time
let periodStartDate;
let periodEndDate;
let userElement = document.getElementById('username') // username entered by user
let username
let db
let request = indexedDB.open("UserDatabase", 10);

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function displayDates() {
    let dates = document.getElementById("savedDates");
    userElement.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            username = userElement.value
            let tx = makeTX('user', 'readonly')
            tx.oncomplete = (event) => {
                console.log("get transaction complete")
            }

            let store = tx.objectStore('user')
            let req = store.get(username)
            console.log(req)
            req.onsuccess = (event) => {
                let request = event.target
                let user = request.result
                console.log(user)
                periodStartDate = startDate.srcElement.value;
                dates.append("Start: ", user.startDate);
                dates.append(" | ", "End: ", user.endDate);
                dates.appendChild(document.createElement("br"));
                dates.style.display = "block"
            }
        }
    });

    let tx = makeTX('user', 'readonly')
    tx.oncomplete = (event) => {
        console.log("all objects read")
    }

    let store = tx.objectStore('user')
    let getDates = store.getAll()

    getDates.onsuccess = (event) => {
        let req = event.target
        console.log(req.result)
        dates.innerHTML = req.result
        dates.style.display = "block"

    }
    getDates.onerror = (err) => {
        console.warn(err);
    };
}

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
            let userStore = db.createObjectStore("user", { keyPath: "id" });
            console.log("Object Store created:", userStore)
        }
    };

    periodEndDateInput.addEventListener('input', (event) => {
        db = request.result
        event.preventDefault()
        username = document.getElementById('username').value
        let startDate = periodStartDateInput.value
        let endDate = event.srcElement.value
        if (username.length === 0) {
            username = "Cassidy"
        }
        let userInput = {
            // id: userData.id,
            id: uuidv4(),
            username: username,
            startDate,
            endDate
        }

        let transaction = makeTX("user", "readwrite")
        transaction.oncomplete = (event) => {
            console.log("transaction successful:", event)
            displayDates()
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

function makeTX(storeName, mode) {
    let tx = db.transaction(storeName, mode);
    tx.onerror = (err) => {
        console.warn(err);
    };
    return tx;
}