import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {TranslatePipe } from '@ngx-translate/core';

const SHARED_MODULES = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  FormsModule,
  TranslatePipe
];

@NgModule({
  imports: [...SHARED_MODULES],
  exports: [
    ...SHARED_MODULES,   
  
  ],
})

export class SharedModule {}
