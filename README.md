# Department Management App

A full-stack web application for managing departments, built with **React (Frontend)** and **NestJS (Backend)**.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript, PostgreSQL
- **State Management:** Redux Toolkit
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## 📁 Project Structure

```bash
.
├── department_management_frontend  # React frontend
├── department_management_backend   # NestJS backend


git clone https://github.com/your-username/department_management.git
cd department_management


cd department_management_frontend

# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev

NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3003/graphql

NEXT_PUBLIC_API_URL=https://department-management-backend.onrender.com/api/v1
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://department-management-backend.onrender.com/graphql