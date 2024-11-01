import os
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from typing import List, Optional
from databases import Database
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Boolean

DATABASE_URL = "sqlite:///./test.db"
database = Database(DATABASE_URL)

app = FastAPI()

## chatgpt client begin
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

class ChatRequest(BaseModel):
    message: str
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 150
    model: Optional[str] = "gpt-3.5-turbo"

class ChatResponse(BaseModel):
    response: str
    usage: Optional[dict] = None

## chat gpt client end


origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://127.0.0.1:5173",
    "https://127.0.0.1:5173",
    "http://localhost:5173",
    "https://localhost:5173",
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
    
class ChatMessage(BaseModel):
    domain: str
    text: str

@app.post("/chat")
async def chat(message: ChatMessage):
    
    try:
        # PSEUDOCODE context call given domain
            # http request the domain website
            # take HTML and feed into prompt as `initial`
        # html_page = requests.get("https://www.linkedin.com") #TODO: pipe through the domain
        
        initial = "airbnb.com travigo template info" #this should have been cleaned html
        initial = "linkedin.com linkedin Welcome to your professional community" #this should have been cleaned html
        feed = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": initial}
            ],
            temperature=0.7,
            max_tokens=4000
        )
        
        # take feed text and send into prompt for audience target
            # prompt for domain company industry
            # prompt for domain company revenue or financials
            # prompt for domain company sales
            # prompt for any other relevant context here
            
        # prompt for structured response clearly defining each 
        # ideally as a prefix to next prompt "given the company <company>, 
        # in the <industry> industry and the people who would buy <what they sell>"
        
        # send into the next prompt to generate copy.
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": "give me the industries and job titles \
                    of people in ads given the context of and then generate two marketing \
                    blurbs for them respectively \
                        :{}".format(feed) + message.text}
            ],
            temperature=0.7,
            max_tokens=4000
        )

        return {
            "response": response.choices[0].message.content,
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        response = client.chat.completions.create(
            model=request.model,
            messages=[
                {"role": "user", "content": request.message}
            ],
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )

        return ChatResponse(
            response=response.choices[0].message.content,
            usage=response.usage
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/hello", response_model=HelloResponse)
async def hello():
    return {"message": "Hello from FastAPI in Docker and Kubernetes!"}

@app.get("/", response_model=HomeResponse)
async def home():
    return {"message": "Welcome home"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
