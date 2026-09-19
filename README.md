
# 🛒 InsightCart - Frontend

InsightCart is a full-stack e-commerce web application. This repository contains the **frontend** of the application, developed using **React.js**.

The frontend provides the user interface and communicates with the **Spring Boot backend** through REST APIs to retrieve and manage application data.

---

## 📌 Project Overview

InsightCart consists of two separate repositories:

- **Frontend:** `InsightCart-Frontend`
- **Backend:** `InsightCart`

The React frontend is responsible for displaying the application interface and handling user interactions.

The Spring Boot backend is responsible for business logic, REST APIs, and database operations.

### Overall Architecture

```text
                    INSIGHTCART
                         |
          ┌──────────────┴──────────────┐
          |                             |
          ↓                             ↓
   React Frontend                Spring Boot Backend
 InsightCart-Frontend               InsightCart
          |                             |
          |        REST APIs             |
          └──────────────┬──────────────┘
                         |
                         ↓
                   MySQL Database
````

---

# 🚀 Features

The frontend provides functionality such as:

* Product browsing
* Product listing
* Product category filtering
* Product details
* Shopping cart interface
* API integration with Spring Boot backend
* Responsive user interface
* Navigation between application pages
* Dynamic display of backend data

---

# 🛠️ Technologies Used

| Technology | Purpose                           |
| ---------- | --------------------------------- |
| React.js   | Building the user interface       |
| JavaScript | Frontend programming              |
| HTML       | Page structure                    |
| CSS        | Styling                           |
| Vite       | Development server and build tool |
| REST APIs  | Communication with backend        |
| Git        | Version control                   |
| GitHub     | Source code management            |
| VS Code    | Development environment           |

---

# 🏗️ Frontend Architecture

The frontend is built using React.js.

The general flow is:

```text
User
  ↓
React Components
  ↓
API Request
  ↓
Spring Boot Backend
  ↓
JSON Response
  ↓
React Components
  ↓
User Interface
```

The frontend is responsible for the presentation layer, while the backend handles business logic and database operations.

---

# 🔄 How Frontend and Backend Work Together

The React frontend and Spring Boot backend are maintained in separate GitHub repositories.

The frontend communicates with the backend using HTTP requests and REST APIs.

```text
React Frontend
      |
      | HTTP Request
      ↓
Spring Boot Backend
      |
      ↓
Controller
      |
      ↓
Service
      |
      ↓
Repository
      |
      ↓
MySQL Database
      |
      ↓
JSON Response
      |
      ↓
React Frontend
```

For example, when the frontend needs to retrieve products:

```text
React
  ↓
GET /products
  ↓
Spring Boot Backend
  ↓
MySQL
  ↓
Product Data
  ↓
JSON Response
  ↓
React
  ↓
Display Products
```

---

# 🔎 Product Category Filtering

The frontend can request products based on a category.

For example:

```text
GET /products?category=Kurtas
```

The request is sent to the Spring Boot backend.

```text
React
  ↓
Category Selected
  ↓
API Request
  ↓
Spring Boot
  ↓
Database
  ↓
Filtered Products
  ↓
React
  ↓
Display Results
```

---

# 📂 Frontend Project Structure

```text
InsightCart-Frontend
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .gitignore
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

> The exact folder and component structure may change as the project is developed.

---

# 💻 Prerequisites

Before running the frontend, install:

* Node.js
* npm
* Visual Studio Code
* Git

The Spring Boot backend and MySQL should also be running when using features that require backend data.

---

# ⚙️ Frontend Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Supriya-DB/InsightCart-Frontend.git
```

Navigate to the project:

```bash
cd InsightCart-Frontend
```

---

## 2. Install Dependencies

Run:

```bash
npm install
```

This installs all dependencies listed in `package.json`.

---

## 3. Start the Frontend

Run:

```bash
npm run dev
```

Vite will start the React development server.

The terminal will display the local URL, usually:

```text
http://localhost:5173
```

Open the URL in a browser.

---

# 🔌 Connecting Frontend with Backend

During development, the frontend and backend run on different ports.

```text
Frontend
http://localhost:5173
       |
       | REST API
       ↓
Backend
http://localhost:8080
       |
       ↓
MySQL Database
```

The React frontend sends requests to the Spring Boot backend.

For example:

```text
Frontend
   ↓
GET http://localhost:8080/products
   ↓
Spring Boot
   ↓
MySQL
   ↓
JSON Response
   ↓
Frontend
```

The backend must be running for the frontend to retrieve data from the database.

---

# ▶️ Running the Complete Application

To run the complete InsightCart application:

## Step 1: Start MySQL

Make sure your MySQL server is running.

```text
MySQL
localhost:3306
```

---

## Step 2: Start the Backend

Clone and run the backend:

```bash
git clone https://github.com/Supriya-DB/InsightCart.git
cd InsightCart
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

---

## Step 3: Start the Frontend

Open another terminal:

```bash
git clone https://github.com/Supriya-DB/InsightCart-Frontend.git
cd InsightCart-Frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔄 Complete Application Flow

```text
                         USER
                           |
                           ↓
                  React Frontend
                localhost:5173
                           |
                           | HTTP Request
                           ↓
                Spring Boot Backend
                localhost:8080
                           |
                           ↓
                     REST API
                           |
                           ↓
                       MySQL
                    localhost:3306
                           |
                           ↓
                     Database Data
                           |
                           ↓
                     JSON Response
                           |
                           ↓
                  React Frontend
                           |
                           ↓
                         USER
```

---

# 🧪 API Integration

The frontend communicates with the backend through REST API endpoints.

Example:

```text
GET /products
```

The frontend sends the request and receives the product information as a response.

The received data is then used by React components to display the products in the user interface.

---

# 🛠️ Troubleshooting

## Frontend is not starting

Check:

* Node.js is installed.
* npm is installed.
* Dependencies have been installed using `npm install`.
* The required port is available.

---

## Products are not displaying

Check:

1. Spring Boot backend is running.
2. MySQL is running.
3. Backend API URL is correct.
4. API endpoint is correct.
5. Browser console for errors.
6. Backend console for API errors.

---

## Frontend cannot communicate with backend

Check:

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:8080
```

Also verify that the backend allows requests from the frontend and that the API URL used by React is correct.

---

# 🔗 GitHub Repositories

## Frontend

**InsightCart-Frontend**

[https://github.com/Supriya-DB/InsightCart-Frontend](https://github.com/Supriya-DB/InsightCart-Frontend)

This repository contains the React frontend of InsightCart.

## Backend

**InsightCart**

[https://github.com/Supriya-DB/InsightCart](https://github.com/Supriya-DB/InsightCart)

This repository contains the Java Spring Boot backend of InsightCart.

---

# 🔗 Project Relationship

The two repositories work together to form the complete InsightCart application.

```text
┌─────────────────────────────────────┐
│       InsightCart-Frontend          │
│                                     │
│             React.js                │
│                                     │
│          User Interface             │
└──────────────────┬──────────────────┘
                   │
                   │ REST APIs
                   │ HTTP Requests
                   ↓
┌─────────────────────────────────────┐
│            InsightCart              │
│                                     │
│          Java + Spring Boot         │
│          Spring Data JPA            │
│          Hibernate                  │
│                                     │
│        Business Logic + APIs        │
└──────────────────┬──────────────────┘
                   │
                   │ JPA / Hibernate
                   ↓
┌─────────────────────────────────────┐
│              MySQL                  │
│                                     │
│           Application Data          │
└─────────────────────────────────────┘
```

---

# 👩‍💻 Author

**Supriya DB**

B.E. Information Science and Engineering

GitHub:

[https://github.com/Supriya-DB](https://github.com/Supriya-DB)

---

# ⭐ InsightCart

**Full-Stack E-Commerce Application**

### Frontend

```text
React.js
JavaScript
HTML
CSS
Vite
```

### Backend

```text
Java
Spring Boot
Spring Data JPA
Hibernate
REST APIs
```

### Database

```text
MySQL
```

````
