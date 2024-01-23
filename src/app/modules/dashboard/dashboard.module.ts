import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { AddtrashComponent } from './addtrash/addtrash.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TrashitemComponent } from './trashitem/trashitem.component';
import { TrashTabComponent } from './trash-tab/trash-tab.component';
import { MapboxComponent } from 'src/app/shared/mapbox/mapbox.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrashitemPopupComponent } from './trashitem-popup/trashitem-popup.component';



@NgModule({
  declarations: [
    AddtrashComponent,
    UserDashboardComponent,
    TrashitemComponent,
    TrashTabComponent,
    TrashitemPopupComponent

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule { }
