import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrashComponent } from './trash/trash.component';
import { AddtrashComponent } from './addtrash/addtrash.component';
import { PopupComponent } from './popup/popup.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'trash', component: TrashComponent },
  { path: 'addtrash', component: AddtrashComponent },
  { path: 'dashboard', component: UserDashboardComponent },
  { path: 'popup', component: PopupComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
