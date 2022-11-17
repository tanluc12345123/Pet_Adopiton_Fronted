// Call the dataTables jQuery plugin
$(document).ready(function () {
  newfunction();
  fetchTypePet()
});
const url = "https://backend-pet-adoption.herokuapp.com/api/";

const fetchTypePet = async () => {
  const requestType = await fetch(`${url}types`)
  let responseType = await requestType.json()
  const arrayType = responseType["data"];
  var selectList = ``;
  for (let type of arrayType) {
    selectList += `<option value="${type.id}">${type.nameType}</option>`
  }
  $('#typePet').append(selectList)
}

const addPet = async () => {
  const name = document.getElementById('inputNamePet').value
  const type = document.getElementById('typePet').value

  const gender = document.getElementById('genderPet').value

  const color = document.getElementById('inputColor').value
  const age = document.getElementById('inputAge').value
  const weight = document.getElementById('inputWeight').value
  const description = document.getElementById('inputDescription').value

  var genderPet = false;

  if (gender == 1) {
    genderPet = true
  }

  const pet = {
    name: name.trim(),
    gender: genderPet,
    color: color.trim(),
    age: age.trim(),
    weight: weight.trim(),
    description: description.trim(),
  };
  const request = await fetch(`${url}pets/types/${type}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pet)
  })
  const response = await request.json();
  if (response['status'] == "ok") {
    alert("Thêm thành công")
    window.location.reload()
  } else {
    alert("Thêm thất bại")
  }
}

async function newfunction() {

  const request = await fetch(`${url}pets`)
  let response = await request.json()
  const arrayPet = response["data"];

  const requestType = await fetch(`${url}types`)
  let responseType = await requestType.json()
  const arrayType = responseType["data"];
  var body = '';
  var modalEdit = '';
  var modalDelete = '';
  let i = 1
  for (let pet of arrayPet) {
    modalEdit += createModalEdit(pet, arrayType)
    modalDelete += createDeleteModal(pet)
    body += `<tr class= "even"><td>` + i + `</td>`;
    body += `<td class ="sorting_1">` + pet.name + `</td>`;
    body += `<td>` + pet.nameType + `</td>`;

    if (pet.gender == true) {
      body += `<td>Đực</td>`;

    } else {
      body += `<td>Cái</td>`;
    }
    body += `<td>` + pet.age + `</td>`;
    body += `<td class ="text-center"><input type="checkbox" value="" id="flexCheck${pet.id}"></td>`;
    body += `<td><button class="btn btn-success btn-circle" type="button" data-placement="top" title="Chỉnh sửa" data-toggle="modal" data-target="#EditModal-${pet.id}"><i class="fas fa-edit"></i></button>
    <button class="btn btn-danger btn-circle"" type="button" data-placement="top" title="Xoá" data-toggle="modal" data-target="#DeleteModal-${pet.id}"><i class="fas fa-trash"></i></button></td>`;
    i++
  }
  $('body').append(modalEdit)
  $('body').append(modalDelete)
  $(".table-body").append(body)
  $('#dataTable').DataTable();
  console.log(arrayPet)
}

function createModalEdit(pet, arrs) {
  let body = ``;
  body += `<div class="modal fade" id="EditModal-${pet.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Chỉnh sửa thông tin thú cưng</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body">
                <form class="user">
                    <div class="form-group">
                      <label class="control-label" for="task_name">Tên thú cưng</label>
                        <input type="text" class="form-control form-control-user"
                            id="inputNamePet-${pet.id}" value="${pet.name}">
                    </div>
                    <div class="form-group">
                      <label class="control-label" for="task_name">Loại</label>
                      <select id="typePet-${pet.id}" name="type_pet" class="form-control">`;
  for (let type of arrs) {
    if (pet.nameType == type.nameType) {
      body += `<option value="${type.id}" selected>${type.nameType}</option>`
    } else {
      body += `<option value="${type.id}">${type.nameType}</option>`
    }
  }
  body += `</select>
            </div>
            <div class="form-group">
            <label class="control-label" for="task_name">Giới tính</label>
            <select id="genderPet-${pet.id}" name="gender_pet" class="form-control">`;
  if (pet.gender == true) {
    body += `<option value="0" selected>Đực</option>`
    body += `<option value="1">Cái</option>`
  } else {
    body += `<option value="0">Đực</option>`
    body += `<option value="1" selected>Cái</option>`
  }
  body += `</select></div>
            <div class="form-group">
            <label class="control-label" for="task_name">Màu</label>
                <input type="text" class="form-control form-control-user"
                    id="inputColor-${pet.id}" value = "${pet.color}">
            </div>
            <div class="form-group">
            <label class="control-label" for="task_name">Cân nặng</label>
            <div class="row">
            <div class="col-sm-3">
                <input type="number" class="form-control form-control-user"
                    id="inputWeight-${pet.id}" value = "${pet.weight}">
                    </div>
                    <div class="col-sm-9 justify-content-center align-self-center">
                    <label class="control-label" for="task_name">Kg</label>
                    </div>
                    </div>
            </div>
            <div class="form-group">
            <label class="control-label" for="task_name">Tuổi</label>
                <input type="number" class="form-control form-control-user"
                    id="inputAge-${pet.id}" value = "${pet.age}">
            </div>
            <div class="form-group">
            <label class="control-label" for="task_name">Mô tả</label>
                <textarea class="form-control"
                    id="inputDescription-${pet.id}">${pet.description}</textarea>
            </div>
            <div class="form-group row">
              <div class="col-sm-6 mb-3 mb-sm-0">
                  <label class="control-label" for="task_name">Triệt sản</label>
                  <input type="checkbox" value="" id="sterilization-${pet.id}">
              </div>
              <div class="col-sm-6">
                  <label class="control-label" for="task_name">Tiêm dại</label>
                  <input type="checkbox" value="" id="rabiesVaccination-${pet.id}">
              </div>
          </div>
          <div class="form-group row">
              <div class="col-sm-6 mb-3 mb-sm-0">
                  <label class="control-label" for="task_name">Tiêm phòng</label>
                  <input type="checkbox" value="" id="vaccination-${pet.id}">
              </div>
          </div>
            <p id="error" class="small" style="color: rgb(222, 24, 24);"></p>
        </form>
    </div>
    <div class="modal-footer">
        <button class="btn btn-secondary" type="button" data-dismiss="modal">Huỷ</button>
        <input type="button" value="Thay đổi" class="btn btn-primary"/>
    </div></div></div></div>`;
  return body
}

function createDeleteModal(pet) {
  let body = `<div class="modal fade" id="DeleteModal-${pet.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
  aria-hidden="true">
  <div class="modal-dialog" role="document">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Xoá thú cưng</h5>
          </div>
          <div class="modal-body">Bạn chắc muốn xoá thú cưng này?</div>
          <div class="modal-footer">
            <button class="btn btn-secondary" type="button" data-dismiss="modal">Huỷ</button>
              <button class="btn btn-primary" onclick = "deletePet(${pet.id})">Ok</button>
          </div>
      </div>
  </div>
</div>`;
  return body;
}

const updatePet = async (petId, statusId) => {
  const name = document.getElementById(`inputNamePet-${petId}`);
  const gender = document.getElementById(`inputNamePet-${petId}`);
  const color = document.getElementById(`inputNamePet-${petId}`);
  const age = document.getElementById(`inputNamePet-${petId}`);
  const weight = document.getElementById(`inputNamePet-${petId}`);
  const description = document.getElementById(`inputNamePet-${petId}`);
  const typeId = document.getElementById(`inputNamePet-${petId}`);
  console.log(arrayType)
  return arrayType
}

const deletePet = async (petId) => {
  const request = await fetch(`${url}pets/${petId}`, {
    method: 'DELETE'
  })
  let response = await request.json()
  if (response['status'] == "ok") {
    alert("Xoá thành công")
    window.location.reload()
  }
}