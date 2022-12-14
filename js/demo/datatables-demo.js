// Call the dataTables jQuery plugin
$(document).ready(function () {
  if (localStorage.getItem('username') == null) {
    window.location.assign("login.html")
  } else {
    document.getElementById('name').innerHTML = localStorage.getItem('username')
    newfunction();
    fetchTypePet()
  }

});
// const url = "https://backend-pet-adoption.herokuapp.com/api/";
const url = "http://localhost:8080/api/";
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

const addPet = async () => {
  const name = document.getElementById('inputNamePet').value
  const type = document.getElementById('typePet').value

  const gender = document.getElementById('genderPet').value

  const color = document.getElementById('inputColor').value
  const age = document.getElementById('inputAge').value
  const weight = document.getElementById('inputWeight').value

  const breed = document.getElementById('inputBreed').value

  const price = document.getElementById('inputPrice').value

  const dateReceived = new Date($('#inputDateReceived').val())
  const description = document.getElementById('inputDescription').value

  var genderPet = false;

  if (gender == 1) {
    genderPet = true
  }

  const pet = {
    name: name.trim(),
    gender: genderPet,
    breed: breed.trim(),
    color: color.trim(),
    age: age.trim(),
    weight: weight.trim(),
    price: price.trim(),
    description: description.trim(),
    dateReceived: dateReceived,
  };
  const request = await fetch(`${url}pets/types/${type}`, {
    method: 'POST',
    headers: {
      'Authorization': localStorage.getItem("token"),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pet)
  })
  const response = await request.json();
  if (response['status'] == "ok") {
    alert("Th??m th??nh c??ng")
    window.location.reload()
  } else {
    alert("Th??m th???t b???i")
  }
}

async function newfunction() {

  const request = await fetch(`${url}nologin/pets?trash=false`)
  let response = await request.json()
  const arrayPet = response["data"];

  const requestType = await fetch(`${url}nologin/types`)
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
      body += `<td>?????c</td>`;

    } else {
      body += `<td>C??i</td>`;
    }
    body += `<td>` + pet.age + `</td>`;
    if (pet.adopted) {
      body += `<td class ="text-center"><input type="checkbox" value="" checked readonly></td>`;
    } else {
      body += `<td class ="text-center"><input type="checkbox" value="" readonly></td>`;
    }

    body += `<td><button class="btn btn-success btn-circle" type="button" data-placement="top" title="Ch???nh s???a" data-toggle="modal" data-target="#EditModal-${pet.id}"><i class="fas fa-edit"></i></button>
    <button class="btn btn-danger btn-circle"" type="button" data-placement="top" title="Xo??" data-toggle="modal" data-target="#DeleteModal-${pet.id}"><i class="fas fa-trash"></i></button></td>`;
    i++
  }
  $('body').append(modalEdit)
  $('body').append(modalDelete)
  $(".table-body").append(body)
  $('#dataTable').DataTable();
  for (let pet of arrayPet) {
    $(`#imagePetUpdate-${pet.id}`).on("change", async function (e) {
      var files = e.target.files;
      filesLength = files.length;
      let uploads = [];
      for (var i = 0; i < filesLength; i++) {
        uploads.push(uploadImagePet(pet.id, files[i]))
      }
      await Promise.all(uploads);
      alert("T???i ???nh th??nh c??ng")
      window.location.reload()
    });
  }
  console.log(arrayPet)
}

function createModalEdit(pet, arrs) {
  let body = ``;
  body += `<div class="modal fade" id="EditModal-${pet.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Ch???nh s???a th??ng tin th?? c??ng</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">??</span>
                </button>
            </div>
            <div class="modal-body">
                <form class="user" enctype="multipart/form-data" method="POST">
                    <div class="form-group">
                      <div class="text-center">
                          <input type="file" accept="image/*" name="imagePetUpdate-${pet.id}" id="imagePetUpdate-${pet.id}" style="display: none;"
                              multiple>
                          <label for="imagePetUpdate-${pet.id}"><img class="img-fluid" style="width: 4rem;" src="img/upload.svg"
                                  alt="..."></label>
                      </div>
                    </div>
                    <div class="form-group" id="imagePet-${pet.id}">`;
  const arrayImagesPet = pet.petImages
  for (let image of arrayImagesPet) {
    body += `<div class="name" id="image-${image.id}"><img class="img-fluid" style="width: 3rem; height: 3rem;" src="${image.image}" alt="..."
                      >      <button class="btn btn-danger btn-circle"" type="button"title="Xo??" onclick="deletePetImage(${image.id})"><i class="fas fa-times-circle"></i></button></div>`;
  }
  body += `</div>
                    <div class="form-group">
                      <label class="control-label" for="task_name">T??n th?? c??ng</label>
                        <input type="text" class="form-control form-control-user"
                            id="inputNamePetUpdate-${pet.id}" value="${pet.name}">
                    </div>
                    <div class="form-group">
                      <label class="control-label" for="task_name">Lo???i</label>
                      <select id="typePetUpdate-${pet.id}" name="type_pet" class="form-control">`;
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
            <label class="control-label" for="task_name">Gi???i t??nh</label>
            <select id="genderPetUpdate-${pet.id}" name="gender_pet" class="form-control">`;
  if (pet.gender == true) {
    body += `<option value="0" selected>?????c</option>`
    body += `<option value="1">C??i</option>`
  } else {
    body += `<option value="0">?????c</option>`
    body += `<option value="1" selected>C??i</option>`
  }
  body += `</select></div>
            <div class="form-group">
            <label class="control-label" for="task_name">M??u</label>
                <input type="text" class="form-control form-control-user"
                    id="inputColorUpdate-${pet.id}" value = "${pet.color}">
            </div>
            <div class="form-group">
                <label class="control-label" for="task_name">Gi???ng lo??i:</label>
                <input type="text" class="form-control form-control-user" id="inputBreedUpdate-${pet.id}" value="${pet.breed}">
            </div>
            <div class="form-group">
            <label class="control-label" for="task_name">C??n n???ng</label>
            <div class="row">
            <div class="col-sm-3">
                <input type="number" class="form-control form-control-user"
                    id="inputWeightUpdate-${pet.id}" value = "${pet.weight}">
                    </div>
                    <div class="col-sm-9 justify-content-center align-self-center">
                    <label class="control-label" for="task_name">Kg</label>
                    </div>
                    </div>
            </div>
            <div class="form-group">
            <label class="control-label" for="task_name">Tu???i</label>
                <input type="number" class="form-control form-control-user"
                    id="inputAgeUpdate-${pet.id}" value = "${pet.age}">
            </div>
            <div class="form-group">
                <label class="control-label" for="task_name">Gi??:</label>
                <input type="number" class="form-control form-control-user" id="inputPriceUpdate-${pet.id}" value="${pet.price}">
            </div>
            <div class="form-group">
                <label class="control-label" for="task_name">Ng??y nh???n v???:</label>
                <input type="date" class="form-control form-control-user" id="inputDateReceivedUpdate-${pet.id}" value="${pet.dateReceived}">
            </div>
            <div class="form-group">
            <label class="control-label" for="task_name">M?? t???</label>
                <textarea class="form-control"
                    id="inputDescriptionUpdate-${pet.id}">${pet.description}</textarea>
            </div>
            <div class="form-group row">
              <div class="col-sm-6 mb-3 mb-sm-0">
                  <label class="control-label" for="sterilization-${pet.id}">Tri???t s???n   </label>`;
  if (pet.status.sterilization) {
    body += `<input type="checkbox" value="" id="sterilization-${pet.id}" checked>`;
  } else {
    body += `<input type="checkbox" value="" id="sterilization-${pet.id}">`;
  }
  body += `
              </div>
              <div class="col-sm-6">
                  <label class="control-label" for="task_name">Ti??m d???i    </label>`;
  if (pet.status.rabiesVaccination) {
    body += `<input type="checkbox" value="" id="rabiesVaccination-${pet.id}" checked>`;
  } else {
    body += `<input type="checkbox" value="" id="rabiesVaccination-${pet.id}">`;
  }
  body += `
              </div>
          </div>
          <div class="form-group row">
              <div class="col-sm-6 mb-3 mb-sm-0">
                  <label class="control-label" for="task_name">Ti??m ph??ng     </label>`;
  if (pet.status.vaccination) {
    body += `<input type="checkbox" value="" id="vaccination-${pet.id}" checked>`;
  } else {
    body += `<input type="checkbox" value="" id="vaccination-${pet.id}">`;
  }
  body += `
              </div>
          </div>
            <p id="error" class="small" style="color: rgb(222, 24, 24);"></p>
        </form>
    </div>
    <div class="modal-footer">
        <button class="btn btn-secondary" type="button" data-dismiss="modal">Hu???</button>
        <button class="btn btn-primary" onclick = "updatePet(${pet.id},${pet.status.id})">Thay ?????i</button>
    </div></div></div></div>`;
  return body
}

function createDeleteModal(pet) {
  let body = `<div class="modal fade" id="DeleteModal-${pet.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
  aria-hidden="true">
  <div class="modal-dialog" role="document">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Xo?? th?? c??ng</h5>
          </div>
          <div class="modal-body">B???n ch???c mu???n xo?? th?? c??ng n??y?</div>
          <div class="modal-footer">
            <button class="btn btn-secondary" type="button" data-dismiss="modal">Hu???</button>
              <button class="btn btn-primary" onclick = "deletePet(${pet.id})">Ok</button>
          </div>
      </div>
  </div>
</div>`;
  return body;
}

const updatePet = async (petId, statusId) => {
  const name = document.getElementById(`inputNamePetUpdate-${petId}`).value;
  const gender = document.getElementById(`genderPetUpdate-${petId}`).value;
  const color = document.getElementById(`inputColorUpdate-${petId}`).value;
  const age = document.getElementById(`inputAgeUpdate-${petId}`).value;
  const weight = document.getElementById(`inputWeightUpdate-${petId}`).value;
  const description = document.getElementById(`inputDescriptionUpdate-${petId}`).value;
  const typeId = document.getElementById(`typePetUpdate-${petId}`).value;
  const sterilization = document.getElementById(`sterilization-${petId}`).checked;
  const rabiesVaccination = document.getElementById(`rabiesVaccination-${petId}`).checked;
  const vaccination = document.getElementById(`vaccination-${petId}`).checked;

  const breed = document.getElementById(`inputBreedUpdate-${petId}`).value

  const price = document.getElementById(`inputPriceUpdate-${petId}`).value

  const dateReceived = new Date($(`#inputDateReceivedUpdate-${petId}`).val())

  var genderPet = false;
  if (gender == 1) {
    genderPet = true;
  }

  const status = {
    sterilization: sterilization,
    rabiesVaccination: rabiesVaccination,
    vaccination: vaccination,
  }
  const pet = {
    name: name.trim(),
    gender: genderPet,
    breed: breed.trim(),
    color: color.trim(),
    age: age.trim(),
    weight: weight.trim(),
    price: price.trim(),
    description: description.trim(),
    dateReceived: dateReceived,
    status: status
  };
  console.log(pet)

  const request = await fetch(`${url}pets/${petId}/types/${typeId}/status/${statusId}`, {
    method: 'PUT',
    headers: {
      'Authorization': localStorage.getItem("token"),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pet)
  })
  let response = await request.json()
  if (response['status'] == "ok") {
    alert("C???p nh???t th?? c??ng th??nh c??ng")
    window.location.reload()
  } else {
    alert("C???p nh???t th?? c??ng th???t b???i")
  }
}

const uploadImagePet = async (petId, file) => {
  const formData = new FormData();
  formData.append('file', file)
  const request = await fetch(`${url}pets/${petId}/upload`, {
    headers: {
      'Authorization': localStorage.getItem("token")
    },
    method: 'POST',
    body: formData
  })
  let response = await request.json()
  return response
}

const deletePet = async (petId) => {
  const request = await fetch(`${url}pets/${petId}/trash`, {
    headers: {
      'Authorization': localStorage.getItem("token")
    },
    method: 'PUT'
  })
  let response = await request.json()
  if (response['status'] == "ok") {
    alert("Xo?? v??o th??ng r??c th??nh c??ng")
    window.location.reload()
  }
}

const deletePetImage = async (petImageId) => {
  const request = await fetch(`${url}pets/image/${petImageId}`, {
    headers: {
      'Authorization': localStorage.getItem("token")
    },
    method: 'DELETE'
  })
  let response = await request.json()
  if (response['status'] == "ok") {
    alert("Xo?? th??nh c??ng")
    $(`#image-${petImageId}`).hide()
  }
}

const logout = async () => {
  localStorage.removeItem("id");
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("expiresAt");
  window.location.assign("login.html");
}