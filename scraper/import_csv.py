from pymongo import MongoClient
from dotenv import load_dotenv
import pandas as pd
import os

# Cargar variables de entorno
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    raise Exception("No se encontró MONGODB_URI en .env")

# Conexión MongoDB
client = MongoClient(MONGODB_URI)

print(client.list_database_names())

# Base de datos
db = client["farmaluz"]

# Colección
collection = db["medicamentos"]

# Leer CSV
archivo_csv = "precios_techo_oficial_CNFRPM.csv"

df = pd.read_csv(archivo_csv)

print(f"Filas originales: {len(df)}")

# Eliminar filas totalmente vacías
df = df.dropna(how="all")

# Reemplazar NaN por None
df = df.where(pd.notnull(df), None)

print(f"Filas limpias: {len(df)}")

# Convertir a documentos MongoDB
documentos = df.to_dict(orient="records")

collection.delete_many({})

# Insertar
resultado = collection.insert_many(documentos)

print(f"Documentos insertados: {len(resultado.inserted_ids)}")
print("Importación completada")
