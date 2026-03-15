from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from config.firebase import db
from middlewares.auth import verificar_admin


class centro(BaseModel):
    nombre: str
    direccion: str 
    descripcion: str
    responsable_uid: str

router = APIRouter(prefix="/centros")

@router.get("/")
async def obtener_centros():
    docs = db.collection("centros").stream()
    centros = []
    for doc in docs:
        centro = doc.to_dict()
        centro["id"] = doc.id
        centros.append(centro)

        responsable_id = centro.get("responsable_uid")
        if responsable_id:
            respDocs = db.collection("usuarios").document(responsable_id)

            responsable_doc = respDocs.get()
            if responsable_doc.exists:
                usuario_data = responsable_doc.to_dict()
                centro["responsable_nombre"] = usuario_data["nombre"]
    return centros

@router.get("/{id}")
async def obtener_centro_por_id(id:str):
    doc_ref = db.collection("centros").document(id)
    doc = doc_ref.get()
    if doc.exists:
        centro = doc.to_dict()
    else:
            raise HTTPException(status_code=404, detail="No se encuentra ese centro")
    return centro

@router.post("/")
async def crear_centro(nuevoCentro: centro, data: tuple = Depends(verificar_admin)):
    nuevo_centro = {"nombre": nuevoCentro.nombre, "direccion": nuevoCentro.direccion, "descripcion": nuevoCentro.descripcion, "responsable_uid": nuevoCentro.responsable_uid}
    doc_ref = db.collection("centros").add(nuevo_centro)
    return {"mensaje": "Centro creado exitosamente", "id": doc_ref[1].id}

@router.put("/{id}")
async def actualizar_centro(id:str,actualCentro: centro, data: tuple = Depends(verificar_admin)):
    doc_ref = db.collection("centros").document(id)
    doc = doc_ref.get()
    if doc.exists:
        doc_ref.update({"nombre": actualCentro.nombre, "direccion": actualCentro.direccion, "descripcion": actualCentro.descripcion, "responsable_uid": actualCentro.responsable_uid})
    else:
            raise HTTPException(status_code=404, detail="No se encuentra ese centro")
    return {"mensaje": "Centro actualizado exitosamente"}   

@router.delete("/{id}")
async def eliminar_centro(id:str, data: tuple = Depends(verificar_admin)):
    doc_ref = db.collection("centros").document(id)
    doc = doc_ref.get()
    if doc.exists:
        doc_ref.delete()
    else:
            raise HTTPException(status_code=404, detail="No se encuentra ese centro")
    return {"mensaje": "Centro eliminado exitosamente"}   
