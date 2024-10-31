from fastapi import FastAPI
from pydantic import BaseModel
from databases import Database
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean

DATABASE_URL = "sqlite:///./test.db"
database = Database(DATABASE_URL)

app = FastAPI()

metadata = MetaData()
# Define a sample table
items = Table(
    "items",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String, index=True),
    Column("description", String),
    Column("price", Integer),
    Column("available", Boolean, default=True),
)

engine = create_engine(DATABASE_URL)
metadata.create_all(engine)


class HelloResponse(BaseModel):
    message: str
    
class HomeResponse(BaseModel):
    message: str

@app.get("/hello", response_model=HelloResponse)
async def hello():
    return {"message": "Hello from FastAPI in Docker and Kubernetes!"}

@app.get("/", response_model=HomeResponse)
async def home():
    return {"message": "Welcome home"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
