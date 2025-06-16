# Gmail-Agent

📧 Gmail Assistant – Gmail Assistant is an intelligent email automation tool that connects to your Gmail inbox, analyzes incoming emails using LLMs (Gemini/LLaMA), classifies them, and replies automatically with relevant responses. It is built using Spring Boot for the backend and React for the frontend, with secure JWT-based login and a PostgreSQL + VectorDB-powered data layer.

Deployed on the Render platform, with Swagger documentation for easy API testing.

🚀 Features Read and classify emails using Gmail API

Automatically generate replies using LLM (Gemini or LLaMA)

Secure JWT-based user authentication(future enhancement)

Role-based access (Admin/User (future enhancement))

VectorDB support for storing context and semantic search

RESTful API access with Swagger documentation

React frontend for interaction and dashboard

PostgreSQL database for persistent storage

⚙️ Tech Stack 🧠 AI & NLP:

LangChain

Gemini / LLaMA

🖥 Backend:
for backend code contact : smileyishere1008@gmail.com

Java 21

Spring Boot

Spring Security

Spring Data JPA

JWT Authentication

PostgreSQL

VectorDB

🌐 Frontend:

React.js

Axios

TailwindCSS (optional)

☁️ Deployment:

Backend hosted on Render

Frontend deployed on Vercel

Database hosted on Railway

🛠️ Tools:

Gmail API

Swagger for API testing

Docker (development)

GitHub Actions (CI/CD)

📄 API Documentation (Swagger UI) 🔗 Spring Boot backend is deployed on Render: https://agent1-latest.onrender.com
update in the api config file to use this end point
📘 Swagger API docs:[ https://gmail-assistant-backend.onrender.com/swagger-ui/index.html](https://agent1-latest.onrender.com/swagger-ui/index.html)

Use this for testing authentication, email sync, auto-reply endpoints, etc.

🔐 Authentication Uses Spring Security with JWT.

Add Authorization header: Authorization: Bearer <your_token>

🗃️ Project Structure (Backend) controller/

service/

repository/

dto/

config/

security/

util/

🖥️ Running the Frontend (React) To run the frontend locally:

📁 Clone the repo or download ZIP Fork the repository or download and extract the ZIP file.

📂 Navigate to the frontend root folder

📦 Install dependencies Use either of the following:

npm install or (if you face dependency warnings):

npm install --legacy-peer-deps Start the development server

bash Copy Edit npm run start The React app will run at: 👉 http://localhost:3000
