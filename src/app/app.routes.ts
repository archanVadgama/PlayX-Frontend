import { Routes } from "@angular/router";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";
import { LogInComponent } from "./auth/log-in/log-in.component";
import { ErrorComponent } from "./shared/component/error/error.component";
import { HomeComponent as UserHomeComponent } from "./user/home/home.component";
import { HomeComponent as AdminHomeComponent } from "./admin/home/home.component";
import { SidebarComponent } from "./layout/sidebar/sidebar.component";
import { MainComponent } from "./layout/main/main.component";

export const routes: Routes = [
  {
    path: "",
    children: [
      { path: "", component: UserHomeComponent },
      { path: "home", component: UserHomeComponent },
      { path: "log-in", component: LogInComponent },
      { path: "sign-up", component: SignUpComponent },
    ],
  },
  {
    path: "admin",
    children: [
      { path: "", component: AdminHomeComponent }, // Load specific component
    ],
  },
  { path: "**", component: ErrorComponent }, // Load specific component on error
];
