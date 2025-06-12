import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../service/dashboard.service';
import { ToastService } from '@app/shared/service/toast/toast.service';
import { DashboardData } from '../../types/dashboard.types';
import { Title } from '@angular/platform-browser';
import { IndianNumberPipe } from '@app/shared/pipes/indian-number/indian-number.pipe';
import { AppTitleService } from '@app/shared/service/app-title/app-title.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [IndianNumberPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  dashboardData!: DashboardData; 

constructor(
  private dashboardService: DashboardService,
  private toast: ToastService,
  private appTitle: AppTitleService
) {}

ngOnInit(): void {
  this.appTitle.setTitle('Dashboard');
  this.dashboardService.getDashboardStatics().subscribe({
    next: (response: any) => {
      this.dashboardData = response.data as DashboardData;
      // console.log(this.dashboardData);
      // this.toast.show("success", response.message!);
    },
    error: (err) => {
      console.error('Error fetching dashboard data:', err);
    },
  });
}

}
