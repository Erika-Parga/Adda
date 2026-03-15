const loginBtn = document.getElementById('loginButton')
const registerBtn = document.getElementById('registerButton')
const loginEmail = document.getElementById('loginEmail')
const loginPassword = document.getElementById('loginPassword')
const registerEmail = document.getElementById('registerEmail')
const registerName = document.getElementById('registerName')
const registerPassword = document.getElementById('registerPassword')

async function login(e) {
    e.preventDefault();
    const url = `${API_URL}/auth/login`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: loginEmail.value,
                password: loginPassword.value
            })
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        const token = result.token
        const role = result.rol
        sessionStorage.setItem('authToken', token)
        sessionStorage.setItem('authRole', role)

        if (role === "superadmin") {
            window.location.href = "../index.html";
        } else if (role === "centro") {
            window.location.href = "../index.html";
        } else {
            window.location.href = "../index.html";
        }

    } catch (error) {
        console.error(error.message);
    }
}

async function register(e){
    e.preventDefault();
    const url = `${API_URL}/auth/registro`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: registerName.value,
                email: registerEmail.value,
                password: registerPassword.value
            })
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        window.location.href = "../pages/login.html"

    } catch (error) {
        console.error(error.message);
    }
}

if (loginBtn) loginBtn.addEventListener("click", login)
if (registerBtn) registerBtn.addEventListener("click", register)