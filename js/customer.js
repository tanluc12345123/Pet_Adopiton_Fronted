$(document).ready(function () {
    // $('#dataTable').DataTable();
    if (localStorage.getItem('username') == null) {
        window.location.assign("login.html")
    } else {
        document.getElementById('name').innerHTML = localStorage.getItem('username')
        fetchCustomers()
    }

});

// const url = "https://backend-pet-adoption.herokuapp.com/api/";
const url = "http://localhost:8080/api/";
const fetchCustomers = async () => {
    const request = await fetch(`${url}pets/customers`, {
        headers: {
            'Authorization': localStorage.getItem("token")
        }
    })
    let response = await request.json()
    const arrayCustomers = response["data"];
    var body = '';
    var modalEdit = '';
    var modalDelete = '';
    let i = 1
    for (let customer of arrayCustomers) {
        const arrayPets = customer.pets
        for (let pet of arrayPets) {
            modalDelete += createDeleteModal(pet)
            body += `<tr class= "even"><td>` + i + `</td>`;
            body += `<td class ="sorting_1">` + customer.fullName + `</td>`;
            body += `<td>` + customer.phone + `</td>`;
            body += `<td>` + customer.address + `</td>`;
            body += `<td>` + pet.name + `</td>`;
            body += `<td>` + pet.nameType + `</td>`;
            body += `<td>` + pet.dateAdopt + `</td>`;
            if (pet.statusAdopt == true) {
                body += `<td>Đã nhận nuôi</td>`;
                body += `<td></td>`;
            }
            if (pet.statusAdopt == false) {
                modalEdit += createAcceptModal(pet)
                body += `<td>Chưa nhận nuôi</td>`;
                body += `<td><button class="btn btn-success btn-circle" type="button" data-placement="top" title="Chấp thuận" data-toggle="modal" data-target="#AcceptModal-${pet.id}"><i class="fas fa-check"></i></button>
                <button class="btn btn-danger btn-circle"" type="button" data-placement="top" title="Xoá" data-toggle="modal" data-target="#DeleteModal-${pet.id}"><i class="fas fa-trash"></i></button></td>`;
            }
            i++
        }
    }
    $('body').append(modalEdit)
    $('body').append(modalDelete)
    $(".table-body").append(body)
    $('#dataTable').DataTable();
    console.log(arrayCustomers)
}

function createDeleteModal(pet) {
    let body = `<div class="modal fade" id="DeleteModal-${pet.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Xoá đăng ký nhận nuôi?</h5>
            </div>
            <div class="modal-body">Bạn chắc muốn xoá đăng ký nhận nuôi của khách hàng này?</div>
            <div class="modal-footer">
              <button class="btn btn-secondary" type="button" data-dismiss="modal">Huỷ</button>
                <button class="btn btn-primary" onclick = "deleteRegisterAdoptPet(${pet.id})">Ok</button>
            </div>
        </div>
    </div>
  </div>`;
    return body;
}

function createAcceptModal(pet) {
    let body = `<div class="modal fade" id="AcceptModal-${pet.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Khách hàng đã nhận nuôi?</h5>
            </div>
            <div class="modal-body">Bạn chắc thú cưng đã được nhận nuôi?</div>
            <div class="modal-footer">
              <button class="btn btn-secondary" type="button" data-dismiss="modal">Huỷ</button>
                <button class="btn btn-primary" onclick = "acceptRegisterAdoptPet(${pet.id})">Ok</button>
            </div>
        </div>
    </div>
  </div>`;
    return body;
}

const deleteRegisterAdoptPet = async (petId) => {
    const request = await fetch(`${url}users/pet/${petId}/delete`, {
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

const acceptRegisterAdoptPet = async (petId) => {
    const request = await fetch(`${url}users/pet/${petId}/accept`, {
        headers: {
            'Authorization': localStorage.getItem("token")
        },
        method: 'PUT'
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        alert("Thú cưng đã được nhận nuôi")
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