eventsContainer = document.getElementById('eventsContainer')
const agenRole = sessionStorage.getItem("authRole")



document.addEventListener("DOMContentLoaded", async function() {
    const url = `${API_URL}/eventos`;
    try {
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const eventos = await response.json()
        eventos.forEach(evento => {
            const div = document.createElement("div");
            div.classList.add("evento");
            let botonAgendar;
            if (navRole === "usuario") {
                botonAgendar = `<button class="btn-agendar" data-id="${evento.id}">Agendar</button>`
            } else {
                botonAgendar = ""
            }
            div.innerHTML = `
            <h3>${evento.titulo}</h3>
            ${botonAgendar}
            <small>${evento.ubicacion} - ${evento.fecha}</small>
            <h2>${evento.categoria}</h2>
            <p>${evento.centro_nombre}</p>
            <p>${evento.descripcion}</p>
            `;

            eventsContainer.appendChild(div);
        })

    } catch (error) {
        console.error(error.message);
    }
})

eventsContainer.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-agendar')) {
        const id = e.target.dataset.id
        const url = `${API_URL}/agenda`;
        try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem('authToken')}
            ,
            body: JSON.stringify({
            evento_id: id
    })
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        
    }catch (error) {
        console.error(error.message);
    }
}})