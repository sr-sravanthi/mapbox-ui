import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { TrashComponent } from './trash/trash.component';
import { AddtrashComponent } from './addtrash/addtrash.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { PopupComponent } from './popup/popup.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TrashitemComponent } from './trashitem/trashitem.component';



@NgModule({
  declarations: [
    TrashComponent,
    AddtrashComponent,
    UserDashboardComponent,
    PopupComponent,
    TrashitemComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],

  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DashboardModule { }
