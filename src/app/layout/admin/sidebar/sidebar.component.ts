import { Component, Output, EventEmitter, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, Router, RouterModule } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { APIResponse, IMenuItem } from "@app/shared/types";
import { AuthService } from "@app/auth/services/auth.service";
import { ToastService } from "@app/shared/service/toast/toast.service";
import { ICONS } from "@app/shared/constant/icons";

@Component({
  selector: "app-sidebar",
  imports: [RouterLink, CommonModule, RouterModule],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent implements OnInit {
  @Input() isSidebarOpen: boolean = false;
  @Output() closeSidebar = new EventEmitter<void>();
  @Output() checkAdminE = new EventEmitter<void>();

  adminMenuItems!: IMenuItem[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private toast: ToastService
  ) {}

  /**
   * This method sets up the user menu items for the admin sidebar.
   *
   * @memberof SidebarComponent
   */
  setupUserMenu() {
    this.adminMenuItems = [
      {
        name: "Dashboard",
        icon: this.sanitizer
          .bypassSecurityTrustHtml(ICONS.home),
        route: "/admin",
      },
      {
        name: "Manage Users",
        icon: this.sanitizer
          .bypassSecurityTrustHtml(ICONS.users),
        route: "/admin/manage-users",
      },
      {
        name: "Manage Videos",
        icon: this.sanitizer
          .bypassSecurityTrustHtml(ICONS.video),
        route: "/admin/manage-videos",
      },
      {
        name: "Manage Categories",
        icon: this.sanitizer
          .bypassSecurityTrustHtml(ICONS.square),
        route: "/admin/manage-categories",
      },
      {
        name: "Reported Content",
        icon: this.sanitizer
          .bypassSecurityTrustHtml(ICONS.flag),
        route: "/admin/reported-content",
      },
      {
        name: "Content Moderator",
        icon: this.sanitizer
          .bypassSecurityTrustHtml(ICONS.contentWrite),
        route: "/admin/content-moderator",
      },
      {
        name: "Settings",
        icon: this.sanitizer
          .bypassSecurityTrustHtml(ICONS.setting),
        route: "/admin/settings",
      },
      {
        name: "Sign Out",
        icon: this.sanitizer
          .bypassSecurityTrustHtml(ICONS.logOut),
        callback: () => this.logout(),
      },
    ];
  }
  ngOnInit() {
    this.setupUserMenu();
  }

  /**
   * This method is used to log out the user from the application.
   *
   * @memberof SidebarComponent
   */
  logout() {
    this.authService.logOut().subscribe({
      next: (response: APIResponse<null>) => {
        if (response.status) {
          this.toast.show("success", response.message!);
          this.router.navigate(["/"]);
        }
      },
      error: (err) => {
        this.toast.show("error", err.error.message!);
      },
    });
  }

  close() {
    this.closeSidebar.emit();
  }
}
