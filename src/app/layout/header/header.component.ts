import { Component, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() toggleUserMenuEvent = new EventEmitter<void>();

  isUserMenuOpen = false;

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  openUserMenu() {
    this.isUserMenuOpen = true;
  }

  closeUserMenu() {
    this.isUserMenuOpen = false;
  }
}

