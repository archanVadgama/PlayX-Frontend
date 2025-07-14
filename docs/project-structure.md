
# Architecture & File Structure

This document provides a high-level overview of the frontend architecture and structure of the **PlayX Angular application**. It is designed to guide new developers, contributors, and stakeholders in understanding how the project is organized and how its core modules interact.

---

## 1. Tech Stack

- **Angular** – Application framework
- **TypeScript** – Static type checking
- **RxJS** – Reactive programming and data streams
- **Angular Router** – Routing and navigation
- **Tailwind CSS** – Utility-first CSS framework
- **SCSS** – Custom styling (if used)
- **JWT** – Token-based authentication
--- 
## Project Structure

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
## 3. Application Flow

1. **Routing** – Defined in `app-routing.module.ts`, routes users to appropriate modules and guards them as needed.
2. **Modules** – Feature modules (`admin/`, `user/`, `auth/`) organize related functionality and components.
3. **Components** – Contained within each module, responsible for rendering UI and handling user interaction.
4. **Services** – Handle API calls and business logic, defined per module or globally in `core/` or `shared/`.
5. **Guards/Interceptors** – Applied globally through `core/` for route protection and HTTP handling.
6. **Shared/Reusable Logic** – Abstracted into `shared/` for maximum reuse and modularity.

---

## 4. Key Folders Explained

### `shared/`

Contains components, services, directives, pipes, and types that are reused across the app.

- **components/**: UI components used in multiple places (e.g., modals, buttons).
- **directives/**: Custom Angular directives like permission toggling, auto-focus, etc.
- **pipes/**: Custom pipes like `truncate`, `formatDate`, etc.
- **services/**: Shared logic such as global notifications or utility wrappers.
- **types/**:
  - `common.types.ts`: Global types shared across modules.
  - `api.types.ts`: Interfaces for request and response data.
  - `ui.types.ts`: Interfaces for UI elements like menu items or sidebar configs.
  - `index.ts`: Barrel file exporting all types for cleaner imports.

---

### `layout/`

Contains the visual layout structure for the entire application.

- **header/**, **sidebar/**, **main/**: Components used as containers for the main views.
- Typically loaded in the root `app.component.ts`.

---

### `admin/`

Feature module for all **admin-specific** components, dashboards, and logic.

- **dashboard/**:
  - **components/**: Dashboard-specific components (e.g., video summary cards).
  - **services/**: API and logic services for dashboard data.
  - **types/**: Dashboard-specific interfaces like metrics, reports, etc.
  - **dashboard.component.ts / dashboard.module.ts**: Entry and declaration files.
- Expandable to other features like `users/`, `reports/`, and `videos/`.

---

### `user/`

Feature module for **end-user-specific** pages and functionality.

- **dashboard/**:
  - **components/**: Profile, video feed, notifications, etc.
  - **services/**: Data fetch and update for user experience.
  - **types/**: Types related to user interactions and video content.

This module can also include submodules like `profile/`, `upload-videos/`, `watch-history/`, etc.

---

### `auth/`

Manages the entire **authentication flow** for login, registration, and password reset.

- **types/**: Auth-related types like `LoginPayload`, `TokenResponse`, etc.
- **login/**, **register/**, **forgot-password/**: Components specific to each flow.
- **auth.module.ts**: Auth routing and module declaration.

---

### `core/`

Contains singleton services and logic shared across the entire app.

- **guards/**: Route protection for users/admins (`AuthGuard`, `AdminGuard`).
- **interceptors/**: HTTP interceptors for attaching tokens, logging, and error handling.
- **core.module.ts**: Global provider registration for services and guards.

---

### `environments/`

Environment configuration for `dev` and `production` builds.

- **environment.ts**: Local development settings.
- **environment.prod.ts**: Production-specific overrides.

Used in `angular.json` and `main.ts` to switch settings automatically at build time.

---

### `app.module.ts` and `app-routing.module.ts`

- **app.module.ts**: Root module that bootstraps the Angular application. Imports all feature modules.
- **app-routing.module.ts**: Centralized routing configuration with lazy-loaded routes and route guards.

---

### `index.html`

The base HTML shell of the Angular application. Angular mounts the app here at runtime via the `<app-root>` selector.

---

## 5. How to Extend the Application

- **Add a new feature**:
  - Create a new module in `admin/`, `user/`, or a new folder.
  - Add routing, components, services, and types.
- **Add new API types**:
  - Define request/response interfaces in `shared/types/api.types.ts`.
- **Implement shared logic**:
  - Add reusable pipes or components to `shared/`.
- **Guard routes**:
  - Apply logic in `core/guards/`.
- **Intercept requests globally**:
  - Use `core/interceptors/` for token injection or error transformation.

---

For more details about specific modules and development practices, refer to other documentation files within the `docs/` folder.