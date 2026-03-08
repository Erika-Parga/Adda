import os
from dotenv import load_dotenv

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

#Carga el archivo env
load_dotenv()

db_cred = os.getenv('FIREBASE_CREDENTIALS')
api_key = os.getenv('FIREBASE_API_KEY')

# Use a service account.
cred = credentials.Certificate(db_cred)

if not firebase_admin._apps:
    app = firebase_admin.initialize_app(cred)

db = firestore.client()