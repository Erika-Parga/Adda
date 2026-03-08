from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from config.firebase import db
from middlewares.auth import verificar_usuario

class agenda(BaseModel):
    evento_id:str

router = APIRouter(prefix="/agenda")

@router.get("/")
async def obtener_agenda(data: tuple =Depends(verificar_usuario)):
    docs = db.collection("agenda")
    uid, role = data
    query = docs.where("usuario_uid", "==", uid)
    resultados = query.stream()
    docs_encontrados = []
    for doc in resultados:
        item = doc.to_dict()
        evento_id = item["evento_id"]
        eventoDocs = db.collection("eventos").document(evento_id)

        evento_doc = eventoDocs.get()
        if evento_doc.exists:
            evento_data = evento_doc.to_dict()
            evento_data["agenda_id"] = doc.id
            docs_encontrados.append(evento_data)
        
    return docs_encontrados

@router.post("/")
async def crear_evento(nuevoEvento: agenda, data: tuple = Depends(verificar_usuario)):
    docs = db.collection("agenda")
    uid, role = data
    query = docs.where("usuario_uid", "==", uid).where("evento_id","==", nuevoEvento.evento_id)
    resultados = list(query.stream())
    if len(resultados) > 0:
        raise HTTPException(status_code=400, detail="Ya existe este evento")
    nuevo_agendado = {
    "usuario_uid": uid,          
    "evento_id": nuevoEvento.evento_id  
    }
    doc_ref = db.collection("agenda").add(nuevo_agendado)
    return {"mensaje": "Evento agendado exitosamente", "id": doc_ref[1].id}

@router.delete("/{id}")
async def eliminar_evento(id:str, data: tuple = Depends(verificar_usuario)):
    docs = db.collection("agenda")
    uid, role = data
    query = docs.where("usuario_uid", "==", uid).where("evento_id","==", id)
    resultados = list(query.stream())
    if len(resultados) > 0: 
        resultados[0].reference.delete()
    else:
            raise HTTPException(status_code=404, detail="No se encuentra ese evento")
    return {"mensaje": "Evento eliminado exitosamente"}   
        
    