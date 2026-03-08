from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth

app = FastAPI()

app.include_router(auth.router)

#aqui pones las url de los dominios que usaras, en este caso los localhost tanto de la api como de npx serve
#origins = [
 #   "http://#front",
  #  "http://#api",
#]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
)

@app.get("/")
def inicio():
    return {"mensaje": "API de Adda funcionando"}