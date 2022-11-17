const url = "https://backend-pet-adoption.herokuapp.com/api/pets";

const fetchPets = async () => {

    // var tablePet = document.getElementById('dataTable')
    const request = await fetch(url)
    let response = await request.json()
    const arrayPet = response["data"];
    var body = ``;
    let i = 1
    for (let pet of arrayPet) {
        body += `<tr class= "even"><td>` + i + `</td>`;
        body += `<td class ="sorting_1">` + pet.name + `</td>`;
        body += `<td>` + pet.nameType + `</td>`;

        if (pet.gender == true) {
            body += `<td>Đực</td>`;

        } else {
            body += `<td>Cái</td>`;
        }
        body += `<td>` + pet.age + `</td>`;
        body += `<td>` + i + `</td>`;
        body += `<td>` + i + `</td></tr>`;
        // const row = tablePet.insertRow(i)
        // const stt = row.insertCell(0)
        // const namePet = row.insertCell(1)
        // const type = row.insertCell(2)
        // const gender = row.insertCell(3)
        // const age = row.insertCell(4)
        // const adopt = row.insertCell(5)
        // const action = row.insertCell(6)

        // stt.innerHTML = i
        // namePet.innerHTML = pet.name
        // type.innerHTML = pet.nameType
        // if (pet.gender == true) {
        //     gender.innerHTML = "Đực"
        // } else {
        //     gender.innerHTML = "Cái"
        // }
        // age.innerHTML = pet.age
        // adopt.innerHTML = i
        // action.innerHTML = i
        i++
    }
    $("#dataTable tbody").append(body)
    // var html = document.getElementById('table-body').innerHTML + body
    // document.getElementById('table-body').innerHTML = html
    console.log(response["data"]);
}
