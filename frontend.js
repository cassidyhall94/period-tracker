const periodStartDateInput = document.querySelector('.periodStartDate input[type="date"]');
const periodEndDateInput = document.querySelector('.periodEndDate input[type="date"]');



function displayDate(start, end) {
    console.log(start, end)
    let dates = document.querySelector('.savedDates')
    let startDate = document.createElement("div")
    let endDate = document.createElement("div")

    periodStartDateInput.addEventListener('input', function () {
        // console.log(start)
        startDate.value = start
        // console.log(startDate.value)
        dates.appendChild(startDate)
    });

    periodEndDateInput.addEventListener('input', function () {
        // console.log(end)
        endDate.value = end
        // console.log(endDate.value)
        dates.appendChild(endDate)
    });
    // console.log(dates)
}

displayDate(periodStartDateInput.value, periodEndDateInput.value)