const token = sessionStorage.getItem("authToken");
const role = sessionStorage.getItem("authRole");

function protect(rolReq, paginaRed){
    if (token) {
        if (role !=rolReq){
            window.location.href = `../${paginaRed}`; //No coincide el rol asi que se lleva a la pagina de redirección
        }
        else{
            document.body.style.visibility = 'visible'
        }
    }else{
        window.location.href = "../pages/login.html";
}
}
