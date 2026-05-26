# Lab Management System - Backend API

This is the backend REST API service for the **Lab Management System**, built with Node.js, Express, TypeScript, and Prisma ORM with PostgreSQL. It manages user authentication, role-based authorization, inventory data logs, dynamic QR barcode compilation, and provides a centralized global error interception framework.

### Frontend Repository
The frontend for this project is built using Next.js and can be found here:
🔗 **[Lab-Management-Nextjs Frontend Repository](https://github.com/mamun-jsx/Lab-Management-Nextjs)**

---

## Backend Features

- **JWT-Based Authentication & Route Protection**:
  - Secure login endpoint comparing hashed passwords via `bcrypt`.
  - Generates token claims with a 7-day expiration time.
  - Express route-guard middleware (`auth`) verifying Bearer tokens and enforcing permission levels (`ADMIN`, `USER`).

- **Centralized User Management API**:
  - CRUD operations to register, list, fetch, edit, or delete staff records.
  - Safe selection fields that omit password fields when returning account structures.
  - Specific business logic preventing modification/deletion of default demo admin (`EMP-1`) and user (`EMP-2`) accounts.

- **Inventory Logging & Syringe Tracking**:
  - Secure product registry (`/api/add-items`, `/api/get-items`) supporting full laboratory inventory CRUD.
  - Rigorous server-side payload validation ensuring all required attributes (`materialDescription`, `quantity`, `contentCode`, `batchLot`, `prodDate`, `expiryDate`, `custPartNo`, `orderNumber`) are populated and correctly formatted before executing query transactions.
  - Date casting and range validations ensuring clean storage in PostgreSQL.

- **Dynamic Barcode/QR Generation Service**:
  - GET `/api/qr/:id` parses requested record IDs and checks for database existence.
  - Integrates `bwip-js` internally to encode the frontend landing destination URL (`/product/:id`).
  - Streams high-fidelity barcode labels directly as `image/png` formats for seamless client-side loading and printing.

- **Prisma & DB Error Mapping Middleware**:
  - Global error filter catching and resolving internal errors.
  - Specialized adapters checking for Prisma Client exceptions:
    - **P2002**: Translates database unique constraints (e.g. duplicate email/employee ID) into a clean validation warning.
    - **P2025**: Converts database record-not-found failures to user-friendly resource warnings.
    - **P2003**: Handles database foreign key constraint failures.
    - Intercepts general validation failures and database initialization errors, replying with standard HTTP status codes (`400`, `404`, `500`) instead of leaking Prisma stack traces or system file structures.

---

## Tech Stack

- **Runtime Environment**: Node.js
- **Web Framework**: Express (v5)
- **Database Engine**: PostgreSQL (integrated via Neon DB serverless client)
- **Database ORM**: Prisma ORM with `@prisma/adapter-pg`
- **Language**: TypeScript
- **Utilities**: `bwip-js` (QR rendering), `bcrypt` (password hashing), `jsonwebtoken` (JWT creation/verification)

---

## Local Setup & Installation

Follow these steps to set up and run the backend server locally:

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- A running [PostgreSQL](https://www.postgresql.org/) database instance (or cloud connection using Neon)

### 2. Clone the Repository
```bash
git clone https://github.com/mamun-jsx/Lab-Management-postgreSQL.git
cd Lab-Management-postgreSQL
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
touch .env
```
Add the following configuration variables inside `.env`:
```env
PORT=4001
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<dbname>?sslmode=require"
FRONTEND_URL="http://localhost:3000"
JWT_SECRET="your_jwt_secret_key"
```

### 5. Run Database Migrations & Generate Prisma Client
Sync the database schema with your PostgreSQL instance:
```bash
# Generate the Prisma client
npx prisma generate

# Push schema changes to the database
npx prisma db push
```

### 6. Start the Development Server
```bash
npm run dev
```
The server will start running at `http://localhost:4001`.

### 7. Build for Production
To compile TypeScript and start the production build:
```bash
npm run build
npm start
```

---

## API Endpoints

All routes are prefixed with `/api`. Secure routes require a `Authorization: Bearer <token>` header.

### Products / Syringe Orders Routes

| HTTP Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/add-items` | `ADMIN`, `USER` | Creates a new syringe log |
| `GET` | `/api/get-items` | `ADMIN`, `USER` | Retrieves all syringe logs |
| `GET` | `/api/get-items/:id` | `ADMIN`, `USER` | Retrieves a single syringe log by ID |
| `PUT` | `/api/get-items/:id` | `ADMIN`, `USER` | Updates product details by ID |
| `DELETE` | `/api/get-items/:id` | `ADMIN` | Deletes product from DB |
| `GET` | `/api/qr/:id` | Public | Generates and sends a QR code png image linking to the frontend landing sheet |

### User Accounts Routes

| HTTP Method | Endpoint | Authorization | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/login` | Public | Authenticates credentials and returns a JWT token |
| `POST` | `/api/users` | `ADMIN` | Creates a new user profile |
| `GET` | `/api/users` | `ADMIN`, `USER` | Retrieves all user records |
| `GET` | `/api/users/:id` | `ADMIN`, `USER` | Retrieves a single user record by ID |
| `PUT` | `/api/users/:id` | `ADMIN`, `USER` | Updates account details |
| `DELETE` | `/api/users/:id` | `ADMIN` | Removes user account |

---

## License

This project is private and proprietary.
