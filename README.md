# PlayX - Frontend

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
