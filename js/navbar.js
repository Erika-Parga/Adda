const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const links = navLinks.querySelectorAll("a")
const overlay = document.querySelector('.overlay');

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