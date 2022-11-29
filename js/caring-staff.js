// Call the dataTables jQuery plugin
const url = "https://backend-pet-adoption.herokuapp.com/api/";
// const url = "http://localhost:8080/api/";
const fetchCaringStaff = async () => {
    const request = await fetch(`${url}admin/caringStaff`,{
        headers: {
            'Authorization': localStorage.getItem("token")
        }
    })
    let response = await request.json()
    const arrayCaringStaff = response["data"];
    var body = '';
    var modalEdit = '';
    var modalDelete = '';
    let i = 1
    for (let staff of arrayCaringStaff) {
        modalEdit += createModalEdit(staff)
        modalDelete += createDeleteModal(staff)
        body += `<tr class= "even"><td>` + i + `</td>`;
        body += `<td class ="sorting_1">` + staff.name + `</td>`;
        body += `<td>` + staff.birthDay + `</td>`;
        body += `<td>` + staff.phoneNumber + `</td>`;
        body += `<td>` + staff.identification + `</td>`;

        body += `<td><button class="btn btn-success btn-circle" type="button" data-placement="top" title="Chỉnh sửa" data-toggle="modal" data-target="#EditModal-${staff.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-circle"" type="button" data-placement="top" title="Xoá" data-toggle="modal" data-target="#DeleteModal-${staff.id}"><i class="fas fa-trash"></i></button></td>`;
        i++
    }
    $('body').append(modalEdit)
    $('body').append(modalDelete)
    $(".table-body").append(body)
    $('#dataTable').DataTable();
    console.log(arrayCaringStaff)
}

function createModalEdit(staff) {
    let body = ``;
    body += `<div class="modal fade" id="EditModal-${staff.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Chỉnh sửa thông tin nhân viên chăm sóc</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form class="user" enctype="multipart/form-data" method="POST">
                        <div class="form-group">
                            <div class="text-center">
                                <img class="img-fluid" style="width: 10rem;" src="${staff.avatar}" alt="..."
                                    id="imgAvatarUpdate">
                                <input type="file" accept="image/*" name="avatarUpdate" id="avatarUpdate" style="display: none;"
                                    onchange="readURLUpdate(this)">
                                <label for="avatarUpdate"><img class="img-fluid" style="width: 4rem;" src="img/upload.svg"
                                        alt="..."></label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="task_name">Tên nhân viên:</label>
                            <input type="text" class="form-control form-control-user" id="inputUpdateName" value="${staff.name}">
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="task_name">Ngày sinh</label>
                            <input type="date" class="form-control form-control-user" id="inputUpdateBirthDay" value ="${staff.birthDay}">
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="task_name">Số điện thoại:</label>
                            <input type="text" class="form-control form-control-user" id="inputUpdatePhoneNumber" value="${staff.phoneNumber}">
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="task_name">CCCD:</label>
                            <input type="text" class="form-control form-control-user" id="inputUpdateIdentification" value="${staff.identification}">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Huỷ</button>
                    <input type="button" value="Thay đổi" class="btn btn-primary" onclick="updateStaff(${staff.id})"/>
                </div></div></div></div>`;
    return body;
}

function createDeleteModal(staff) {
    let body = `<div class="modal fade" id="DeleteModal-${staff.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Xoá nhân viên chăm sóc</h5>
            </div>
            <div class="modal-body">Bạn chắc muốn xoá nhân viên chăm sóc này?</div>
            <div class="modal-footer">
              <button class="btn btn-secondary" type="button" data-dismiss="modal">Huỷ</button>
                <button class="btn btn-primary" onclick = "deleteStaff(${staff.id})">Ok</button>
            </div>
        </div>
    </div>
  </div>`;
    return body;
}

const deleteStaff = async (staffId) => {
    const request = await fetch(`${url}admin/caringStaff/${staffId}`, {
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

const updateStaff = async (staffId) => {
    const name = document.getElementById('inputUpdateName').value;

    const phoneNumber = document.getElementById('inputUpdatePhoneNumber').value;
    const identification = document.getElementById('inputUpdateIdentification').value;

    var date = new Date($('#inputUpdateBirthDay').val());
    const birthDay = `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;
    console.log(birthDay)

    const image = document.getElementById('avatarUpdate');

    const formData = new FormData();
    formData.append('name', name)
    formData.append('birthDay', birthDay)
    formData.append('phoneNumber', phoneNumber)
    formData.append('identification', identification)
    formData.append('file', image.files[0])

    const request = await fetch(`${url}admin/caringStaff/${staffId}`, {
        headers: {
            'Authorization': localStorage.getItem("token")
        },
        method: 'PUT',
        body: formData
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        alert("Cập nhật nhân viên thành công")
        window.location.reload()
    } else {
        alert("Tạo nhật viên thất bại")
    }
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

const addStaff = async () => {
    const name = document.getElementById('inputName').value;

    const phoneNumber = document.getElementById('inputPhoneNumber').value;
    const identification = document.getElementById('inputIdentification').value;

    var date = new Date($('#inputBirthDay').val());
    const birthDay = `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;
    console.log(birthDay)

    const image = document.getElementById('avatar');

    const formData = new FormData();
    formData.append('name', name)
    formData.append('birthDay', birthDay)
    formData.append('phoneNumber', phoneNumber)
    formData.append('identification', identification)
    formData.append('file', image.files[0])

    console.log(formData)

    const request = await fetch(`${url}admin/caringStaff/create`, {
        headers: {
            'Authorization': localStorage.getItem("token")
        },
        method: 'POST',
        body: formData
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        alert("Tạo nhân viên thành công")
        window.location.reload()
    } else {
        alert("Tạo nhân viên thất bại")
    }
}

$(document).ready(function () {
    if (localStorage.getItem('username') == null) {
        window.location.assign("login.html")
    }else{
        document.getElementById('name').innerHTML = localStorage.getItem('username')
        fetchCaringStaff()
    }
    
    // $('#dataTable').DataTable();
});

const logout = async () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("expiresAt");
    window.location.assign("login.html");
}
