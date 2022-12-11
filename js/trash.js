$(document).ready(function () {
    // $('#dataTable').DataTable();
    if (localStorage.getItem('username') == null) {
        window.location.assign("login.html")
    } else {
        document.getElementById('name').innerHTML = localStorage.getItem('username')
        fetchPets()
        fetchCaringStaff()
        fetchEquipments()
        fetchDonors()
    }
});

const url = "http://localhost:8080/api/";

const fetchPets = async() => {
const request = await fetch(`${url}nologin/pets?trash=true`)
  let response = await request.json()
  const arrayPet = response["data"];

  var body = '';
  var modalRestore = '';
  var modalDelete = '';
  let i = 1
  for (let pet of arrayPet) {
    modalRestore += createRestoreModal(pet,"Thú cưng", "restorePet")
    modalDelete += createDeleteModal(pet,"Thú cưng", "deletePet")
    body += `<tr class= "even"><td>` + i + `</td>`;
    body += `<td class ="sorting_1">` + pet.name + `</td>`;
    body += `<td>` + pet.nameType + `</td>`;

    if (pet.gender == true) {
      body += `<td>Đực</td>`;

    } else {
      body += `<td>Cái</td>`;
    }
    body += `<td>` + pet.age + `</td>`;
    if (pet.adopted) {
      body += `<td class ="text-center"><input type="checkbox" value="" checked readonly></td>`;
    } else {
      body += `<td class ="text-center"><input type="checkbox" value="" readonly></td>`;
    }

    body += `<td><button class="btn btn-success btn-circle" type="button" data-placement="top" title="Khôi phục" data-toggle="modal" data-target="#RestoreModal-${pet.id}"><i class="fas fa-check"></i></button>
    <button class="btn btn-danger btn-circle"" type="button" data-placement="top" title="Xoá" data-toggle="modal" data-target="#DeleteModal-${pet.id}"><i class="fas fa-trash"></i></button></td>`;
    i++
  }
  $('body').append(modalRestore)
  $('body').append(modalDelete)
  $(".table-body-pet").append(body)
  $('#dataTablePet').DataTable();
}

const fetchCaringStaff = async () => {
    const request = await fetch(`${url}admin/caringStaff?trash=true`,{
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
        modalEdit += createRestoreModal(staff,"Nhân viên chăm sóc", "restoreStaff")
        modalDelete += createDeleteModal(staff,"Nhân viên chăm sóc", "deleteStaff")
        body += `<tr class= "even"><td>` + i + `</td>`;
        body += `<td class ="sorting_1">` + staff.name + `</td>`;
        body += `<td>` + staff.birthDay + `</td>`;
        body += `<td>` + staff.phoneNumber + `</td>`;
        body += `<td>` + staff.identification + `</td>`;

        body += `<td><button class="btn btn-success btn-circle" type="button" data-placement="top" title="Khôi phục" data-toggle="modal" data-target="#RestoreModal-${staff.id}"><i class="fas fa-check"></i></button>
                    <button class="btn btn-danger btn-circle"" type="button" data-placement="top" title="Xoá" data-toggle="modal" data-target="#DeleteModal-${staff.id}"><i class="fas fa-trash"></i></button></td>`;
        i++
    }
    $('body').append(modalEdit)
    $('body').append(modalDelete)
    $(".table-body-staff").append(body)
    $('#dataTableStaff').DataTable();
}

const fetchEquipments = async () => {
    const request = await fetch(`${url}equipments?trash=true`,{
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
        modalEdit += createRestoreModal(equipment,"thiết bị, thức ăn", "restoreEquipment")
        modalDelete += createDeleteModal(equipment,"thiết bị, thức ăn", "deleteEquipment")
        body += `<tr class= "even"><td>` + i + `</td>`;
        body += `<td class ="sorting_1">` + equipment.name + `</td>`;
        body += `<td>` + equipment.quantity + `</td>`;
        body += `<td>` + formatToVND(equipment.purchasePrice) + `</td>`;
        body += `<td>` + equipment.datePurchase + `</td>`;
        body += `<td>` + equipment.status + `</td>`;
        body += `<td><button class="btn btn-success btn-circle" type="button" data-placement="top" title="Khôi phục" data-toggle="modal" data-target="#RestoreModal-${equipment.id}"><i class="fas fa-check"></i></button>
                      <button class="btn btn-danger btn-circle"" type="button" data-placement="top" title="Xoá" data-toggle="modal" data-target="#DeleteModal-${equipment.id}"><i class="fas fa-trash"></i></button></td>`;
        i++
    }
    $('body').append(modalEdit)
    $('body').append(modalDelete)
    $(".table-body-equipment").append(body)
    $('#dataTableEquipment').DataTable();
}

const fetchDonors = async () => {
    const request = await fetch(`${url}donates?trash=true`, {
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
        modalEdit += createRestoreModal(donor,"mạnh thường quân", "restoreDonor")
        modalDelete += createDeleteModal(donor,"mạnh thường quân", "deleteDonor")
        body += `<tr class= "even"><td>` + i + `</td>`;
        body += `<td class ="sorting_1">` + donor.fullName + `</td>`;
        body += `<td>` + formatToVND(donor.donationAmount) + `</td>`;
        body += `<td>` + donor.content + `</td>`;
        body += `<td>` + donor.dateDonate + `</td>`;
        body += `<td><button class="btn btn-success btn-circle" type="button" data-placement="top" title="Khôi phục" data-toggle="modal" data-target="#RestoreModal-${donor.id}"><i class="fas fa-check"></i></button>
                      <button class="btn btn-danger btn-circle"" type="button" data-placement="top" title="Xoá" data-toggle="modal" data-target="#DeleteModal-${donor.id}"><i class="fas fa-trash"></i></button></td>`;
        i++
    }
    $('body').append(modalEdit)
    $('body').append(modalDelete)
    $(".table-body-donor").append(body)
    $('#dataTableDonor').DataTable();
    console.log(arrayDonors)
}

function createRestoreModal(pet, name, func) {
    let body = `<div class="modal fade" id="RestoreModal-${pet.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Khôi phục ${name}</h5>
            </div>
            <div class="modal-body">Bạn chắc muốn khôi phục ${name} này?</div>
            <div class="modal-footer">
              <button class="btn btn-secondary" type="button" data-dismiss="modal">Huỷ</button>
                <button class="btn btn-primary" onclick = "${func}(${pet.id})">Ok</button>
            </div>
        </div>
    </div>
  </div>`;
    return body;
  }

function createDeleteModal(pet, name, func) {
    let body = `<div class="modal fade" id="DeleteModal-${pet.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Xoá ${name}</h5>
            </div>
            <div class="modal-body">Bạn chắc muốn xoá ${name} này vĩnh viễn?</div>
            <div class="modal-footer">
              <button class="btn btn-secondary" type="button" data-dismiss="modal">Huỷ</button>
                <button class="btn btn-primary" onclick = "${func}(${pet.id})">Ok</button>
            </div>
        </div>
    </div>
  </div>`;
    return body;
  }

  const restorePet = async (petId) => {
    const request = await fetch(`${url}pets/${petId}/restore`, {
      headers: {
        'Authorization': localStorage.getItem("token")
      },
      method: 'PUT'
    })
    let response = await request.json()
    if (response['status'] == "ok") {
      alert("Khôi phục thành công")
      window.location.reload()
    }else{
        alert("Khôi phục thất bại")
    }
  }

  const deletePet = async (petId) => {
    const request = await fetch(`${url}pets/${petId}`, {
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

  const restoreStaff = async (staffId) => {
    const request = await fetch(`${url}admin/caringStaff/${staffId}/restore`, {
        headers: {
            'Authorization': localStorage.getItem("token")
        },
        method: 'PUT'
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        alert("Khôi phục thành công")
        window.location.reload()
    }
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

const restoreEquipment = async (equipmentId) => {
    const request = await fetch(`${url}equipments/${equipmentId}/restore`, {
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

const deleteEquipment = async (equipmentId) => {
    const request = await fetch(`${url}equipments/${equipmentId}`, {
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

const restoreDonor = async (donorId) => {
    const request = await fetch(`${url}donates/${donorId}/restore`, {
        headers: {
            'Authorization': localStorage.getItem("token")
        },
        method: 'PUT'
    })
    let response = await request.json()
    if (response['status'] == "ok") {
        alert("Khôi phục thành công")
        window.location.reload()
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

const logout = async () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("expiresAt");
    window.location.assign("login.html");
}

function formatToVND(money) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money)
}