import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

const SHARED_MODULES = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  FormsModule,
  TranslateModule
];

@NgModule({
  imports: [...SHARED_MODULES],
  exports: [
    ...SHARED_MODULES,   
  
  ],
})

export class SharedModule {}
