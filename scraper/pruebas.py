from pprint import pprint
from backend.database import db

pprint(db.medicamentos.find_one())