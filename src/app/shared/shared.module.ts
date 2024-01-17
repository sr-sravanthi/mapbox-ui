import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MapboxComponent } from './mapbox/mapbox.component';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [HeaderComponent,
    FooterComponent,
    MapboxComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [MapboxComponent]
})
export class SharedModule { }
