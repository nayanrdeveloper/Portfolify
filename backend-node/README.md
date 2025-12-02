# Portfolify - Backend API

The backend for Portfolify is a robust Node.js application built with Express and TypeScript. It provides a RESTful API for managing user portfolios, authentication, media uploads, and AI-powered features.

## 🚀 Tech Stack

-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
-   **Validation**: [Zod](https://zod.dev/)
-   **Authentication**: JWT (JSON Web Tokens)
-   **File Storage**: [Cloudinary](https://cloudinary.com/) with [Multer](https://github.com/expressjs/multer)
-   **AI Integration**: [Google Gemini API](https://ai.google.dev/)
-   **Logging**: [Pino](https://github.com/pinojs/pino)

## 🛠️ Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [pnpm](https://pnpm.io/) (preferred) or npm
-   [MongoDB](https://www.mongodb.com/) (Local or Atlas)
-   [Cloudinary Account](https://cloudinary.com/) (for image uploads)
-   [Google AI Studio Key](https://aistudio.google.com/) (for AI features)

## 📦 Installation

1.  **Navigate to the backend directory:**
    ```bash
    cd Portfolify/backend-node
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    # or
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the `backend-node` root directory and add the following variables:

    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/portfolify
    JWT_SECRET=your_super_secret_jwt_key
    JWT_EXPIRES_IN=7d
    
    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    # Google Gemini AI
    GEMINI_API_KEY=your_gemini_api_key
    ```

## 🏃‍♂️ Running the Server

### Development Mode
To start the server with hot-reloading (using `ts-node-dev`):
```bash
pnpm dev
# or
npm run dev
```
The server will start at `http://localhost:5000`.

### Production Build
To build and start the production server:
```bash
pnpm build
pnpm start
```

## � API Reference

Base URL: `http://localhost:5000/api/v1`

### 🔐 Authentication

#### Register User
-   **Endpoint**: `POST /auth/signup`
-   **Payload**:
    ```json
    {
        "fullName": "John Doe",
        "email": "john@example.com",
        "password": "password123",
        "slug": "john-doe"
    }
    ```
-   **Response**:
    ```json
    {
        "message": "User registered successfully",
        "data": {
            "user": {
                "_id": "65b2...",
                "email": "john@example.com",
                "fullName": "John Doe"
            },
            "accessToken": "eyJhbG..."
        }
    }
    ```

#### Login
-   **Endpoint**: `POST /auth/login`
-   **Payload**:
    ```json
    {
        "email": "john@example.com",
        "password": "password123"
    }
    ```
-   **Response**:
    ```json
    {
        "message": "Login successful",
        "data": {
            "user": { ... },
            "accessToken": "eyJhbG..."
        }
    }
    ```

---

### 🛠️ Skills

#### Create Skill
-   **Endpoint**: `POST /skills`
-   **Headers**: `Authorization: Bearer <token>`
-   **Payload**:
    ```json
    {
        "name": "JavaScript",
        "progress": 85,
        "categoryNames": ["General"]
    }
    ```
-   **Response**:
    ```json
    {
        "message": "Skill created",
        "data": {
            "user": "692ae060285abdfe6ba77619",
            "name": "JavaScript",
            "progress": 85,
            "categoryIds": ["69284932bae3ed96344a591f"],
            "_id": "692e7958e3275a7b3deae802",
            "createdAt": "2025-12-02T05:30:00.115Z",
            "updatedAt": "2025-12-02T05:30:00.115Z",
            "__v": 0
        }
    }
    ```

#### List My Skills
-   **Endpoint**: `GET /skills`
-   **Headers**: `Authorization: Bearer <token>`
-   **Response**:
    ```json
    {
        "message": "Skills retrieved",
        "data": [ ... ]
    }
    ```

---

### 📂 Projects

#### Create Project
-   **Endpoint**: `POST /projects`
-   **Headers**: `Authorization: Bearer <token>`
-   **Payload**:
    ```json
    {
        "name": "Portfolify",
        "description": "A portfolio builder app",
        "demoLink": "https://portfolify.com",
        "githubLink": "https://github.com/user/portfolify",
        "mediaUrls": ["https://res.cloudinary.com/.../image.png"]
    }
    ```
-   **Response**:
    ```json
    {
        "message": "Project created",
        "data": { ... }
    }
    ```

---

### 💼 Experience

#### Add Experience
-   **Endpoint**: `POST /experiences`
-   **Headers**: `Authorization: Bearer <token>`
-   **Payload**:
    ```json
    {
        "title": "Senior Developer",
        "company": "Tech Corp",
        "location": "New York, NY",
        "startDate": "2022-01-01",
        "isCurrent": true,
        "description": "Leading the frontend team."
    }
    ```

---

### 🎓 Education

#### Add Education
-   **Endpoint**: `POST /educations`
-   **Headers**: `Authorization: Bearer <token>`
-   **Payload**:
    ```json
    {
        "institution": "University of Tech",
        "degree": "B.S. Computer Science",
        "startDate": "2018-09-01",
        "endDate": "2022-05-20",
        "description": "Graduated with honors."
    }
    ```

---

### 📝 Blogs

#### Create Article
-   **Endpoint**: `POST /blogs`
-   **Headers**: `Authorization: Bearer <token>`
-   **Payload**:
    ```json
    {
        "title": "Understanding React Server Components",
        "content": "<p>Rich text content here...</p>",
        "summary": "A deep dive into RSC.",
        "tags": ["React", "Next.js"],
        "isPublished": true
    }
    ```

---

### ✨ AI Features

#### Polish Content
-   **Endpoint**: `POST /ai/polish`
-   **Headers**: `Authorization: Bearer <token>`
-   **Payload**:
    ```json
    {
        "text": "i want to make this text better and more professional"
    }
    ```
-   **Response**:
    ```json
    {
        "message": "Content polished",
        "data": {
            "polishedText": "I aim to enhance this text to sound more professional and refined."
        }
    }
    ```

#### Tailor Resume
-   **Endpoint**: `POST /ai/tailor`
-   **Headers**: `Authorization: Bearer <token>`
-   **Payload**:
    ```json
    {
        "jobDescription": "We are looking for a React developer...",
        "currentResume": "Experienced web developer..."
    }
    ```

## 🧪 Testing with Postman

1.  **Import Collection**: Create a new collection in Postman for "Portfolify".
2.  **Set Environment**: Create an environment with a variable `base_url` set to `http://localhost:5000/api/v1`.

### How to Add Bearer Token (Authentication)
Most endpoints require authentication. After logging in:

1.  **Login**: Send a `POST` request to `/auth/login`.
2.  **Copy Token**: Copy the `accessToken` from the response body.
3.  **Set Authorization**:
    -   Go to the **Authorization** tab of your request (or the Collection parent).
    -   Select **Type**: `Bearer Token`.
    -   Paste the token into the **Token** field.
4.  **Send Request**: Now you can access protected routes like `/projects` or `/user-details`.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/new-api`).
3.  Commit changes (`git commit -m 'Add new API endpoint'`).
4.  Push to branch (`git push origin feature/new-api`).
5.  Open a Pull Request.
