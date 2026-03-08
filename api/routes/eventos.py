from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from config.firebase import db
from middlewares.auth import verificar_centro
from datetime import datetime

class evento(BaseModel):
    titulo: str
    ubicacion: str 
    fecha: datetime
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
    return eventos

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
    nuevo_evento = {"titulo": nuevoEvento.titulo, "ubicacion": nuevoEvento.ubicacion, "fecha":nuevoEvento.fecha,"categoria":nuevoEvento.categoria,"imagen_url":nuevoEvento.img_url, "descripcion": nuevoEvento.descripcion}
    doc_ref = db.collection("eventos").add(nuevo_evento)
    return {"mensaje": "Evento creado exitosamente", "id": doc_ref[1].id}

@router.put("/{id}")
async def actualizar_evento(id:str,actualEvento: evento, data: tuple = Depends(verificar_centro)):
    doc_ref = db.collection("eventos").document(id)
    doc = doc_ref.get()
    if doc.exists:
        doc_ref.update({"titulo": actualEvento.titulo, "ubicacion": actualEvento.ubicacion, "fecha":actualEvento.fecha,"categoria":actualEvento.categoria,"imagen_url":actualEvento.img_url, "descripcion": actualEvento.descripcion})
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
