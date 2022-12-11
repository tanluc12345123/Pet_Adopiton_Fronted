$(document).ready(function () {
    // $('#dataTable').DataTable();
    if (localStorage.getItem('username') == null) {
        window.location.assign("login.html")
    }else{
        document.getElementById('name').innerHTML = localStorage.getItem('username')
        fetchEquipments()
    }
});

// const url = "https://backend-pet-adoption.herokuapp.com/api/";
const url = "http://localhost:8080/api/";
const fetchEquipments = async () => {
    const request = await fetch(`${url}equipments?trash=false`,{
        headers: {
            'Authorization': localStorage.getItem("token")
        },
    })
    let response = await request.json()
    const arrayEquipments = response["data"];
    var body = '';
    var modalEdit = '';
    var modalDelete = '';
    let i = 1
    for (let equipment of arrayEquipments) {
        modalEdit += createModalEdit(equipment)
        modalDelete += createDeleteModal(equipment)
        body += `<tr class= "even"><td>` + i + `</td>`;
        body += `<td class ="sorting_1">` + equipment.name + `</td>`;
        body += `<td>` + equipment.quantity + `</td>`;
        body += `<td>` + formatToVND(equipment.purchasePrice) + `</td>`;
        body += `<td>` + equipment.datePurchase + `</td>`;
        body += `<td>` + equipment.status + `</td>`;
        body += `<td><button class="btn btn-success btn-circle" type="button" data-placement="top" title="Chỉnh sửa" data-toggle="modal" data-target="#EditModal-${equipment.id}"><i class="fas fa-edit"></i></button>
                      <button class="btn btn-danger btn-circle"" type="button" data-placement="top" title="Xoá" data-toggle="modal" data-target="#DeleteModal-${equipment.id}"><i class="fas fa-trash"></i></button></td>`;
        i++
    }
    $('body').append(modalEdit)
    $('body').append(modalDelete)
    $(".table-body").append(body)
    $('#dataTable').DataTable();
    console.log(arrayEquipments)
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imgAvatar').attr('src', e.target.result).width(150).height(200);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function readURLUpdate(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imgAvatarUpdate').attr('src', e.target.result).width(150).height(200);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

const addEquipment = async () => {
    const name = document.getElementById('inputName').value;

    const quantity = document.getElementById('inputQuantity').value;
    const purchasePrice = document.getElementById('inputPurchasePrice').value;
    const status = document.getElementById('inputStatus').value;

    var date = new Date($('#inputDatePurchase').val());
    const datePurchase = `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;
    console.log(datePurchase)

    const image = document.getElementById('avatar');

    const formData = new FormData();
    formData.append('name', name)
    formData.append('quantity', quantity)
    formData.append('purchasePrice', purchasePrice)
    formData.append('status', status)
    formData.append('datePurchase', datePurchase)
    formData.append('file', image.files[0])

    console.log(formData)

    const request = await fetch(`${url}equipments/insert`, {
        headers: {
            'Authorization': localStorage.getItem("token")
        },
        method: 'POST',
        body: formData
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        alert("Tạo trang thiết bị, thức ăn thành công")
        window.location.reload()
    } else {
        alert("Tạo trang thiết bị, thức ăn thất bại")
    }
}

function createDeleteModal(equipment) {
    let body = `<div class="modal fade" id="DeleteModal-${equipment.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Xoá thiết bị, thức ăn?</h5>
            </div>
            <div class="modal-body">Bạn chắc muốn xoá thiết bị này?</div>
            <div class="modal-footer">
              <button class="btn btn-secondary" type="button" data-dismiss="modal">Huỷ</button>
                <button class="btn btn-primary" onclick = "deleteEquipment(${equipment.id})">Ok</button>
            </div>
        </div>
    </div>
  </div>`;
    return body;
}

function createModalEdit(equipment) {
    let body = ``;
    body += `<div class="modal fade" id="EditModal-${equipment.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Chỉnh sửa thông tin trang thiết bị, thức ăn</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form class="user" enctype="multipart/form-data" method="POST">
                        <div class="form-group">
                            <div class="text-center">
                                <img class="img-fluid" style="width: 10rem;" src="${equipment.image}" alt="..."
                                    id="imgAvatarUpdate">
                                <input type="file" accept="image/*" name="avatarUpdate" id="avatarUpdate" style="display: none;"
                                    onchange="readURLUpdate(this)">
                                <label for="avatarUpdate"><img class="img-fluid" style="width: 4rem;" src="img/upload.svg"
                                        alt="..."></label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="task_name">Tên thiết bị, thức ăn:</label>
                            <input type="text" class="form-control form-control-user" id="inputNameUpdate" value="${equipment.name}">
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="task_name">Số lượng:</label>
                            <input type="number" class="form-control form-control-user" id="inputQuantityUpdate" value="${equipment.quantity}">
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="task_name">Tổng tiền mua:</label>
                            <input type="number" class="form-control form-control-user" id="inputPurchasePriceUpdate" value="${equipment.purchasePrice}">
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="task_name">Ngày mua:</label>
                            <input type="date" class="form-control form-control-user" id="inputDatePurchaseUpdate" value="${equipment.datePurchase}">
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="task_name">Trạng thái:</label>
                            <input type="text" class="form-control form-control-user" id="inputStatusUpdate" value="${equipment.status}">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Huỷ</button>
                    <input type="button" value="Thay đổi" class="btn btn-primary" onclick="updateEquipment(${equipment.id})"/>
                </div></div></div></div>`;
    return body;
} 

const updateEquipment = async(equipmentId) => {
    const name = document.getElementById('inputNameUpdate').value;

    const quantity = document.getElementById('inputQuantityUpdate').value;
    const purchasePrice = document.getElementById('inputPurchasePriceUpdate').value;
    const status = document.getElementById('inputStatusUpdate').value;

    var date = new Date($('#inputDatePurchaseUpdate').val());
    const datePurchase = `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;
    console.log(datePurchase)

    const image = document.getElementById('avatarUpdate');

    const formData = new FormData();
    formData.append('name', name)
    formData.append('quantity', quantity)
    formData.append('purchasePrice', purchasePrice)
    formData.append('status', status)
    formData.append('datePurchase', datePurchase)
    formData.append('file', image.files[0])
    const request = await fetch(`${url}equipments/${equipmentId}`, {
        headers: {
            'Authorization': localStorage.getItem("token")
        },
        method: 'PUT',
        body: formData
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        alert("Cập nhật thiết bị thành công")
        window.location.reload()
    } else {
        alert("Cập nhật thiết bị thất bại")
    }

}

const deleteEquipment = async (equipmentId) => {
    const request = await fetch(`${url}equipments/${equipmentId}/trash`, {
        headers: {
            'Authorization': localStorage.getItem("token")
        },
        method: 'PUT'
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