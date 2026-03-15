const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const links = navLinks.querySelectorAll("a")
const overlay = document.querySelector('.overlay');

const navToken = sessionStorage.getItem("authToken");
const navRole = sessionStorage.getItem("authRole");
const cerrarSesionBtn = document.getElementById("cerrarSesion")

document.querySelectorAll(".nav-usuario, .nav-centro, .nav-admin, .nav-visitante, .nav-sesion")
    .forEach(el => el.classList.add("oculto"))

function navbarDinamic(rol){
    if (navToken) {
        if (navRole == "usuario"){
            document.querySelectorAll(".nav-usuario, .nav-sesion")
                .forEach(el => el.classList.remove("oculto"))
        }
        else if(navRole=="centro"){
            document.querySelectorAll(".nav-centro , .nav-sesion")
                .forEach(el => el.classList.remove("oculto"))
        }
        else{
            document.querySelectorAll(".nav-admin, .nav-sesion")
                .forEach(el => el.classList.remove("oculto"))
        }
    }else{
        document.querySelectorAll(".nav-visitante, .nav-usuario")
            .forEach(el => el.classList.remove("oculto"))
}
}

navbarDinamic()

if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", (e) => {
        e.preventDefault()
        sessionStorage.clear()
        window.location.href = "/index.html"
    })
}

menuBtn.addEventListener("click", ()=>{
    navLinks.classList.toggle("active");
    overlay.classList.toggle('active');
    menuBtn.setAttribute("aria-expanded", navLinks.classList.contains("active"));
} );

links.forEach(link=>{
    link.addEventListener("click", ()=>{
        navLinks.classList.remove("active");
        overlay.classList.remove('active');
        menuBtn.innerHTML="☰";
        menuBtn.setAttribute("aria-expanded","false")
    })
})

overlay.addEventListener('click', () => {
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
});

