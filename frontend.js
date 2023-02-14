const periodStartDateInput = document.querySelector('.periodStartDate input[type="date"]');
const periodEndDateInput = document.querySelector('.periodEndDate input[type="date"]');

function displayDate() {
    let dates = document.getElementById("savedDates")
    let startDate = document.createElement("div")
    let endDate = document.createElement("div")

    periodStartDateInput.addEventListener('input', function (start) {
        startDate.value = start.srcElement.value
        dates.append("Start: ", startDate.value, "\n")
    });

    periodEndDateInput.addEventListener('input', function (end) {
        endDate.value = end.srcElement.value
        dates.append("End: ", endDate.value, "\n")
    });
}

displayDate()