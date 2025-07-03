import { Component, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {

  isUserMenuOpen = false;
  isSearchOpen = false;

  @Output() toggle = new EventEmitter<void>();

  toggleSidebar() {
    this.toggle.emit();
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

}

