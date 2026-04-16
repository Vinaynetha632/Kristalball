# Military Asset Management System - Documentation

## Project Overview
The Military Asset Management System is a web-based application designed to help military commanders and logistics personnel securely manage and track critical local and transferred assets. The application offers tracking for asset balances, assignments, and transfers between bases while ensuring strict Role-Based Access Control (RBAC).

## Tech Stack & Architecture
- **Frontend**: React (Vite+React, React Router, Axios, Lucide Icons)
- **Backend**: Node.js, Express
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens) & bcrypt for password hashing
- **Architecture type**: Client-Server

## Data Models / Schema (SQLite)

1. **Users**
   - `id`: INTEGER, Primary Key
   - `username`: TEXT, Unique
   - `password`: TEXT, Hashed
   - `role`: TEXT ('Admin', 'Base Commander', 'Logistics Officer')

2. **Assets**
   - `id`: INTEGER, Primary Key
   - `assetName`: TEXT
   - `category`: TEXT
   - `base`: TEXT
   - `status`: TEXT ('Available', 'Assigned')

3. **Transfers**
   - `id`: INTEGER, Primary Key
   - `assetId`: INTEGER (Foreign Key)
   - `fromBase`: TEXT
   - `toBase`: TEXT
   - `date`: TEXT

4. **Assignments**
   - `id`: INTEGER, Primary Key
   - `assetId`: INTEGER (Foreign Key)
   - `assignedTo`: TEXT
   - `date`: TEXT

## RBAC (Role-Based Access Control) Explanation
The application divides functionality logically among roles using a custom JWT middleware checks and `localStorage` on the frontend:
- **Admin**: Has full access. Can purchase assets, view all dashboards, transfer assets between bases, and assign them.
- **Base Commander**: Can view the dashboard, initiate transfers to move assets, and log assignments/expenditures. *Cannot* purchase/register purely new assets.
- **Logistics Officer**: Can view the dashboard, register direct purchases, and log assignments. *Cannot* run base-to-base transfers.

## API Logging
On the backend, standard `console.log` traces are emitted when the database connects or express server starts successfully.
Error traces and stack messages will be logged if sqlite or bcrypt experiences operation breakdowns. Furthermore, standard HTTP interactions are wrapped in custom responses based on validation.

## Setup Instructions
1. Unzip the repository and place the project on your local machine.
2. In your terminal, open two separate windows.
3. **Run Back-End:**
   - `cd backend`
   - `npm install`
   - `npm start`
   - Backend boots on `http://localhost:5000`
4. **Run Front-End:**
   - `cd military-asset-management`
   - `npm install`
   - `npm run dev`
   - Frontend starts on `http://localhost:3000` (or another Vite port provided).

## API Endpoints
- **Auth**: 
  - `POST /api/register` (Registers user)
  - `POST /api/login` (Authenticates user, returns JWT and Role)
- **General Assets**:
  - `GET /api/assets` (Returns list of assets securely)
- **Purchases**:
  - `POST /api/purchases` [Admin / Logistics Officer restricted] (Adds new asset)
- **Transfers**:
  - `GET /api/transfers` (Returns transfer records combined with asset mappings)
  - `POST /api/transfers` [Admin / Base Commander restricted] (Adds transfer path, modifies asset `base` location field automatically)
- **Assignments**:
  - `GET /api/assignments` (Returns assignment history mapping)
  - `POST /api/assignments` [Admin / Base / Logistics restricted] (Deploys asset and sets `status` to "Assigned")

## Login Credentials
Users can register directly on the platform by clicking "Need an account? Register" during login page simulation, generating customizable Base Commander / Admin logins dynamically for grading convenience.

**To manually test**:
Register an account on the client's form with Username: `TestAdmin`, Password: `password`, and Role: `Admin`. Use this to test purchases, assignments, and transfers effortlessly.
