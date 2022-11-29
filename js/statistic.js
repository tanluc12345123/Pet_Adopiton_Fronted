$(document).ready(function () {
    // $('#dataTable').DataTable();
    // fetchVolunteers()
    if (localStorage.getItem('username') == null) {
        window.location.assign("login.html")
    } else {
        document.getElementById('name').innerHTML = localStorage.getItem('username')
        var now = new Date();
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var today = now.getFullYear() + "-" + (month);
        document.getElementById('inputMonth').max = today
        document.getElementById('inputMonth').value = today
        fetchStatistic(formatMonth(document.getElementById('inputMonth').value))
        document.getElementById('inputMonth').onchange = function () {
            fetchStatistic(formatMonth(this.value))
        }
    }
});

const url = "https://backend-pet-adoption.herokuapp.com/api/";
// const url = "http://localhost:8080/api/";

function formatMonth(currentMonth) {
    year = currentMonth.slice(0, 4)
    month = currentMonth.slice(5)
    return month + "/" + year
}

const fetchStatistic = async (month) => {
    const request = await fetch(`${url}statistic?month=${month}`,{
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