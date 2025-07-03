import { Component, Output, EventEmitter, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ButtonComponent } from "@app/shared/component/button/button.component";

@Component({
  selector: "app-header",
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})

export class HeaderComponent implements OnInit {
  isUserMenuOpen = false;
  isSearchOpen = false;
  isFilterMenuOpen = false;

  selectedUploadDate: string = "";
  selectedDuration: string = "";
  selectedSortBy: string = "";
  searchQuery: string = "";

  // Component properties
  tempSelectedUploadDate: string = "";
  tempSelectedDuration: string = "";
  tempSelectedSortBy: string = "";
  
  uploadOptions = [
    "Last hour",
    "Today",
    "This week",
    "This month",
    "This year",
  ];
  durationOptions = ["Under 4 minutes", "4 - 20 minutes", "Over 20 minutes"];
  sortOptions = ["Relevance", "Upload date", "View count", "Duration"];

  @Output() toggle = new EventEmitter<void>();

  constructor(private router: Router, private route: ActivatedRoute) {}

  // Lifecycle hook to initialize component
  // This method retrieves query parameters from the URL to set initial filter values and search query.
  ngOnInit(): void {
    const urlParams = this.router.routerState.snapshot.root.queryParams;
    this.searchQuery = urlParams["search_query"] || "";
    this.selectedUploadDate = urlParams["upload_date"] || "";
    this.selectedDuration = urlParams["duration"] || "";
    this.selectedSortBy = urlParams["sort_by"] || "";
  }

  toggleSidebar() {
    this.toggle.emit();
  }

  showFilterButton() {
    return this.router.url.startsWith("/results");
  }
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  toggleFilterMenu() {
    this.isFilterMenuOpen = !this.isFilterMenuOpen;
  }

  // Search functionality
  onSearch(): void {
    const query = this.searchQuery.trim();
    if (query.length < 3) {
      alert('Please enter at least 3 characters to search');
      return;
    }
    
    if (query) {
      this.router.navigate(["/results"], {
        queryParams: { search_query: query },
      });
    }
  }
  
  // Apply filter button action
  applyFilters() {
    this.selectedUploadDate = this.tempSelectedUploadDate;
    this.selectedDuration = this.tempSelectedDuration;
    this.selectedSortBy = this.tempSelectedSortBy;
  
    const uploadMap: Record<string, string> = {
      "Last hour": "u_lh_x9z",
      "Today": "u_td_7s8",
      "This week": "u_tw_g6q",
      "This month": "u_tm_k2v",
      "This year": "u_ty_p4b",
    };
  
    const durationMap: Record<string, string> = {
      "Under 4 minutes": "d_u4_9z3",
      "4 - 20 minutes": "d_420_j5k",
      "Over 20 minutes": "d_o20_m1n",
    };
  
    const sortMap: Record<string, string> = {
      "Relevance": "s_rel_88a",
      "Upload date": "s_udt_6cx",
      "View count": "s_vc_k7f",
      "Duration": "s_dur_q0e",
    };
  
    // Clone the current query params
    const queryParams: Record<string, string> = { ...this.route.snapshot.queryParams };
  
    // Update with new encoded filters
    if (this.selectedUploadDate) {
      queryParams['upload_date'] = uploadMap[this.selectedUploadDate];
    } else {
      delete queryParams['upload_date'];
    }
  
    if (this.selectedDuration) {
      queryParams['duration'] = durationMap[this.selectedDuration];
    } else {
      delete queryParams['duration'];
    }
  
    if (this.selectedSortBy) {
      queryParams['sort_by'] = sortMap[this.selectedSortBy];
    } else {
      delete queryParams['sort_by'];
    }
  
    // Navigate to update URL with merged filters
    this.router.navigate(["/results"], {
      queryParams,
      queryParamsHandling: "merge",
    });
  
    this.toggleFilterMenu(); // Close the filter popup
  }
  
  // Clear all filters
  clearAllFilters() {
    this.tempSelectedUploadDate = "";
    this.tempSelectedDuration = "";
    this.tempSelectedSortBy = "";

    this.selectedUploadDate = "";
    this.selectedDuration = "";
    this.selectedSortBy = "";

    const currentParams = { ...this.route.snapshot.queryParams };
    delete currentParams["upload_date"];
    delete currentParams["duration"];
    delete currentParams["sort_by"];
    this.applyFilters(); // Apply the cleared filters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: currentParams,
    });
  }
}
