const url = "https://backend-pet-adoption.herokuapp.com/api/users/";

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
        }
    }
    
}

const logout = async () => {
    localStorage.removeItem("id")
    localStorage.removeItem("token")
    localStorage.removeItem("fullName")
    window.location.assign("login.html");
}