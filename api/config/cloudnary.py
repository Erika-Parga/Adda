import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config( 
  cloud_name = os.getenv("CLOUD_NAME"), 
  api_key = os.getenv("CLOUD_API_KEY"), 
  api_secret = os.getenv("CLOUD_API_SECRET"),
  secure=True
)


def upload_image(base64_string: str, public_id:str = None)->str:  #sube la imagen con su base64 string y su public_id, devuelve un str
    result = cloudinary.uploader.upload(
        base64_string,
        folder="eventos",          
        public_id=public_id,
        overwrite=True,
        resource_type="image"
    )
    return result["secure_url"], result["public_id"]