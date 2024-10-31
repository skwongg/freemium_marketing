import os
import httpx
import ollama

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from databases import Database
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean


OLLAMA_API_URL=os.getenv("OLLAMA_API_URL", "http://localhost:11434")

DATABASE_URL = "sqlite:///./test.db"
database = Database(DATABASE_URL)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://127.0.0.1:5173",
    "https://127.0.0.1:5173",
    "http://localhost:5173",
    "https://localhost:5173",
    "http://127.0.0.1:11434",
    "http://localhost:11434",
    "http://localhost:*",
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
    
import json

@app.post("/search")
async def search(query: dict):
    async with httpx.AsyncClient(timeout=None) as client:
            page = await client.get(f"{query.get('query')}")
            
            print("page fetched: ")
            print(page)
            print(" * " * 10)
            
            response = await client.post(
                f"{OLLAMA_API_URL}/api/generate",
                json={
                    "model": "llama3.2:3b-instruct-fp16",
                    "prompt": "convert this html page into human readable words: {}".format(page)
                }
            )
            print("query: ")
            print(query)
            print("RESPONSE OF OLLAMA: ")
            print(response.get("content"))
            decoded = response.content.decode('utf-8')
            jdecoded = json.loads(decoded)
            print("json conversion below:")
            print(jdecoded)
            return response
        
    
    # return {"results": f"Search results for: {query}"}

@app.get("/hello", response_model=HelloResponse)
async def hello():
    return {"message": "Hello from FastAPI in Docker and Kubernetes!"}

@app.get("/", response_model=HomeResponse)
async def home():
    return {"message": "Welcome home"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
