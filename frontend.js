const periodStartDateInput = document.querySelector('.periodStartDate input[type="date"]');
const periodEndDateInput = document.querySelector('.periodEndDate input[type="date"]');

function displayDate() {
    let dates = document.getElementById("savedDates")
    // let startDate = document.createElement("div")
    // let endDate = document.createElement("div")

    periodStartDateInput.addEventListener('input', function (startDate) {
        // startDate.value = start.srcElement.value
        dates.append("Start: ", startDate.srcElement.value)
    });

    periodEndDateInput.addEventListener('input', function (endDate) {
        // endDate.value = end.srcElement.value
        dates.append(" | ", "End: ", endDate.srcElement.value)
        dates.appendChild(document.createElement("br"))
        dates.style.display = "block"
    });
}

displayDate()