// Call the dataTables jQuery plugin
const url = "https://backend-pet-adoption.herokuapp.com/api/";
const fetchCaringStaff = async () => {
    const request = await fetch(`${url}admin/caringStaff`)
    let response = await request.json()
    const arrayCaringStaff = response["data"];
    var body = '';
    let i = 1
    for (let staff of arrayCaringStaff) {
        body += `<tr class= "even"><td>` + i + `</td>`;
        body += `<td class ="sorting_1">` + staff.name + `</td>`;
        body += `<td>` + staff.birthDay + `</td>`;
        body += `<td>` + staff.phoneNumber + `</td>`;
        body += `<td>` + staff.identification + `</td>`;

        body += `<td><button class="btn btn-success btn-circle" type="button" data-placement="top" title="Chỉnh sửa" data-toggle="modal" data-target="#EditModal-${staff.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-circle"" type="button" data-placement="top" title="Xoá" data-toggle="modal" data-target="#DeleteModal-${staff.id}"><i class="fas fa-trash"></i></button></td>`;
        i++
    }

    $(".table-body").append(body)
    $('#dataTable').DataTable();
    console.log(arrayCaringStaff)
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
$(document).ready(function () {
    fetchCaringStaff()
    // $('#dataTable').DataTable();
});
