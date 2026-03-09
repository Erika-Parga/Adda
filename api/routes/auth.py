from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from firebase_admin import auth
import requests
from config.firebase import db, api_key

class registro(BaseModel):
    name: str
    email: str 
    password: str

class login(BaseModel):
    email: str 
    password: str

router = APIRouter(prefix="/auth")
url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"

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

@router.post("/login")
async def iniciar_sesión(user: login):
    try:
        respuesta = requests.post(url, json={
            "email": user.email,
            "password": user.password,
            "returnSecureToken": True
        })
        datos = respuesta.json()
        if "error" in datos:
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")
        token = datos["idToken"]
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        doc_ref = db.collection("usuarios").document(uid)
        doc = doc_ref.get()
        if doc.exists:
            dic=doc.to_dict()
        else:
            raise HTTPException(status_code=404, detail="No se encuentra ese documento")
        
        role = dic["rol"]
        
    except HTTPException:
        raise  # deja pasar los HTTPException que lance
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return {"mensaje": "Inicio de sesión exitoso", "token": token, "rol": role }