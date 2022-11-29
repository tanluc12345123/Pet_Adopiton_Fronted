$(document).ready(function () {
    if (localStorage.getItem('username') == null) {
        window.location.assign("login.html")
    } else {
        document.getElementById('name').innerHTML = localStorage.getItem('username')
        fetchTypePet()
        fetchTypePet2()
        fetchSchedulePet(1)
        $('#typePet').on('change', function (e) {
            var id = $('#typePet').find(":selected").val();
            fetchSchedulePet(id)
        })
    }
});

const url = "https://backend-pet-adoption.herokuapp.com/api/";
// const url = "http://localhost:8080/api/";

const fetchTypePet = async () => {
    const requestType = await fetch(`${url}nologin/types`)
    let responseType = await requestType.json()
    const arrayType = responseType["data"];
    var selectList = ``;
    for (let type of arrayType) {
        selectList += `<option value="${type.id}">${type.nameType}</option>`
    }
    $('#typePet').append(selectList)

}

const fetchTypePet2 = async () => {
    const requestType = await fetch(`${url}petSchedule/types`,{
        headers: {
            'Authorization': localStorage.getItem("token")
        },
    })
    let responseType = await requestType.json()
    const arrayType = responseType["data"];
    var selectList = ``;
    for (let type of arrayType) {
        selectList += `<option value="${type.id}">${type.nameType}</option>`
    }
    $('#typePet2').append(selectList)
}

const fetchSchedulePet = async (typeId) => {
    const request = await fetch(`${url}petSchedule/${typeId}`,{
        headers: {
            'Authorization': localStorage.getItem("token")
        },
    })
    let response = await request.json()
    var modalEdit = '';
    if (response['data'] != null) {
        modalEdit = createModalEdit(response['data'].id)
        $('#description').empty()
        $('#description').append(`<md-block>${response['data'].description}</md-block>`)
        $('body').append(modalEdit)
        $('#inputDescriptionUpdate').empty()
        $('#inputDescriptionUpdate').append(response['data'].description)
        document.getElementById('inputTypePet').value = response['data'].type_name
    } else {
        $('#description').empty()
        $('#description').append("Lịch trình chưa được thêm")
        document.getElementById('editModal').remove()
    }

}

const addSchedulePet = async () => {
    const type = document.getElementById('typePet2').value;
    const description = document.getElementById('inputDescription').value;

    const form = {
        description: description.trim()
    }
    const request = await fetch(`${url}petSchedule/types/${type}`, {
        method: 'POST',
        headers: {
            'Authorization': localStorage.getItem("token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        alert("Tạo lịch trình thành công")
        window.location.reload()
    } else {
        alert("Tạo lịch trình thất bại")
    }
}

function createModalEdit(petScheduleId) {
    let body = ``;
    body += `<div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Chỉnh sửa lịch trình</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                <form class="user" enctype="multipart/form-data" method="POST">
                <div class="form-group">
                    <label class="control-label" for="task_name">Loại thú cưng:</label>
                    <input type="text" class="form-control form-control-user" id="inputTypePet" value="" readonly>
                </div>
                <div class="form-group">
                    <label class="control-label" for="task_name">Mô tả:</label>
                    <textarea class="form-control" id="inputDescriptionUpdate" style="height: 200px;"></textarea>
                </div>
            </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Huỷ</button>
                    <input type="button" value="Thay đổi" class="btn btn-primary" onclick="updatePetSchedule(${petScheduleId})"/>
                </div></div></div></div>`;
    return body;
}

const updatePetSchedule = async (petScheduleId) => {
    const description = document.getElementById('inputDescriptionUpdate').value;

    const form = {
        description: description.trim(),
    }
    const request = await fetch(`${url}petSchedule/${petScheduleId}`, {
        method: 'PUT',
        headers: {
            'Authorization': localStorage.getItem("token"),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        alert("Cập nhật lịch trình thành công")
        window.location.reload()
    } else {
        alert("Cập nhật lịch trình quân thất bại")
    }

}

const logout = async () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("expiresAt");
    window.location.assign("login.html");
}