import { Routes } from "@angular/router";
import { SignUpComponent } from "./auth/sign-up/sign-up.component";
import { LogInComponent } from "./auth/log-in/log-in.component";
import { ErrorComponent } from "./shared/component/error/error.component";
import { HomeComponent as AdminHomeComponent } from "./admin/home/home.component";
import { MainComponent } from "./layout/main/main.component";
import { VideoComponent } from "./user/home/component/video/video.component";

export const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
      { path: "", component: VideoComponent },
      {
        path: "admin",
        children: [
          { path: "", component: AdminHomeComponent }, // Load specific component
        ],
      },
    ],
  },
  { path: "log-in", component: LogInComponent },
  { path: "sign-up", component: SignUpComponent },
  { path: "**", component: ErrorComponent }, // Load specific component on error
];
