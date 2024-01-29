import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserProfileRoutingModule } from './user-profile.routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { LoginComponent } from './login/login.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UploadPhotoComponent } from './upload-photo/upload-photo.component';
import { DataPolicyComponent } from './data-policy/data-policy.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
    EditProfileComponent,
    UploadPhotoComponent,
    DataPolicyComponent
  ],

  imports: [
    CommonModule,
    UserProfileRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
exports:[
  EditProfileComponent
],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class UserProfileModule {

}
