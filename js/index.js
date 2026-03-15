eventsContainer = document.getElementById('eventsContainer')

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

            div.innerHTML = `
            <h3>${evento.titulo}</h3>
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