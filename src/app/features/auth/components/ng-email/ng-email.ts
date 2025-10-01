import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgControl } from "../../../../shared/components/ng-control/ng-control.";


@Component({
selector: 'app-ng-email',
imports: [NgControl],
template: `
@let Email = "email" ;
<app-ng-control
[option]="{
type : Email,
name : Email,
formControlName : Email,
label : 'Email',
id : Email,
autocomplete : Email,
inputmode : Email,
isRequired : true
}"

[form]="emailForm()" />

`,
})
export class NgEmail {
emailForm = input.required<FormGroup>();
}
