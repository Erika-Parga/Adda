import os
from dotenv import load_dotenv
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

#Carga el archivo env
load_dotenv()
firebase_json_str = os.getenv("FIREBASE_CREDENTIALS")
api_key = os.getenv('FIREBASE_API_KEY')

if not firebase_admin._apps:
    if firebase_json_str:
        try:
            # Intentamos parsear el JSON (útil si está en Render como string)
            firebase_info = json.loads(firebase_json_str)
            cred = credentials.Certificate(firebase_info)
        except json.JSONDecodeError:
            # Si falla el parseo, asumimos que es una ruta local (como tenías antes)
            cred = credentials.Certificate(firebase_json_str)
        
        firebase_admin.initialize_app(cred)
    else:
        raise ValueError("No se encontró la variable FIREBASE_CREDENTIALS")

# 4. Instancia de la base de datos
db = firestore.client()