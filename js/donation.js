$(document).ready(function () {
    if (localStorage.getItem('username') == null) {
        window.location.assign("login.html")
    } else {
        document.getElementById('name').innerHTML = localStorage.getItem('username')
        fetchDonors()
    }

    // $('#dataTable').DataTable();
});
// const url = "https://backend-pet-adoption.herokuapp.com/api/";
const url = "http://localhost:8080/api/";
const fetchDonors = async () => {
    const request = await fetch(`${url}donates?trash=false`, {
        headers: {
            'Authorization': localStorage.getItem("token")
        },
    })
    let response = await request.json()
    const arrayDonors = response["data"];
    var body = '';
    var modalEdit = '';
    var modalDelete = '';
    let i = 1
    for (let donor of arrayDonors) {
        modalEdit += createModalEdit(donor)
        modalDelete += createDeleteModal(donor)
        body += `<tr class= "even"><td>` + i + `</td>`;
        body += `<td class ="sorting_1">` + donor.fullName + `</td>`;
        body += `<td>` + formatToVND(donor.donationAmount) + `</td>`;
        body += `<td>` + donor.content + `</td>`;
        body += `<td>` + donor.dateDonate + `</td>`;
        body += `<td><button class="btn btn-success btn-circle" type="button" data-placement="top" title="Chỉnh sửa" data-toggle="modal" data-target="#EditModal-${donor.id}"><i class="fas fa-edit"></i></button>
                      <button class="btn btn-danger btn-circle"" type="button" data-placement="top" title="Xoá" data-toggle="modal" data-target="#DeleteModal-${donor.id}"><i class="fas fa-trash"></i></button></td>`;
        i++
    }
    $('body').append(modalEdit)
    $('body').append(modalDelete)
    $(".table-body").append(body)
    $('#dataTable').DataTable();
    console.log(arrayDonors)
}

const addDonor = async () => {
    const name = document.getElementById('inputName').value;
    const amount = document.getElementById('inputAmount').value;
    const content = document.getElementById('inputContent').value;

    const dateDonate = new Date($('#inputDate').val());

    const form = {
        fullName: name.trim(),
        donationAmount: amount.trim(),
        content: content.trim(),
        dateDonate: dateDonate,
    }
    const request = await fetch(`${url}donates/insert`, {
        method: 'POST',
        headers: {
            'Authorization': localStorage.getItem("token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        alert("Tạo mạnh thường quân thành công")
        window.location.reload()
    } else {
        alert("Tạo mạnh thường quân thất bại")
    }
}

function createDeleteModal(donor) {
    let body = `<div class="modal fade" id="DeleteModal-${donor.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Xoá mạnh thường quân</h5>
            </div>
            <div class="modal-body">Bạn chắc muốn xoá mạnh thường quân này?</div>
            <div class="modal-footer">
              <button class="btn btn-secondary" type="button" data-dismiss="modal">Huỷ</button>
                <button class="btn btn-primary" onclick = "deleteDonor(${donor.id})">Ok</button>
            </div>
        </div>
    </div>
  </div>`;
    return body;
}

function createModalEdit(donor) {
    let body = ``;
    body += `<div class="modal fade" id="EditModal-${donor.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Chỉnh sửa thông tin mạnh thường quân</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form class="user" enctype="multipart/form-data" method="POST">
                        <div class="form-group">
                            <label class="control-label" for="task_name">Tên mạnh thường quân:</label>
                            <input type="text" class="form-control form-control-user" id="inputNameUpdate" value="${donor.fullName}">
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="task_name">Số tiền ủng hộ:</label>
                            <input type="number" class="form-control form-control-user" id="inputAmountUpdate" value = "${donor.donationAmount}">
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="task_name">Nội dung:</label>
                            <textarea class="form-control" id="inputContentUpdate">${donor.content}</textarea>
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="task_name">Ngày ủng hộ:</label>
                            <input type="date" class="form-control form-control-user" id="inputDateUpdate" value="${donor.dateDonate}">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Huỷ</button>
                    <input type="button" value="Thay đổi" class="btn btn-primary" onclick="updateDonor(${donor.id})"/>
                </div></div></div></div>`;
    return body;
}

const updateDonor = async (donorId) => {
    const name = document.getElementById('inputNameUpdate').value;
    const amount = document.getElementById('inputAmountUpdate').value;
    const content = document.getElementById('inputContentUpdate').value;

    const dateDonate = new Date($('#inputDateUpdate').val());
    const form = {
        fullName: name.trim(),
        donationAmount: amount.trim(),
        content: content.trim(),
        dateDonate: dateDonate,
    }
    const request = await fetch(`${url}donates/${donorId}`, {
        method: 'PUT',
        headers: {
            'Authorization': localStorage.getItem("token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        alert("Cập nhật mạnh thường quân thành công")
        window.location.reload()
    } else {
        alert("Cập nhật mạnh thường quân thất bại")
    }

}

const deleteDonor = async (donorId) => {
    const request = await fetch(`${url}donates/${donorId}`, {
        headers: {
            'Authorization': localStorage.getItem("token")
        },
        method: 'DELETE'
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        alert("Xoá thành công")
        window.location.reload()
    }
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