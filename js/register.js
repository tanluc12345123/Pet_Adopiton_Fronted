const url = "https://backend-pet-adoption.herokuapp.com/api/auth/signup";

const register = async () => {
    const username = document.getElementById("inputUsername");
    const email = document.getElementById("inputEmail");
    const password = document.getElementById("inputPassword");
    const rePassword = document.getElementById("repeatPassword");
    const errorRePassword = document.getElementById("errorRePassword");

    if (password.value != rePassword.value) {
        errorRePassword.innerHTML = "Confirm password is not matched with the password. Please try again!"
    } else {
        const form = {
            username: username.value.trim(),
            email: email.value.trim(),
            password: password.value.trim()
        };

        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        })
        const response = await request.json();
        if (response["success"] != false) {
            $('#registerModal').modal('show');
        } else {
            errorRePassword.innerHTML = response["message"]
        }
    };
}
