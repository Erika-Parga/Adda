
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from firebase_admin import auth

from config.firebase import db


class registro(BaseModel):
    name: str
    email: str 
    password: str

class login(BaseModel):
    email: str 
    pasword: str

router = APIRouter(prefix="/auth")

@router.post("/registro")
async def crear_registro(user: registro):
    try:
        nuevo_usuario = auth.create_user(
        display_name=user.name,
        email=user.email,
        email_verified=False,
        password=user.password,
        disabled=False)
        uid = nuevo_usuario.uid

        data = {"nombre": user.name, "email": user.email, "rol": "usuario"}
        db.collection("usuarios").document(uid).set(data)

    except auth.EmailAlreadyExistsError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return {"mensaje": "Usuario creado exitosamente", "uid": uid}

