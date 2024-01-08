import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

const materialComponents=[MatFormFieldModule, MatInputModule,MatCheckboxModule,MatIconModule]
@NgModule({
  declarations: [],
  imports: [
    
    materialComponents
  ],
  exports: [
    
    materialComponents
  ]
})
export class MaterialModule { }
