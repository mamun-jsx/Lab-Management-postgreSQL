# Lab Management System - Backend API

This is the backend API repository for the **Lab Management System**, built with Node.js, Express, TypeScript, and Prisma ORM with PostgreSQL. It handles the business logic, database operations, and QR code generation for managing syringe orders and laboratory products.

### Frontend Repository
The frontend for this project is built using Next.js and can be found here:
🔗 **[Lab-Management-Nextjs Frontend Repository](https://github.com/mamun-jsx/Lab-Management-Nextjs)**

---

## Features

- **RESTful API**: Express routes for adding, fetching, and retrieving detailed info about syringe orders.
- **Database Management**: Integrated with PostgreSQL using Prisma ORM.
- **QR Code Generation**: Uses `bwip-js` to dynamically generate scanable QR codes that point to specific item detail pages on the frontend.
- **TypeScript**: Typed application logic for safety and developer productivity.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express (v5)
- **Database**: PostgreSQL (hosted via Neon DB or local)
- **ORM**: Prisma Client
- **Programming Language**: TypeScript
- **Utilities**: `bwip-js` (QR/barcode generation), `bcrypt` (hashing), `jsonwebtoken` (auth tokens), `zod` (validation)

---

## Local Setup & Installation

Follow these steps to set up and run the backend server locally:

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- A running [PostgreSQL](https://www.postgresql.org/) database instance (or a cloud provider like Neon/Supabase)

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
```
> **Note:** Customize `DATABASE_URL` with your database credentials. `FRONTEND_URL` is used for mapping QR code scan paths to point to the correct frontend client host.

### 5. Run Database Migrations & Generate Prisma Client
Sync the database schema with your PostgreSQL instance and generate the local Prisma Client:
```bash
# Generate the Prisma client
npx prisma generate

# Push schema changes to the database
npx prisma db push
```

### 6. Start the Development Server
Run the development server with hot-reloading:
```bash
npm run dev
```
The server will start running at `http://localhost:4001` (or whichever port you configured in your `.env` file).

### 7. Build for Production
To compile TypeScript and start the production build:
```bash
npm run build
npm start
```

---

## API Endpoints

### Products/Syringe Orders Routes
All routes are prefixed with `/api`.

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/add-items` | Creates a new syringe order/product |
| `GET` | `/api/get-items` | Retrieves all syringe orders/products |
| `GET` | `/api/get-items/:id` | Retrieves a single syringe order by ID |
| `GET` | `/api/qr/:id` | Generates and sends a QR code image (`image/png`) linking to the frontend detail page |

#### Sample Request Body for `POST /api/add-items`
```json
{
  "materialDescription": "Sterile Syringe 10ml",
  "quantity": 1000,
  "contentCode": "SYR-10ML-001",
  "batchLot": "LOT2026-A",
  "prodDate": "2026-05-26T12:00:00Z",
  "expiryDate": "2029-05-26T12:00:00Z",
  "custPartNo": "CPN-8849",
  "orderNumber": "ORD-100234"
}
```

---

## License

This project is licensed under the [ISC License](LICENSE).
