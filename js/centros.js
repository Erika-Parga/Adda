protect('superadmin', 'index.html');
const centrosContainer = document.getElementById('centrosContainer');

async function recargarCentros() {
    const url = `${API_URL}/centros`;
    centrosContainer.innerHTML = ""
    try {
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const centros = await response.json()
        mostrarTarjetas(centros)
        

    } catch (error) {
        console.error(error.message);
    }
}

async function crearCentro(centerName, centerDir, centerDesc, centerResp) {
    const url = `${API_URL}/centros/`;
    
    try {
        const response = await fetch(url, {
            method: "POST",   
            headers: {"Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem('authToken')
            },
            body: JSON.stringify({
                nombre: centerName.value,
                direccion: centerDir.value,
                descripcion: centerDesc.value,
                responsable_uid: centerResp.value
            })
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        await recargarCentros();
        
    } catch (error) {
        console.error(error.message)
    }


}

async function eliminarCentro(id) {
    const url = `${API_URL}/centros/${id}`;
    
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
        await recargarCentros();
        
    } catch (error) {
        console.error(error.message)
    }
}

async function editarCentro(id, centerName, centerDir, centerDesc, centerResp) {
    const url = `${API_URL}/centros/${id}`;
    
    try {
        const response = await fetch(url, {
            method: "PUT",   
            headers: {"Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem('authToken')
            },
            body: JSON.stringify({
                nombre: centerName.value,
                direccion: centerDir.value,
                descripcion: centerDesc.value,
                responsable_uid: centerResp.value
            })
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        await recargarCentros();
        
    } catch (error) {
        console.error(error.message)
    }
}

async function mostrarTarjetas(centros) {
    centros.forEach(centro => {
        const div = document.createElement("div");
        div.classList.add("centro");

        div.innerHTML = `
        <h3>${centro.nombre}</h3>
        <p>${centro.direccion}</p>
        <p>${centro.descripcion}</p>
        <p>${centro.responsable_nombre}</p>
        <button id="deleteButton" class="btn-eliminar" data-id="${centro.id}">Eliminar</button>
        <button id="editButton" class="btn-editar" data-id="${centro.id}" data-id="${centro.id}"
        data-nombre="${centro.nombre}"
        data-direccion="${centro.direccion}"
        data-descripcion="${centro.descripcion}"
        data-responsable="${centro.responsable_uid}">
        Editar</button>
        `;

        centrosContainer.appendChild(div);
    })
}

document.addEventListener("DOMContentLoaded", async function() {
    let modoEdicion = false        
    let centroEditandoId = null 
    const url = `${API_URL}/centros`;
    const submitBtn = document.getElementById('submitButton');
    const centerName = document.getElementById('centerName');
    const centerDir = document.getElementById('centerDir');
    const centerDesc = document.getElementById('centerDesc');
    const centerResp = document.getElementById('centerResp');
    

    try {
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const centros = await response.json()
        mostrarTarjetas(centros)
        

    } catch (error) {
        console.error(error.message);
    }

    submitBtn.addEventListener("click", async (e) => {
        e.preventDefault()
        if (modoEdicion){
            await editarCentro(centroEditandoId, centerName, centerDir, centerDesc, centerResp) 
        }else{
            await crearCentro(centerName, centerDir, centerDesc, centerResp)
        }
        modoEdicion = false      
        centroEditandoId = null 
        recargarCentros()

    })


    centrosContainer.addEventListener('click', async(e)=>{
        if (e.target.classList.contains('btn-eliminar')) {
        const id = e.target.dataset.id
        await eliminarCentro(id)
        }
        if (e.target.classList.contains('btn-editar')) {
            modoEdicion = true
            centroEditandoId = e.target.dataset.id
            submitBtn.innerHTML = 'Guardar cambios'
            centerName.value = e.target.dataset.nombre;
            centerDir.value = e.target.dataset.direccion;
            centerDesc.value = e.target.dataset.descripcion;
            centerResp.value = e.target.dataset.responsable;

    }
    } )
})