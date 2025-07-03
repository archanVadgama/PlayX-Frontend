# PlayX - Frontend

## 📖 Overview

**PlayX** is a user-friendly video sharing platform designed to enable seamless video uploading, sharing, and interaction. It allows users to create, upload, and manage video content while offering engagement features such as comments and likes. The platform ensures a smooth content discovery experience through advanced search and filtering capabilities. With an intuitive dashboard, content creators can efficiently manage their videos, monitor engagement, and interact with their audience. Additionally, the system provides robust administrative tools for content moderation, user management, and overall platform governance.

## 👤 User Panel Features

* **Authentication**: Sign up, login, password reset, and profile management.
* **Video Upload & Management**: Upload videos with metadata (title, description, keywords, thumbnail).
* **Interaction**: Like/dislike, comment, and report inappropriate content.
* **Search & Filtering**: By title, keywords, description, and category.
* **Subscriptions**: Follow creators and receive in-app/email notifications.
* **Watch Later**: Save videos for future viewing.

## 🛡 Admin Panel Features

* **Dashboard**: Overview of activity and content.
* **Category Management**: Create/manage video categories.
* **User Management**: Suspend/delete users and moderate content.
* **Reports**: Review and take action on reported content.


## 🛠 Tech Stack

* **Frontend**: Angular, HTML, CSS, JavaScript
* **UI Framework**: Tailwind CSS
* **Backend**: Node.js (Express) 
* **Database**:  PostgreSQL 
* **Others**:

  * JWT Authentication
  * Prisma ORM
  * FFmpeg for video processing 


## 📂 Project Structure

```
src/
│
├── app/
│   ├── shared/                             # Shared resources across app
│   │   ├── components/                     # Reusable shared components
│   │   ├── directives/                     # Custom directives
│   │   ├── pipes/                          # Reusable pipes
│   │   └── services/                       # Shared services (e.g., API, utils)
│   │   └── types/                          # Centralized types directory
│   │       ├── common.types.ts             # Shared types used across the app
│   │       ├── api.types.ts                # API request/response interfaces
│   │       ├── ui.types.ts                 # UI-related types (menus, etc.)
│   │       └── index.ts                    # Barrel file that re-exports all types
│
│   ├── layout/                             # Layouts (header/sidebar/footer)
│   │   ├── sidebar/
│   │   ├── header/
│   │   └── main/
│
│   ├── admin/                              # Admin module 
│   │   └── dashboard/
│   │   │   ├── components/                 # Components specific to dashboard
│   │   │   ├── services/                   # Services for dashboard
│   │       ├── types/                      # Admin dashboard-specific types
│   │       │   └── dashboard.types.ts
│   │   │   ├── dashboard.component.ts
│   │   │   └── dashboard.module.ts
│   │   └── ...                             # More admin modules (e.g., users, videos, reports)
│
│   ├── user/                               # User module
│   │   └──  dashboard/
│   │   │   ├── components/                 # Components for user dashboard
│   │   │   ├── services/                   # Services for user dashboard
│   │       ├── types/                      # User dashboard-specific types
│   │       │   └── dashboard.types.ts
│   │   │   ├── dashboard.component.ts
│   │   │   └── dashboard.module.ts
│   │   └── ...                             # More user modules (e.g., profile, upload videos)
│
│   ├── auth/                               # Authentication module
│   │   ├── types/                          # Auth-specific types
│   │   │   └── auth.types.ts
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── auth.module.ts
│
│   ├── core/                               # Core services and guards (singleton services)
│   │   ├── guards/                         # AuthGuard, AdminGuard, etc.
│   │   ├── interceptors/                   # HTTP Interceptors
│   │   └── core.module.ts
│
│   ├── app-routing.module.ts               # Main routing file
│   ├── app.component.ts
│   └── app.module.ts
│
├── environments/                           # Dev & Prod environment configs
│   ├── environment.ts
│   └── environment.prod.ts
│
└── index.html

```
##  Getting Started

### 1. Install Dependencies
```sh
npm install
```

### 2. Development server
```sh
ng serve 
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.
