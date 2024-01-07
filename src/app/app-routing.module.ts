import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
 { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'profile', loadChildren: () => import('./modules/user-profile/user-profile.module').then(m => m.UserProfileModule) },
  { path: 'user', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
