const url = "https://backend-pet-adoption.herokuapp.com/api/auth/signin";

const login = async () => {
    const username = document.getElementById("inputUsername");
    const password = document.getElementById("inputPassword");
    const error = document.getElementById("error");
    const form = {
        username: username.value.trim(),
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
    if (response["success"] == false) {
        error.innerHTML = "Username or Password incorrect!"
    } else {
        localStorage.setItem('token', response["tokenType"] + " " + response["accessToken"]);
        localStorage.setItem('fullName', response["fullName"]);
        window.location.assign("index.html");
    }

}
