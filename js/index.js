$(document).ready(function () {
    if (localStorage.getItem('username') == null) {
        window.location.assign("login.html")
    }else{
        document.getElementById('name').innerHTML = localStorage.getItem('username')
        document.getElementById('username').innerHTML = "Username: "+localStorage.getItem('username')
    }
});
// const url = "https://backend-pet-adoption.herokuapp.com/api/users/";
const url = "http://localhost:8080/api/auth/users/";

const changePass = async () => {
    const oldPass = document.getElementById("inputOldPassword");
    const newPass = document.getElementById("inputNewPassword");
    const reNewPass = document.getElementById("inputReNewPassword");
    const id = localStorage.getItem("id")
    const form = {
        oldPassword: oldPass.value.trim(),
        newPassword: newPass.value.trim(),
        confirmPassword: reNewPass.value.trim()
    };

    const error = document.getElementById("error");

    if (newPass.value != reNewPass.value) {
        error.innerHTML = "Mật khẩu xác nhận không chính xác!"
    } else {
        const request = await fetch(`${url}${id}/changePass`, {
            method: 'PUT',
            headers: {
                'Authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        })
        const response = await request.json();
        if (response["status"] == "Error") {
            error.innerHTML = "Sai mật khẩu cũ"
        } else {
            $('#changePasswordModal').modal('hide');
            alert("Đổi mật khẩu thành công!")
            window.location.reload()
        }
    }

}

const logout = async () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("expiresAt");
    window.location.assign("login.html");
}