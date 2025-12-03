import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MetaService } from '../../../../../../core/services/meta/meta.service';

@Component({
  selector: 'app-account-setting',
  imports: [CommonModule, TranslateModule],
  template: `

  <article class="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
    
    <header class="mb-6 border-b border-brand-color/10 pb-3">
      <h1 id="account-settings-heading" class="text-2xl md:text-3xl font-bold">{{ 'settings.account.title' | translate }}</h1>
      <p class="text-sm text-gray-400">{{ 'settings.account.subtitle' | translate }}</p>
    </header>

    <!-- Freeze Account -->
    <section
      class="ngCard border border-brand-color/10 rounded-box p-4 md:p-6 mb-6"
      role="region"
      aria-labelledby="freeze-account-heading"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h2 id="freeze-account-heading" class="text-lg font-semibold">{{ 'settings.account.freeze_account.title' | translate }}</h2>
          <p class="text-sm text-gray-400 mt-1">
            {{ 'settings.account.freeze_account.description' | translate }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <label class="label cursor-pointer flex items-center gap-2" [attr.aria-label]="isFrozen() ? ('settings.account.freeze_account.unfreeze_account' | translate) : ('settings.account.freeze_account.freeze_account' | translate)">
            <span class="text-sm">{{ isFrozen() ? ('settings.account.freeze_account.frozen' | translate) : ('settings.account.freeze_account.active' | translate) }}</span>
            <input
              id="freeze-switch"
              type="checkbox"
              class="ng-toggle"
              role="switch"
              [checked]="isFrozen()"
              [attr.aria-checked]="isFrozen()"
              aria-labelledby="freeze-account-heading"
              (change)="toggleFreeze()"
            />
          </label>
          <button
            type="button"
            class="btn btn-sm border border-brand-color/30 bg-transparent hover:bg-brand-color/10 text-brand-color"
            (click)="toggleFreeze()"
            [attr.aria-controls]="'freeze-switch'"
            [attr.aria-pressed]="isFrozen()"
          >
            {{ isFrozen() ? ('settings.account.freeze_account.unfreeze' | translate) : ('settings.account.freeze_account.freeze' | translate) }}
          </button>
        </div>
      </div>
      <div class="mt-3" role="status" [attr.aria-live]="'polite'">
        <span class="badge" [ngClass]="isFrozen() ? 'bg-brand-color/20 text-brand-color' : 'bg-base-200 text-gray-400'">
          {{ isFrozen() ? ('settings.account.freeze_account.account_is_frozen' | translate) : ('settings.account.freeze_account.account_is_active' | translate) }}
        </span>
      </div>
    </section>

    <!-- Two-Step Verification -->
    <section
      class="ngCard border border-brand-color/10 rounded-box p-4 md:p-6"
      role="region"
      aria-labelledby="two-step-heading"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h2 id="two-step-heading" class="text-lg font-semibold">{{ 'settings.account.two_step.title' | translate }}</h2>
          <p class="text-sm text-gray-400 mt-1">
            {{ 'settings.account.two_step.description' | translate }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <label class="label cursor-pointer flex items-center gap-2" [attr.aria-label]="twoStepEnabled() ? ('settings.account.two_step.disable_two_step' | translate) : ('settings.account.two_step.enable_two_step' | translate)">
            <span class="text-sm">{{ twoStepEnabled() ? ('settings.account.two_step.enabled' | translate) : ('settings.account.two_step.disabled' | translate) }}</span>
            <input
              id="two-step-switch"
              type="checkbox"
              class="ng-toggle"
              role="switch"
              [checked]="twoStepEnabled()"
              [attr.aria-checked]="twoStepEnabled()"
              aria-labelledby="two-step-heading"
              (change)="toggleTwoStep()"
            />
          </label>
          <button
            type="button"
            class="btn btn-sm border border-brand-color/30 bg-transparent hover:bg-brand-color/10 text-brand-color"
            (click)="toggleTwoStep()"
            [attr.aria-controls]="'two-step-switch'"
            [attr.aria-pressed]="twoStepEnabled()"
          >
            {{ twoStepEnabled() ? ('settings.account.two_step.disable' | translate) : ('settings.account.two_step.enable' | translate) }}
          </button>
        </div>
      </div>

      <div class="mt-3 flex items-center flex-wrap gap-3" role="group" [attr.aria-labelledby]="'two-step-heading'">
        <span class="badge" [ngClass]="twoStepEnabled() ? 'bg-brand-color/20 text-brand-color' : 'bg-base-200 text-gray-400'">
          {{ twoStepEnabled() ? ('settings.account.two_step.two_step_enabled' | translate) : ('settings.account.two_step.two_step_disabled' | translate) }}
        </span>
        @if (twoStepEnabled()) {
          <span class="badge" [ngClass]="twoStepVerified() ? 'bg-brand-color/20 text-brand-color' : 'bg-warning/20 text-warning'">
            {{ twoStepVerified() ? ('settings.account.two_step.verified' | translate) : ('settings.account.two_step.not_verified' | translate) }}
          </span>
        }
        @if (twoStepEnabled() && !twoStepVerified()) {
          <button
            type="button"
            class="btn btn-sm bg-brand-color text-white hover:opacity-90"
            (click)="verifyTwoStep()"
            [attr.aria-describedby]="'two-step-verify-desc'"
          >
            {{ 'settings.account.two_step.verify_now' | translate }}
          </button>
        }
        <p id="two-step-verify-desc" class="sr-only">{{ 'settings.account.two_step.verify_description' | translate }}</p>
      </div>
    </section>
  </article>

  `,
})
export class AccountSetting implements OnInit {
  readonly #metaService = inject(MetaService);
  isFrozen = signal(false);
  twoStepEnabled = signal(false);
  twoStepVerified = signal(false);

  ngOnInit() {
    this.#metaService.setMeta({
      title: 'Account Settings | Link Sphere Social',
      description: 'Manage your account settings including account freeze and two-step verification options.',
      image: '',
      url: 'settings/account'
    });
  }

  toggleFreeze(): void {
    this.isFrozen.update((current) => !current);
  }

  toggleTwoStep(): void {
    this.twoStepEnabled.update((current) => !current);
    if (!this.twoStepEnabled()) {
      this.twoStepVerified.set(false);
    }
  }

  verifyTwoStep(): void {
    if (this.twoStepEnabled()) {
      this.twoStepVerified.set(true);
    }
  }
}
