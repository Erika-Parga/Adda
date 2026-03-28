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
            const fecha = new Date(evento.fecha)
            const fechaLegible = fecha.toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })
            const div = document.createElement("div");
            div.classList.add("evento");
            let botonAgendar;
            if (navRole === "usuario") {
                botonAgendar = `<button class="btn-agendar" data-id="${evento.id}">Agendar</button>`
            } else {
                botonAgendar = ""
            }
            div.innerHTML = `
            <img src="${evento.imagen_url}" alt="${evento.titulo}">
            <h2>${evento.titulo}</h2>
            <h3>${evento.categoria}</h3>
            <small>${evento.ubicacion} - ${fechaLegible}</small>

            <p>${evento.centro_nombre}</p>
            <p>${evento.descripcion}</p>
            ${botonAgendar}
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
            const errorData = await response.json();
            alert(errorData.detail);
        }
        else{
            alert("Evento agendado")
        }

        
    }catch (error) {
        alert(error.message);
    }
}})