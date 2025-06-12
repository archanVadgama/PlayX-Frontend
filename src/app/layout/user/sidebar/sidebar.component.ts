import { Component, Output, EventEmitter, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink,  RouterModule } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { APIResponse, IMenuItem } from "@app/shared/types";
import { AuthService } from "@app/auth/services/auth.service";
import { ToastService } from "@app/shared/service/toast/toast.service";
import { IsLoggedInService } from "@app/shared/service/is-logged-in/is-logged-in.service";
import { ICONS } from "@app/shared/constant/icons";

@Component({
  selector: "app-sidebar",
  imports: [RouterLink, CommonModule, RouterModule],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent implements OnInit{
  @Input() isSidebarOpen: boolean = false;
  @Output() closeSidebar = new EventEmitter<void>();
  @Output() checkAdminE = new EventEmitter<void>();

  constructor(
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private isLoggedIn: IsLoggedInService,
    private toast: ToastService
  ) {}
  
  userMenuItems!: IMenuItem[];

  /**
   * This method sets up the user menu items for the sidebar.
   *
   * @memberof SidebarComponent
   */
  setupUserMenu(){
    this.userMenuItems = [
      {
        name: "Home",
        icon: this.sanitizer
          .bypassSecurityTrustHtml(ICONS.home),
        route: "/",
      },
      {
        name: "Upload Video",
        icon: this.sanitizer
          .bypassSecurityTrustHtml(ICONS.plus),
        route: "/upload",
      },
      {
        name: "My Videos",
        icon: this.sanitizer
          .bypassSecurityTrustHtml(ICONS.videoPlay),
        route: "/my-videos",
      },
      {
        name: "Liked Videos",
        icon: this.sanitizer
          .bypassSecurityTrustHtml(ICONS.like),
        route: "/liked-videos",
      },
      {
        name: "Reported Content",
        icon: this.sanitizer
          .bypassSecurityTrustHtml(ICONS.flag),
        route: "/reported-content",
      },
      this.isLoggedIn.isLoggedIn() ? 
      {
        name: "Log Out",
        icon: this.sanitizer
          .bypassSecurityTrustHtml(ICONS.logOut),
        callback: () => this.logout(),
      }
      :
      {
        name: "Log In",
        icon: this.sanitizer
          .bypassSecurityTrustHtml(ICONS.logIn),
        route: "/log-in",
      },
    ];
  }

  ngOnInit() {
    this.setupUserMenu();
  }

  logout() {
    this.authService.logOut().subscribe({
      next: (response: APIResponse<null>) => {
        if (response.status) {
          this.toast.show("success", response.message!);
          this.setupUserMenu();
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
