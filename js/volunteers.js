$(document).ready(function () {
    // $('#dataTable').DataTable();
    if (localStorage.getItem('username') == null) {
        window.location.assign("login.html")
    } else {
        document.getElementById('name').innerHTML = localStorage.getItem('username')
        fetchVolunteers()
    }
});

// const url = "https://backend-pet-adoption.herokuapp.com/api/";
const url = "http://localhost:8080/api/";
const fetchVolunteers = async () => {
    const request = await fetch(`${url}volunteers/customers`,{
        headers: {
            'Authorization': localStorage.getItem("token")
        },
    })
    let response = await request.json()
    const arrayVolunteers = response["data"];
    var body = '';
    var modalEdit = '';
    var modalDelete = '';
    let i = 1
    for (let volunteer of arrayVolunteers) {
        const arrayVolunterring = volunteer.volunteers
        for (let volunteering of arrayVolunterring) {
            modalDelete += createDeleteModal(volunteer, volunteering)
            body += `<tr class= "even"><td>` + i + `</td>`;
            body += `<td class ="sorting_1">` + volunteer.fullName + `</td>`;
            if (volunteer.gender == true) {
                body += `<td>Nam</td>`;
            }
            if (volunteer.gender == false) {
                body += `<td>Nữ</td>`;
            }
            body += `<td>` + volunteer.phone + `</td>`;
            body += `<td>` + volunteer.address + `</td>`;
            body += `<td>` + volunteering.name + `</td>`;
            if (volunteering.status == "HAPPENING") {
                body += `<td>Đang diễn ra</td>`;
            }
            if (volunteering.status == "TOOK_PLACE") {
                body += `<td>Đã diễn ra</td>`;
            }
            if (volunteering.status == "CANCEL") {
                body += `<td>Bị huỷ</td>`;
            }
            body += `<td><button class="btn btn-danger btn-circle"" type="button" data-placement="top" title="Xoá" data-toggle="modal" data-target="#DeleteModal-${volunteer.id}-${volunteering.id}"><i class="fas fa-trash"></i></button></td>`;
            i++
        }
    }
    $('body').append(modalDelete)
    $(".table-body").append(body)
    $('#dataTable').DataTable();
    console.log(arrayVolunteers)
}

function createDeleteModal(volunteer, volunteering) {
    let body = `<div class="modal fade" id="DeleteModal-${volunteer.id}-${volunteering.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Xoá tình nguyện viên?</h5>
            </div>
            <div class="modal-body">Bạn chắc muốn xoá tình nguyện viên này?</div>
            <div class="modal-footer">
              <button class="btn btn-secondary" type="button" data-dismiss="modal">Huỷ</button>
                <button class="btn btn-primary" onclick = "deleteRegisterVolunteering(${volunteer.id},${volunteering.id})">Ok</button>
            </div>
        </div>
    </div>
  </div>`;
    return body;
}

const deleteRegisterVolunteering = async (volunteerId, volunteeringId) => {
    const request = await fetch(`${url}users/${volunteerId}/volunteers/${volunteeringId}/delete`, {
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

const logout = async () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("expiresAt");
    window.location.assign("login.html");
}