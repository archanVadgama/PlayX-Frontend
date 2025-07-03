import { Routes } from "@angular/router";
import { SignUpComponent } from "./auth/component/sign-up/sign-up.component";
import { LogInComponent } from "./auth/component/log-in/log-in.component";
import { PageNotFoundComponent } from "./shared/component/error/page-not-found/page-not-found.component";
import { DashboardComponent as AdminHomeComponent } from "./admin/dashboard/component/dashboard/dashboard.component";
import { MainComponent } from "./layout/user/main/main.component";
import { MainComponent as AdminMainComponent } from "./layout/admin/main/main.component";
import { VideoComponent } from "./user/home/component/video/video.component";
import { ResetPasswordComponent } from "./auth/component/reset-password/reset-password.component";
import { ForgotPasswordComponent } from "./auth/component/forgot-password/forgot-password.component";
import { checkRoleGuard } from "./shared/guard/check-role/check-role.guard";
import { UnauthorizedComponent } from "./shared/component/error/unauthorized/unauthorized/unauthorized.component";
import { UploadComponent } from "./user/upload/component/upload/upload.component";
import { checkLogInGuard } from "./shared/guard/checkLogIn/check-log-in.guard";
import { MainVideoContentComponent } from "./user/video-content/component/main-video-content/main-video-content.component";
import { SearchResultsComponent } from "./user/search-result/component/search-result/search-result.component";

export const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
      { path: "", component: VideoComponent },
      { path: "watch/:uuid", component: MainVideoContentComponent },
      { path: "results", component: SearchResultsComponent },
      {
        path: "upload",
        component: UploadComponent,
        canActivate: [checkLogInGuard],
      },
    ],
  },
  {
    path: "admin",
    component: AdminMainComponent,
    canActivate: [checkRoleGuard],
    children: [
      { path: "", component: AdminHomeComponent }, // Load specific component
    ],
  },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "reset-password/:resetToken", component: ResetPasswordComponent },
  { path: "log-in", component: LogInComponent },
  { path: "sign-up", component: SignUpComponent },
  { path: "unauthorized", component: UnauthorizedComponent },
  { path: "**", component: PageNotFoundComponent }, // Load specific component on error
];
