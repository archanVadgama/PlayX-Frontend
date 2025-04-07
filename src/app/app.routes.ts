import { Routes } from "@angular/router";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";
import { LogInComponent } from "./auth/log-in/log-in.component";
import { ErrorComponent } from "./shared/component/error/error.component";

export const routes: Routes = [
  {
    path: "",
    children: [
      { path: "", component: LogInComponent },
      { path: "log-in", component: LogInComponent },
      { path: "sign-up", component: SignUpComponent },
    ],
  },
  {
    path: "admin",
    children: [
      { path: "", component: LogInComponent }, // Load specific component
    ],
  },
  { path: "**", component: ErrorComponent }, // Load specific component on error
];
