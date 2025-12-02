# Portfolify - Frontend Web Application

Portfolify is a modern, feature-rich platform that allows users to build professional portfolios and resumes with ease. This repository contains the frontend application built with Next.js 15, React 19, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (Primitives), [Lucide React](https://lucide.dev/) (Icons)
- **Rich Text Editor**: [Tiptap](https://tiptap.dev/)
- **PDF Generation**: [@react-pdf/renderer](https://react-pdf.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) (preferred)

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:nayanrdeveloper/Portfolify.git
    cd Portfolify/frontend-web
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add necessary environment variables (e.g., API base URL).
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
    ```

## 🏃‍♂️ Running the Project

### Development Server
To start the development server with hot reloading:
```bash
npm run dev
# or
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
To build the application for production:
```bash
npm run build
# or
pnpm build
```

### Start Production Server
To run the built application:
```bash
npm start
# or
pnpm start
```

## 📂 Project Structure

The project follows a feature-based and modular architecture within the `src` directory:

```
src/
├── app/                 # Next.js App Router pages and layouts
│   ├── (auth)/          # Authentication routes (login, signup)
│   ├── dashboard/       # Protected dashboard routes
│   ├── [username]/      # Public portfolio routes
│   └── layout.tsx       # Root layout
├── components/          # Reusable UI components
│   ├── ui/              # Base UI elements (Buttons, Inputs, Cards)
│   ├── resume/          # Resume builder specific components
│   ├── templates/       # Portfolio templates (Modern, Creative, etc.)
│   └── ...
├── features/            # Redux slices and feature-specific logic
│   ├── auth/            # Authentication state
│   ├── user/            # User profile state
│   └── ...
├── lib/                 # Utilities and configuration
│   ├── api.ts           # Axios instance configuration
│   ├── utils.ts         # Helper functions (cn, etc.)
│   └── store.ts         # Redux store configuration
└── ...
```

## 🧩 Component Architecture

We follow a **Atomic Design** inspired approach combined with **Feature-based** organization:

-   **UI Components (`components/ui`)**: Small, reusable, dumb components (atoms/molecules) like `Button`, `Input`, `Card`. These are built using Radix UI primitives and Tailwind CSS.
-   **Feature Components**: Complex components tied to specific business logic, often found in `app/` or specific subfolders in `components/` (e.g., `ResumeTailor`, `BlogEditor`).
-   **Templates (`components/templates`)**: Large layout components that define the look and feel of a user's public portfolio.

## 🎨 How to Add a New Portfolio Template

1.  **Create the Component**:
    Create a new file in `src/components/templates/`, e.g., `MyNewTemplate.tsx`.
    ```tsx
    import { TemplateProps } from '@/types'; // Define appropriate types

    export default function MyNewTemplate({ data }: TemplateProps) {
        return (
            <div className="my-new-template">
                <h1>{data.userDetails.fullName}</h1>
                {/* Render other sections */}
            </div>
        );
    }
    ```

2.  **Register the Template**:
    Update `src/app/[username]/page.tsx` to include your new template in the switch case.
    ```tsx
    // ... imports
    import MyNewTemplate from '@/components/templates/MyNewTemplate';

    // ... inside the component
    switch (template) {
        case 'my-new-template':
            return <MyNewTemplate data={data} />;
        // ... other cases
    }
    ```

3.  **Update Settings**:
    Ensure the backend supports the new template key (`my-new-template`) in the `userSettings` model so users can select it.

## 📏 Code Standards

-   **Linting**: We use [ESLint](https://eslint.org/) with Next.js configuration. Run `npm run lint` to check for errors.
-   **Formatting**: [Prettier](https://prettier.io/) is used for code formatting. Run `npm run format` to format code.
-   **Naming Conventions**:
    -   Components: PascalCase (e.g., `MyComponent.tsx`)
    -   Functions/Variables: camelCase (e.g., `myFunction`)
    -   Constants: UPPER_SNAKE_CASE (e.g., `MAX_COUNT`)
-   **Imports**: Absolute imports are configured using `@/` alias (e.g., `import Button from '@/components/ui/button'`).

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.
