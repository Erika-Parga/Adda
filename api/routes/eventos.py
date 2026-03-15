from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from config.firebase import db
from middlewares.auth import verificar_centro
from datetime import datetime

class evento(BaseModel):
    titulo: str
    ubicacion: str 
    fecha: Optional[datetime] = None
    categoria: str
    img_url: str
    descripcion: str

router = APIRouter(prefix="/eventos")

@router.get("/")
async def obtener_eventos():
    docs = db.collection("eventos").stream()
    eventos = []
    for doc in docs:
        evento = doc.to_dict()
        evento["id"] = doc.id
        eventos.append(evento)

        centro_id = evento.get("centro_uid")
        if centro_id:
            centroDocs = db.collection("centros").document(centro_id)

            centro_doc = centroDocs.get()
            if centro_doc.exists:
                centro_data = centro_doc.to_dict()
                evento["centro_nombre"] = centro_data["nombre"]

    return eventos

@router.get("/mis-eventos")
async def misEventos(data: tuple = Depends(verificar_centro)):
    docEvents = db.collection("eventos")
    uid, rol = data
    docs_encontrados = []
    user_ref = db.collection("usuarios").document(uid)
    userDoc = user_ref.get()
    evento = userDoc.to_dict()
    centro_uid = evento["centro_uid"]

    query = docEvents.where("centro_uid", "==", centro_uid)
    resultados = query.stream()

    for doc in resultados:
        evento = doc.to_dict()
        evento["id"] = doc.id
        docs_encontrados.append(evento)

        centro_id = evento.get("centro_uid")
        if centro_id:
            centroDocs = db.collection("centros").document(centro_id)

            centro_doc = centroDocs.get()
            if centro_doc.exists:
                centro_data = centro_doc.to_dict()
                evento["centro_nombre"] = centro_data["nombre"]
    return docs_encontrados

@router.get("/{id}")
async def obtener_evento_por_id(id:str):
    doc_ref = db.collection("eventos").document(id)
    doc = doc_ref.get()
    if doc.exists:
        evento = doc.to_dict()
    else:
            raise HTTPException(status_code=404, detail="No se encuentra ese centro")
    return evento


@router.post("/")
async def crear_evento(nuevoEvento: evento, data: tuple = Depends(verificar_centro)):
    uid, rol = data
    user_ref = db.collection("usuarios").document(uid)
    userDoc = user_ref.get()
    centro_uid = userDoc.to_dict()["centro_uid"]

    nuevo_evento = {"titulo": nuevoEvento.titulo, "ubicacion": nuevoEvento.ubicacion, "fecha":nuevoEvento.fecha,"categoria":nuevoEvento.categoria,"imagen_url":nuevoEvento.img_url, "descripcion": nuevoEvento.descripcion, "centro_uid": centro_uid}
    doc_ref = db.collection("eventos").add(nuevo_evento)
    return {"mensaje": "Evento creado exitosamente", "id": doc_ref[1].id}

@router.put("/{id}")
async def actualizar_evento(id:str,actualEvento: evento, data: tuple = Depends(verificar_centro)):
    doc_ref = db.collection("eventos").document(id)
    doc = doc_ref.get()
    if doc.exists:
        doc_ref.update({"titulo": actualEvento.titulo, "ubicacion": actualEvento.ubicacion,"categoria":actualEvento.categoria,"imagen_url":actualEvento.img_url, "descripcion": actualEvento.descripcion})
        if actualEvento.fecha:
            doc_ref.update({"fecha": actualEvento.fecha})
    else:
            raise HTTPException(status_code=404, detail="No se encuentra ese evento")
    return {"mensaje": "Evento actualizado exitosamente"}   

@router.delete("/{id}")
async def eliminar_centro(id:str, data: tuple = Depends(verificar_centro)):
    doc_ref = db.collection("eventos").document(id)
    doc = doc_ref.get()
    if doc.exists:
        doc_ref.delete()
    else:
            raise HTTPException(status_code=404, detail="No se encuentra ese evento")
    return {"mensaje": "Evento eliminado exitosamente"}   
