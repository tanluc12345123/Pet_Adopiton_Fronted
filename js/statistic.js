$(document).ready(function () {
    // $('#dataTable').DataTable();
    // fetchVolunteers()
    if (localStorage.getItem('username') == null) {
        window.location.assign("login.html")
    } else {
        document.getElementById('name').innerHTML = localStorage.getItem('username')
        fetchStatistic()
        var now = new Date();
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var today = now.getFullYear() + "-" + (month);
        document.getElementById('inputMonth').max = today
        document.getElementById('inputMonth').value = today
        fetchStatisticByMonth(formatMonth(document.getElementById('inputMonth').value))
        document.getElementById('inputMonth').onchange = function () {
            fetchStatisticByMonth(formatMonth(this.value))
        }
        let startYear = 1800;
        let endYear = new Date().getFullYear();
        listYear = '';
        for (i = endYear; i > startYear; i--) {
            listYear += `<option value="${i}">${i}</option>`;
        }
        $('#yearSelect').append(listYear)
        $('#yearSelectYear').append(listYear)
        let month2 = new Date().getMonth() + 1;
        let quarter = 0;
        arr1 = [1, 2, 3]
        arr2 = [4, 5, 6]
        arr3 = [7, 8, 9]
        arr4 = [10, 11, 12]
        if (arr1.indexOf(month2) != -1) {
            quarter = 1
        }
        if (arr2.indexOf(month2) != -1) {
            quarter = 2
        }
        if (arr3.indexOf(month2) != -1) {
            quarter = 3
        }
        if (arr4.indexOf(month2) != -1) {
            quarter = 4
        }
        $('#quarterSelect').val(quarter).change()
        fetchStatisticByQuarter($('#quarterSelect').find(":selected").val(), endYear)
        fetchStatisticByYear(endYear)
        $('#btnStatistic').click(function () {
            let q = $('#quarterSelect').find(":selected").val()
            let y = $('#yearSelect').find(":selected").val()
            fetchStatisticByQuarter(q, y)
        })
        $('#yearSelectYear').change(function () {
            let y = $('#yearSelectYear').find(":selected").val()
            fetchStatisticByYear(y)
        })
    }
});

// const url = "https://backend-pet-adoption.herokuapp.com/api/";
const url = "http://localhost:8080/api/";

function formatMonth(currentMonth) {
    year = currentMonth.slice(0, 4)
    month = currentMonth.slice(5)
    return month + "/" + year
}

const fetchStatistic = async () => {
    const request = await fetch(`${url}nologin/statistic`)
    let response = await request.json()
    if (response['status'] == "ok") {
        const statistic = response['data']
        document.getElementById('petAdoptedStatistic').innerHTML = statistic.numberPetAdopt
        document.getElementById('petNoAdoptedStatistic').innerHTML = statistic.numberPetNoAdopt
        document.getElementById('totalDonationStatistic').innerHTML = formatToVND(statistic.totalDonation)
        document.getElementById('totalExpenditureStatistic').innerHTML = formatToVND(statistic.totalExpenditure)
    }
    console.log(response['data'])
}

const fetchStatisticByMonth = async (month) => {
    console.log(month)
    const request = await fetch(`${url}statistic?month=${month}`, {
        headers: {
            'Authorization': localStorage.getItem("token")
        },
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        const statistic = response['data']
        document.getElementById('petAdopted').innerHTML = statistic.numberPetAdopt
        document.getElementById('petNoAdopted').innerHTML = statistic.numberPetNoAdopt
        document.getElementById('totalDonation').innerHTML = formatToVND(statistic.totalDonation)
        document.getElementById('totalExpenditure').innerHTML = formatToVND(statistic.totalExpenditure)
    }
    console.log(response['data'])
}

const fetchStatisticByQuarter = async (quarter, year) => {
    const request = await fetch(`${url}statistic/quarter?quarter=${quarter}&year=${year}`, {
        headers: {
            'Authorization': localStorage.getItem("token")
        },
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        const statistic = response['data']
        document.getElementById('petAdoptedQuarter').innerHTML = statistic.numberPetAdopt
        document.getElementById('petNoAdoptedQuarter').innerHTML = statistic.numberPetNoAdopt
        document.getElementById('totalDonationQuarter').innerHTML = formatToVND(statistic.totalDonation)
        document.getElementById('totalExpenditureQuarter').innerHTML = formatToVND(statistic.totalExpenditure)
    }
    console.log(response['data'])
}

const fetchStatisticByYear = async (year) => {
    const request = await fetch(`${url}statistic/year?year=${year}`, {
        headers: {
            'Authorization': localStorage.getItem("token")
        },
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        const statistic = response['data']
        document.getElementById('petAdoptedYear').innerHTML = statistic.numberPetAdopt
        document.getElementById('petNoAdoptedYear').innerHTML = statistic.numberPetNoAdopt
        document.getElementById('totalDonationYear').innerHTML = formatToVND(statistic.totalDonation)
        document.getElementById('totalExpenditureYear').innerHTML = formatToVND(statistic.totalExpenditure)
    }
    console.log(response['data'])
}

function formatToVND(money) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money)
}

const logout = async () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("expiresAt");
    window.location.assign("login.html");
}