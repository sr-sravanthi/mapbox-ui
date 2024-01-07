import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserProfileRoutingModule } from './user-profile.routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent
  ],

  imports: [
    CommonModule,
    UserProfileRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],


  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class UserProfileModule {

}
