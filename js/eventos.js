protect('centro', 'index.html');
const eventsContainer = document.getElementById('eventsContainer');

async function mostrarTarjetas(eventos) {
    eventos.forEach(evento => {
        const div = document.createElement("div");
        div.classList.add("evento");
        const fecha = new Date(evento.fecha)
        const fechaLegible = fecha.toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
        div.innerHTML = `
        <img src="https://placehold.co/400x200/FF6B1A/white?text=Adda" alt="${evento.titulo}">
        <h2>${evento.titulo}</h2>
        <h3>${evento.categoria}</h3>
        <small>${evento.ubicacion} - ${fechaLegible}</small>
        <p>${evento.descripcion}</p>
        
        
        
        <button id="editButton" class="btn-editar" data-id="${evento.id}" data-id="${evento.id}"
        data-titulo="${evento.titulo}"
        data-categoria="${evento.categoria}"
        data-ubicacion="${evento.ubicacion}"
        data-descripcion="${evento.descripcion}"
        data-fecha="${evento.fecha}">
        Editar</button>
        <button id="deleteButton" class="btn-eliminar" data-id="${evento.id}">Eliminar</button>
        `;

        eventsContainer.appendChild(div);
    })
}

async function crearEvento(eventName, eventCat, eventDir, eventFechaHora, eventDesc) {
    const url = `${API_URL}/eventos/`;
    
    try {
        const response = await fetch(url, {
            method: "POST",   
            headers: {"Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem('authToken')
            },
            body: JSON.stringify({
                titulo: eventName.value,
                ubicacion: eventDir.value ,
                fecha: eventFechaHora.value,
                categoria: eventCat.value,
                descripcion: eventDesc.value,
                img_url:"",
                
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.detail);
        }
        else{
            alert("Evento creado con éxito")
            await recargarEventos();
        }
        
        
    } catch (error) {
        alert(error.message)
    }


}

async function recargarEventos() {
    const url = `${API_URL}/eventos/mis-eventos`;
    eventsContainer.innerHTML = ""
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {"Authorization": "Bearer " + sessionStorage.getItem('authToken')}
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const eventos = await response.json()
        mostrarTarjetas(eventos)
        

    } catch (error) {
        console.error(error.message);
    }
}

async function editarEvento(id, eventName, eventCat, eventDir, eventFechaHora, eventDesc) {
    const url = `${API_URL}/eventos/${id}`;
    
    try {
        const body = {
            titulo: eventName.value,
            ubicacion: eventDir.value,
            categoria: eventCat.value,
            descripcion: eventDesc.value,
            img_url: "",
        }
        if (eventFechaHora.value) {
            body.fecha = eventFechaHora.value
        }
        const response = await fetch(url, {
            method: "PUT",   
            headers: {"Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem('authToken')
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.detail);
        }
        else{
            alert("Evento editado con éxito")
            await recargarEventos();
        }
        
        
    } catch (error) {
        alert(error.message)
    }
}

async function eliminarEvento(id) {
    const url = `${API_URL}/eventos/${id}`;
    
    try {
        const response = await fetch(url, {
            method: "DELETE",   
            headers: {"Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem('authToken')
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        await recargarEventos();
        
    } catch (error) {
        console.error(error.message)
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    let modoEdicion = false        
    let eventoEditandoId = null 
    const url = `${API_URL}/eventos/mis-eventos`;
    const submitBtn = document.getElementById('submitButton');
    const eventName = document.getElementById('eventName');
    const eventCat = document.getElementById('eventCat');
    const eventDir = document.getElementById('eventDir');
    const eventFechaHora = document.getElementById('eventFechaHora');
    const eventDesc = document.getElementById('eventDesc');
    

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {"Authorization": "Bearer " + sessionStorage.getItem('authToken')}
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const eventos = await response.json()
        mostrarTarjetas(eventos)
        

    } catch (error) {
        console.error(error.message);
    }

    submitBtn.addEventListener("click", async (e) => {
        e.preventDefault()
        if (modoEdicion){
            await editarEvento(eventoEditandoId, eventName, eventCat, eventDir, eventFechaHora, eventDesc) 
        }else{
            await crearEvento(eventName, eventCat, eventDir, eventFechaHora, eventDesc)
        }
        modoEdicion = false      
        eventoEditandoId = null 
        recargarEventos()
        eventName.value = ''
        eventCat.value = ''
        eventDir.value = ''
        eventFechaHora.value = ''
        eventDesc.value = ''
        submitBtn.innerHTML = 'Crear evento'

    })


    eventsContainer.addEventListener('click', async(e)=>{
        if (e.target.classList.contains('btn-eliminar')) {
        const id = e.target.dataset.id
        await eliminarEvento(id)
        }
        if (e.target.classList.contains('btn-editar')) {
            modoEdicion = true
            eventoEditandoId = e.target.dataset.id
            submitBtn.innerHTML = 'Guardar cambios'
            eventName.value = e.target.dataset.titulo;
            eventCat.value = e.target.dataset.categoria;
            eventDesc.value = e.target.dataset.descripcion;
            eventDir.value = e.target.dataset.ubicacion;
            eventFechaHora.value = e.target.dataset.fecha;
    }
    } )
})