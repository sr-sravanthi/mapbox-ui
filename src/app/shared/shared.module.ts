import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MapboxComponent } from './mapbox/mapbox.component';

@NgModule({
  declarations: [HeaderComponent,
    FooterComponent,
    MapboxComponent,],
  imports: [
    CommonModule,
  ],
  exports: [MapboxComponent]
})
export class SharedModule { }
