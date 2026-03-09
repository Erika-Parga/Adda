from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, centros, eventos, agenda
from middlewares.auth import verificar_usuario

app = FastAPI()

app.include_router(auth.router)
app.include_router(centros.router)
app.include_router(eventos.router)
app.include_router(agenda.router)

#aqui pones las url de los dominios que usaras, en este caso los localhost tanto de la api como de npx serve
#origins = [
 #   "http://#front",
  #  "http://#api",
#]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def inicio():
    return {"mensaje": "API de Adda funcionando"}

@app.get("/prueba")
async def prueba_verificaciom(data: tuple = Depends(verificar_usuario)):
    uid, role = data
    return {"uid": uid, "role": role}

