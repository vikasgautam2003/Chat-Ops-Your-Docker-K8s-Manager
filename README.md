# ⚙️ OpsChat — Natural Language DevOps Interface

## 📌 Description

A chat-driven **DevOps control platform** that enables developers to interact with **Docker containers** and **Kubernetes workloads** using **plain English**, without writing CLI commands.

---

## 🧰 Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![Express](https://img.shields.io/badge/Express-black?logo=express&style=for-the-badge)
![Redis](https://img.shields.io/badge/Redis-D82C20?logo=redis&logoColor=white&style=for-the-badge)
![BullMQ](https://img.shields.io/badge/BullMQ-red?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=for-the-badge)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes&logoColor=white&style=for-the-badge)
![WebSockets](https://img.shields.io/badge/WebSockets-black?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)

---

## ▶️ Live Demo

- https://chat-ops-eight.vercel.app/

---

## 💻 Source Code

- https://github.com/vikasgautam2003/Chat-Ops

---

## 📖 About The Project

- OpsChat removes the cognitive burden of memorizing Docker and Kubernetes commands  
- Developers interact using conversational language  
- Requests are translated into deterministic infrastructure operations  
- Only safe, read-only actions are allowed  
- Designed for clarity, safety, and beginner-friendly DevOps exploration  

---

## 🌟 Key Features

- Natural language interface for Docker and Kubernetes  
- Deterministic intent-to-action routing  
- Strict safety constraints (read-only operations)  
- Isolated workers for Docker and Kubernetes  
- Real-time terminal log streaming via WebSockets  
- Kubernetes health diagnostics with human explanations  
- Global system readiness indicator  
- Local environment presence detection  
- Clear separation between visibility, generation, and execution layers  

---

## 🚀 Why OpsChat

### Problems with Traditional DevOps

- Requires memorizing complex CLI commands  
- High risk of destructive mistakes  
- Steep learning curve  
- Hard for beginners  

### OpsChat Solution

- Plain English commands  
- Safe bounded execution  
- Predictable behavior  
- Real-time feedback  
- Easier learning experience  

---

## 🧠 Architecture

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Chat-style interface

### Backend
- Node.js
- Express REST API
- WebSocket streaming

### Queue Layer
- BullMQ
- Redis task queues
- Controlled job execution

### Execution Workers
- Docker worker
- Kubernetes worker
- Sandboxed processes
- Read-only commands only

### Intelligence Layer
- Groq LLM API
- Intent parsing
- Structured command mapping
- Safety validation

---

## 🔄 Workflow

1. User sends natural language request  
2. LLM parses intent  
3. Safety rules validate the action  
4. Job added to Redis queue  
5. Worker executes command  
6. Logs streamed live  
7. Results summarized in plain English  

---

## 📦 Getting Started

### Clone Repository

```bash
git clone https://github.com/vikasgautam2003/Chat-Ops.git
cd Chat-Ops
Install Dependencies
npm install
Start Development Server
npm run dev
Open
http://localhost:3000

⚠️ Requirements
Docker installed and running

Kubernetes cluster (Minikube / Kind / Docker Desktop)

Redis instance

Example Redis Setup
docker run -p 6379:6379 redis
