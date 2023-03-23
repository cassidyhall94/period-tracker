const periodStartDateInput = document.querySelector('.periodStartDate input[type="date"]');
const periodEndDateInput = document.querySelector('.periodEndDate input[type="date"]');
let userData = []// object for user's data entered one at a time
let periodStartDate;
let periodEndDate;
let userElement = document.getElementById('username') // username entered by user
let username
let request = indexedDB.open("UserDatabase", 13);
let db
let dates = document.getElementById("savedDates");

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function displayDates() {

    let tx = makeTX('user', 'readonly')
    tx.oncomplete = (event) => {
        console.log("all objects read")
    }

    let store = tx.objectStore('user')
    let getDates = store.getAll()

    getDates.onsuccess = (event) => {
        let req = event.target
        let user = req.result
        username = document.getElementById('username').value

        user.forEach(date => {
            if (date.username === username) {
                dates.append("Username: ", date.username)
                dates.append(" | ", "Start: ", date.startDate);
                dates.append(" | ", "End: ", date.endDate);
                dates.appendChild(document.createElement("br"));
                dates.style.display = "block"
                userData.push({
                    id: date.id,
                    username: date.username,
                    startDate: date.startDate,
                    endDate: date.endDate
                })
            }
        });

        // eventlistener on the backup button, creates a JSON file that is then downloaded to the user's device
        document.getElementById('backup').addEventListener('click', function (e) {
            console.log("backup successfully downloaded")
            let jsonDates = JSON.stringify(userData)
            let file = new File([jsonDates], 'backup.json', { type: 'application/json' })
            let fileUrl = URL.createObjectURL(file);
            const downloadLink = document.createElement('a');
            downloadLink.href = fileUrl;
            downloadLink.download = file.name;
            downloadLink.click();
        })
    }

    getDates.onerror = (err) => {
        console.warn(err);
    };
}

//TODO:
// Use the File API to read the JSON file from the user's device. You can use the FileReader object to read the file as text.

// Once you have read the JSON file, you can use the JSON.parse() method to parse the JSON data into a JavaScript object.

// Create an IndexedDB database and object store to store the data. You can use the indexedDB global variable to create the database and object store.

// Use the put() method of the object store to save the parsed data into the IndexedDB database.

// const fileInput = document.querySelector("input[type=file]");

// fileInput.addEventListener("change", () => {
//     let userBackupData = []
//     const file = fileInput.files[0];
//     const reader = new FileReader();
//     reader.onload = (e) => {
//         let jsonData = JSON.parse(e.target.result)
//         // console.log("jsonData:", jsonData)

//         jsonData.forEach(entry => {
//             let backupInput = {
//                 id: entry.id,
//                 username: entry.username,
//                 startDate: entry.startDate,
//                 endDate: entry.endDate
//             }
//             userBackupData.push(backupInput)
//         })
//         db = request.result

//         let transaction = makeTX("user", "readwrite")
//         transaction.oncomplete = () => {
//             console.log('backup transaction successful');
//         };
//         transaction.onerror = () => {
//             console.error('Error with backup data');
//         };
//         let userStore = db.createObjectStore("user", { keyPath: "id" })
//         let tx = transaction.userStore("user")
//         console.log(userBackupData)
//         let req = tx.add(userBackupData)
//         console.log(req)
//         req.onsuccess = (event) => {
//             console.log("successfully added User backup object into database,", event)
//         }
//         req.onerror = (err) => {
//             console.log("req backup onerror:", err)
//         }
//     }
//     reader.readAsText(file)
//     displayDates()
// });

const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', () => {
    let req = indexedDB.open("UserDatabase", 14);
    let userBackupData = []
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        const jsonData = JSON.parse(event.target.result);
        jsonData.forEach(entry => {
            let backupInput = {
                id: entry.id,
                username: entry.username,
                startDate: entry.startDate,
                endDate: entry.endDate
            }
            userBackupData.push(backupInput)
        });
        console.log(userBackupData)
        console.log(req)
        req.onupgradeneeded = (event) => {
            const db = event.target.result;
            const userStore = db.createObjectStore('user', { keyPath: 'id' });
        };
        req.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['user'], 'readwrite');
            const userStore = transaction.objectStore('user');

            // Save the parsed data into the IndexedDB database
            userStore.put(userBackupData);

            transaction.oncomplete = () => {
                console.log('Data saved successfully.');
            };
            transaction.onerror = () => {
                console.error('Error saving data.');
            };
        };
    };
    reader.readAsText(file);
});

userElement.addEventListener('keypress', function (e) {
    if (e.key === "Enter") {
        e.preventDefault()
        displayDates()
    }
})

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
            id: uuidv4(),
            username: username,
            startDate,
            endDate
        }

        let transaction = makeTX("user", "readwrite")
        transaction.oncomplete = (event) => {
            console.log("transaction oncomplete:", event)

            let userStr = "Username: " + userInput.username + " | " + "Start: " + userInput.startDate + " | " + "End: " + userInput.endDate
            dates.append(userStr)
            // dates.append("Username: ", userInput.username)
            // dates.append(" | ", "Start: ", userInput.startDate);
            // dates.append(" | ", "End: ", userInput.endDate);
            dates.appendChild(document.createElement("br"));
            dates.style.display = "block"
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