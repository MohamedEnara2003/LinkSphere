import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { FormControlOption, NgControl } from "../../../../../../../../../shared/components/ng-control/ng-control.";
import { UserProfileService } from '../../../../../services/user-profile.service';
import { GenderEnum, IUpdateBasicInfo, IUser } from '../../../../../../../../../core/models/user.model';
import { tap } from 'rxjs';


@Component({
  selector: 'app-update-user-info',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgControl],
  template: `
    <section class="w-full flex flex-col gap-5" aria-labelledby="user-info-title">
      <!-- Title -->
      <h2 id="user-info-title" class="text-xl font-semibold text-base-content">
        Update Profile Information
      </h2>

      <!-- Form -->
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="grid gap-4 w-full max-w-md"
        novalidate
      >
        <!-- Dynamic Controls -->
        @for (control of controls; track control.formControlName) {
          <app-ng-control
            [form]="form"
            [option]="control"
            [isShowValidationsError]="true"
          />
        }

        <!-- Submit -->
        <button type="submit" class="ngBtn w-full" 
        [disabled]="form.invalid">
          Save Changes
        </button>
      </form>


    </section>
  `,
})
export class UpdateUserInfoComponent {
  #fb = inject(NonNullableFormBuilder);
  #userSerivce = inject(UserProfileService);

  // 🔹 Reactive Form
  form = this.#fb.group({
    userName: [this.#userSerivce.user()?.userName || '', Validators.required],
    gender: [this.#userSerivce.user()?.gender || '' , [Validators.pattern(/^(male|female)$/i) ]],
    phone: [this.#userSerivce.user()?.phone || '', [Validators.pattern(/^[0-9]{10,15}$/)]],
  });

  // 🔹 Controls config
  controls: FormControlOption[] = [
    {
      type: 'text',
      formControlName: 'userName',
      label: 'Username',
      placeHolder: 'Enter your name',
      isRequired: true,
      autocomplete: 'name',
    },
    {
      type: 'select',
      formControlName: 'gender',
      label: 'Gender',
      isRequired: true,
      selectOptions: ['male', 'female'],
    },
    {
      type: 'tel',
      formControlName: 'phone',
      label: 'Phone',
      placeHolder: 'Enter your phone number',
      isRequired: true,
      inputmode: 'tel',
      autocomplete: 'tel',
    },
  ];

  filterUnchangedFields(newData: IUpdateBasicInfo): Partial<IUpdateBasicInfo> {
    const currentUser = this.#userSerivce.user();
    if (!currentUser) return {};
  
    return Object.entries(newData).reduce((changed, [key, value]) => {
      const userValue = currentUser[key as keyof IUser];
      if (value !== undefined && value !== userValue) {
        changed[key as keyof IUpdateBasicInfo] = value;
      }
      return changed;
    }, {} as Partial<IUpdateBasicInfo>);
  }
  

  onSubmit() {
    if (!this.form.valid) return;
    const values = this.form.getRawValue() as IUpdateBasicInfo;
    if (Object.keys(this.filterUnchangedFields(values)).length === 0) return ;
    this.#userSerivce.updateBasicInfo(this.filterUnchangedFields(values)).subscribe()
  }
  
}
