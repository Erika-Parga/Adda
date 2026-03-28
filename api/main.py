from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, centros, eventos, agenda
from middlewares.auth import verificar_usuario

app = FastAPI()

app.include_router(auth.router)
app.include_router(centros.router)
app.include_router(eventos.router)
app.include_router(agenda.router)

origins = [
    "https://adda-agenda-cultural.netlify.app", #URL de Netlify
    "http://localhost:3000",       # Para pruebas locales
    "http://192.168.1.149:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
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

