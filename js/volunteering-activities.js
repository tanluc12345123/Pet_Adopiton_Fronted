$(document).ready(function () {
    if (localStorage.getItem('username') == null) {
        window.location.assign("login.html")
    } else {
        document.getElementById('name').innerHTML = localStorage.getItem('username')
        fetchVolunteerings("happening")
        $('#statusVolunteer').on('change', function (e) {
            var status = $('#statusVolunteer').find(":selected").val();
            if (status == 0) {
                fetchVolunteerings("happening")
            }
            if (status == 1) {
                fetchVolunteerings("tookPlace")
            }
            if (status == 2) {
                fetchVolunteerings("cancle")
            }
        })
    }

});

// const url = "https://backend-pet-adoption.herokuapp.com/api/";
const url = "http://localhost:8080/api/";
const fetchVolunteerings = async (status) => {
    var dataTable = $('#dataTable').DataTable()
    dataTable.clear();
    dataTable.draw();
    dataTable.destroy();
    const request = await fetch(`${url}nologin/volunteers/status?status=${status}`)
    let response = await request.json()
    const arrayVolunteers = response["data"];
    var body = '';
    var modalEdit = '';
    var modalDelete = '';
    let i = 1
    for (let volunteers of arrayVolunteers) {
        modalEdit += createModalEdit(volunteers)
        modalDelete += createDeleteModal(volunteers)
        body += `<tr class= "even"><td>` + i + `</td>`;
        body += `<td class ="sorting_1">` + volunteers.name + `</td>`;
        body += `<td>` + volunteers.numberPeople + `</td>`;
        body += `<td>` + volunteers.requirement + `</td>`;
        body += `<td>` + volunteers.dateOfEvent + `</td>`;
        if (volunteers.status == "HAPPENING") {
            body += `<td>Đang diễn ra</td>`;
        }
        if (volunteers.status == "TOOK_PLACE") {
            body += `<td>Đã diễn ra</td>`;
        }
        if (volunteers.status == "CANCEL") {
            body += `<td>Bị huỷ</td>`;
        }
        body += `<td><button class="btn btn-success btn-circle" type="button" data-placement="top" title="Chỉnh sửa" data-toggle="modal" data-target="#EditModal-${volunteers.id}"><i class="fas fa-edit"></i></button>
                      <button class="btn btn-danger btn-circle"" type="button" data-placement="top" title="Huỷ hoạt động" data-toggle="modal" data-target="#DeleteModal-${volunteers.id}"><i class="fas fa-trash"></i></button></td>`;
        i++
    }
    $('body').append(modalEdit)
    $('body').append(modalDelete)
    $(".table-body").append(body)
    $('#dataTable').DataTable();
    console.log(arrayVolunteers)
}

const addVolunteering = async () => {
    const name = document.getElementById('inputName').value;

    const numberPeople = document.getElementById('inputNumberPeople').value;
    const requirement = document.getElementById('inputRequirement').value;
    const description = document.getElementById('inputDescription').value;

    var date = new Date($('#inputDateEvent').val());
    const dateOfEvent = `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;
    console.log(dateOfEvent)

    const image = document.getElementById('avatar');

    const formData = new FormData();
    formData.append('name', name)
    formData.append('numberPeople', numberPeople)
    formData.append('requirement', requirement)
    formData.append('description', description)
    formData.append('dateOfEvent', dateOfEvent)
    formData.append('file', image.files[0])

    console.log(formData)

    const request = await fetch(`${url}volunteers/insert`, {
        headers: {
            'Authorization': localStorage.getItem("token")
        },
        method: 'POST',
        body: formData
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        alert("Tạo hoạt động thành công")
        window.location.reload()
    } else {
        alert("Tạo hoạt động thất bại")
    }
}

function createDeleteModal(volunteer) {
    let body = `<div class="modal fade" id="DeleteModal-${volunteer.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Huỷ hoạt động?</h5>
            </div>
            <div class="modal-body">Bạn chắc muốn hủy hoạt động này?</div>
            <div class="modal-footer">
              <button class="btn btn-secondary" type="button" data-dismiss="modal">Huỷ</button>
                <button class="btn btn-primary" onclick = "deleteVolunteering(${volunteer.id})">Ok</button>
            </div>
        </div>
    </div>
  </div>`;
    return body;
}

function createModalEdit(volunteer) {
    let body = ``;
    body += `<div class="modal fade" id="EditModal-${volunteer.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
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
                            <div class="text-center">
                                <img class="img-fluid" style="width: 10rem;" src="${volunteer.image}" alt="..."
                                    id="imgAvatarUpdate">
                                <input type="file" accept="image/*" name="avatarUpdate" id="avatarUpdate" style="display: none;"
                                    onchange="readURLUpdate(this)">
                                <label for="avatarUpdate"><img class="img-fluid" style="width: 4rem;" src="img/upload.svg"
                                        alt="..."></label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="task_name">Tên hoạt động:</label>
                            <input type="text" class="form-control form-control-user" id="inputNameUpdate" value="${volunteer.name}">
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="task_name">Số lượng người:</label>
                            <input type="number" class="form-control form-control-user" id="inputNumberPeopleUpdate" value = "${volunteer.numberPeople}">
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="task_name">Yêu cầu</label>
                            <textarea class="form-control" id="inputRequirementUpdate">${volunteer.requirement}</textarea>
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="task_name">Ngày diễn ra:</label>
                            <input type="date" class="form-control form-control-user" id="inputDateEventUpdate" value="${volunteer.dateOfEvent}">
                        </div>
                        <div class="form-group">
                            <label class="control-label" for="task_name">Mô tả:</label>
                            <textarea class="form-control" id="inputDescriptionUpdate">${volunteer.description}</textarea>
                        </div>
                        <div class="form-group">
                                <label class="control-label" for="task_name">Trạng thái</label>
                                <select id="statusVolunteerUpdate" name="statusVolunteerUpdate" class="form-control">`;
    if (volunteer.status == "HAPPENING") {
        body += `<option value="0" selected>Đang diễn ra</option>
                                    <option value="1">Đã diễn ra</option>
                                    <option value="2">Bị Huỷ</option>`;

    }
    if (volunteer.status == "TOOK_PLACE") {
        body += `<option value="0" >Đang diễn ra</option>
                                    <option value="1" selected>Đã diễn ra</option>
                                    <option value="2">Bị Huỷ</option>`;
    }
    if (volunteer.status == "CANCEL") {
        body += `<option value="0" >Đang diễn ra</option>
                                    <option value="1">Đã diễn ra</option>
                                    <option value="2" selected>Bị Huỷ</option>`;
    }
    body += `</select>
                            </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Huỷ</button>
                    <input type="button" value="Thay đổi" class="btn btn-primary" onclick="updateVolunteering(${volunteer.id})"/>
                </div></div></div></div>`;
    return body;
}

const updateVolunteering = async (volunteerId) => {
    const name = document.getElementById('inputNameUpdate').value;

    const numberPeople = document.getElementById('inputNumberPeopleUpdate').value;
    const requirement = document.getElementById('inputRequirementUpdate').value;
    const description = document.getElementById('inputDescriptionUpdate').value;
    var statusUpdate = "";
    var status = $('#statusVolunteerUpdate').find(":selected").val();
    if (status == 0) {
        statusUpdate = "happening"
    }
    if (status == 1) {
        statusUpdate = "took place"
    }
    if (status == 2) {
        statusUpdate = "cancle"
    }

    var date = new Date($('#inputDateEventUpdate').val());
    const dateOfEvent = `${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}`;
    console.log(dateOfEvent)

    const image = document.getElementById('avatarUpdate');

    const formData = new FormData();
    formData.append('name', name)
    formData.append('numberPeople', numberPeople)
    formData.append('requirement', requirement)
    formData.append('description', description)
    formData.append('dateOfEvent', dateOfEvent)
    formData.append('status', statusUpdate)
    formData.append('file', image.files[0])
    console.log(image.files[0])
    const request = await fetch(`${url}volunteers/${volunteerId}`, {
        headers: {
            'Authorization': localStorage.getItem("token")
        },
        method: 'PUT',
        body: formData
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        alert("Cập nhật hoạt động thành công")
        window.location.reload()
    } else {
        alert("Cập nhật hoạt động thất bại")
    }

}

const deleteVolunteering = async (volunteerId) => {
    const request = await fetch(`${url}volunteers/cancel/${volunteerId}`, {
        headers: {
            'Authorization': localStorage.getItem("token")
        },
        method: 'PUT'
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        alert("Huỷ thành công")
        window.location.reload()
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

const logout = async () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("expiresAt");
    window.location.assign("login.html");
}