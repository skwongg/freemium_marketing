import os
import json
import requests

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

OLLAMA_API_URL=os.getenv("OLLAMA_API_URL", "http://host.docker.internal:11434")
DATABASE_URL = "postgresql://your_username:your_password@postgres:5432/your_database_name"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base() #sqlalchemy base class to create models/classes from.


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:8000",
    "http://127.0.0.1:5173",
    "https://127.0.0.1:5173",
    "http://localhost:5173",
    "https://localhost:5173",
    "http://127.0.0.1:11434",
    "http://localhost:11434",
    "http://localhost:*",
    "http://host.docker.internal:8000",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


import ollama 
client = ollama.Client("http://host.docker.internal:11434")


@app.post("/search")
async def search(query: dict):    
    response = client.generate(model="llama3.2", prompt="what do you know about: {}?".format(query.get('query')))
    return {"results": response.get('response')}

@app.get("/hello", response_model=HelloResponse)
async def hello():
    return {"message": "Hello from FastAPI in Docker and Kubernetes!"}

@app.get("/", response_model=HomeResponse)
async def home():
    return {"message": "Welcome home"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/chat")
async def call_ollama(message: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{OLLAMA_API_URL}/api/generate",
            json={
                "model": "llama3.2",
                "prompt": message["text"]
            }
        )
        print("RESPONE OF OLLAMA: ")
        print(response.json())
        return response.json()
