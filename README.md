# Portfolify 🚀

**Portfolify** is an all-in-one platform designed to help developers and professionals build stunning portfolios and resumes in minutes. It solves the problem of creating, hosting, and managing a professional online presence by providing a dynamic, AI-powered solution.

---

## 🌟 Problem Solved

Creating a portfolio from scratch is time-consuming. Developers often spend days building their personal site instead of working on projects. Existing solutions are either too generic (Wix, Squarespace) or require too much manual coding (static sites).

**Portfolify bridges the gap** by offering:
-   **Dynamic Content Management**: Update your projects, skills, and experience via a dashboard.
-   **AI-Powered Features**: Use AI to polish your bio, descriptions, and tailor your resume for specific job applications.
-   **Resume Generation**: Auto-generate PDF resumes based on your profile data.
-   **Public Profile**: A beautiful, SEO-optimized public page to share with recruiters.

---

## 🎯 Use Cases

1.  **Job Seekers**: Create a central hub for your work and generate tailored resumes for every application.
2.  **Freelancers**: Showcase your portfolio to potential clients with a professional link.
3.  **Students**: Build your first professional presence without needing advanced web development skills.

---

## 📸 Screenshots

| Dashboard Overview | Resume Builder |
| :---: | :---: |
| ![Dashboard](https://placehold.co/600x400?text=Dashboard+Overview) | ![Resume Builder](https://placehold.co/600x400?text=Resume+Builder) |

| Public Portfolio | AI Tailoring |
| :---: | :---: |
| ![Public Portfolio](https://placehold.co/600x400?text=Public+Portfolio) | ![AI Tailoring](https://placehold.co/600x400?text=AI+Tailoring) |

---

## 🏗️ Architecture

Portfolify is built as a monorepo containing two main applications:

### 1. [Frontend Web](./frontend-web)
The user interface and public portfolio renderer.
-   **Tech Stack**: Next.js 15, React 19, Tailwind CSS, Redux Toolkit.
-   **Key Features**:
    -   Interactive Dashboard.
    -   Real-time Resume Preview.
    -   Rich Text Editor for Blogs.
    -   **[Read more in Frontend Documentation](./frontend-web/README.md)**

### 2. [Backend Node](./backend-node)
The REST API powering the platform.
-   **Tech Stack**: Node.js, Express, TypeScript, MongoDB, Google Gemini AI.
-   **Key Features**:
    -   Secure Authentication (JWT).
    -   AI Content Generation.
    -   PDF Generation Logic.
    -   **[Read more in Backend Documentation](./backend-node/README.md)**

---

## 🚀 Getting Started

To run the entire project locally, you will need to set up both the frontend and backend.

1.  **Clone the repository**:
    ```bash
    git clone git@github.com:nayanrdeveloper/Portfolify.git
    cd Portfolify
    ```

2.  **Setup Backend**:
    ```bash
    cd backend-node
    pnpm install
    # Set up .env (see backend README)
    pnpm dev
    ```

3.  **Setup Frontend**:
    ```bash
    cd ../frontend-web
    npm install
    # Set up .env.local (see frontend README)
    npm run dev
    ```

---

## 🤝 Contributing

Contributions are welcome! Please check the individual `README.md` files in each directory for specific contribution guidelines.
