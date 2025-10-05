import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormControlOption, NgControl } from "../../../../../../../../../shared/components/ng-control/ng-control.";


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
        <button type="submit" class="ngBtn w-full" [disabled]="form.invalid">
          Save Changes
        </button>
      </form>

      <!-- Preview Data -->
      @if (submitted()) {
        <div class="alert alert-success mt-4">
          <span>Profile updated successfully ✅</span>
        </div>
      }
    </section>
  `,
})
export class UpdateUserInfoComponent {
  private fb = inject(FormBuilder);

  // 🔹 Reactive Form
  form = this.fb.group({
    userName: ['Adham Zain', Validators.required],
    gender: ['male', Validators.required],
    phone: ['01027809106', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
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
      textForTranslate: 'forms.gender.', // Example: forms.gender.male
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

  // Signal for UI feedback
  submitted = signal(false);

  onSubmit() {
    if (this.form.valid) {
    this.submitted.set(true);
      // TODO: Send data to API / Supabase
    }
  }
}
