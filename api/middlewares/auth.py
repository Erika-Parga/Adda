from fastapi import Depends, Header, HTTPException
from firebase_admin import auth
from config.firebase import db
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def verificar_token(credentials: HTTPAuthorizationCredentials =  Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Token no proporcionado")
    token = credentials.credentials
    try:
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
        raise
    except auth.InvalidIdTokenError as e:
        raise HTTPException(status_code=401, detail="Token inválido")
    data = (uid, role)
    return data


async def verificar_usuario(data: tuple = Depends(verificar_token)):
    uid, role = data
    if role != "usuario":
        raise HTTPException(status_code=403, detail="El usuario no tiene permisos")
    return uid, role

async def verificar_centro(data: tuple = Depends(verificar_token)):
    uid, role = data
    print(f"Rol recibido: '{role}'")
    if role != "centro":
        raise HTTPException(status_code=403, detail="El usuario no tiene permisos de centro")
    return uid, role

async def verificar_admin(data: tuple = Depends(verificar_token)):
    uid, role = data
    if role != "superadmin":
        raise HTTPException(status_code=403, detail="El usuario no tiene permisos de admin")
    return uid, role

