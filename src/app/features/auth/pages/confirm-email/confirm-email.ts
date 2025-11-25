import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { SharedModule } from '../../../../shared/modules/shared.module';
import { AuthService } from '../../service/auth.service';
import { BtnResendOtp } from "../../components/btn-resend-otp/btn-resend-otp";
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { UserProfileService } from '../../../public/pages/profile/services/user-profile.service';

@Component({
  selector: 'app-confirm-email',
  imports: [SharedModule, BtnResendOtp],
  template: `
<section class="w-full min-h-svh flex items-center justify-center p-5">

  <form 
    class="w-full sm:w-xl md:w-2xl lg:w-3xl ngCard border-brand-color/10  
    border rounded-box p-5 space-y-5"
    (ngSubmit)="onSubmit($event)">
    
    <header class="w-full flex flex-col items-center gap-2">
      <h1 class="text-brand-color font-bold text-xl md:text-2xl">Verify OTP</h1>
      <p>Enter the 6-digit code sent to {{email()}}</p>
    </header>

    <legend class="fieldset-legend sr-only">OTP</legend>
    <fieldset class="fieldset space-y-5">
      <div class="flex gap-2 justify-center">
        @for (item of otpControls; let i = $index; track i) {
          <input
            type="text"
            inputmode="numeric"
            maxlength="1"
            aria-label="Digit {{ i + 1 }} of {{ otpLength() }}"
            autocomplete="one-time-code"
            class="size-10 sm:size-12 text-center border-2 border-brand-color/30 rounded-md 
            focus:outline-none focus:border-brand-color focus:ring-1 
            focus:ring-brand-color transition"
            [value]="otp()[i]"
            (keydown)="onKeyDown($event, i)"
            (paste)="onPaste($event)"
          />
        }
      </div>
      <button type="submit" class="ngBtn" [disabled]="otpValue().length !== otpLength()">Send</button>
    </fieldset>

    <p class="mt-4 text-center ngText font-light">
      OTP Entered: 
      <span class="text-brand-color font-semibold">{{ otpValue() }}</span>
    </p>

  @if(!state()){
    <app-btn-resend-otp (onClickResend)="resendConfirmEmailOtp()" />
  }

  </form>
</section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class confirmEmail {
  #authService = inject(AuthService);
  #uerService = inject(UserProfileService);
  #route = inject(ActivatedRoute);

  email = toSignal<string | null>(this.#route.queryParamMap.pipe(map((query) => query.get('email'))));
  state = toSignal<string | null>(this.#route.queryParamMap.pipe(map((query) => query.get('state'))));

  otpLength = signal<number>(6).asReadonly();
  
  // Signal لتخزين القيم
  otp = signal(Array(this.otpLength()).fill(''));

  otpControls = Array.from({ length: this.otpLength() });

  // OTP النهائي كـ computed
  otpValue = computed(() => this.otp().join('').trim());

  // التعامل مع الكتابة
  onKeyDown(event: KeyboardEvent, index: number) {
    const target = event.target as HTMLInputElement;

    // قبول الأرقام فقط
    if (/^[0-9]$/.test(event.key)) {
      this.otp.update(arr => {
        arr[index] = event.key;
        return [...arr];
      });

      if (index < this.otpLength() - 1) {
        const nextInput = target.nextElementSibling as HTMLInputElement;
        nextInput?.focus();
      }
      event.preventDefault();
    }

    // Backspace
    if (event.key === 'Backspace') {
      this.otp.update(arr => {
        arr[index] = '';
        return [...arr];
      });

      if (index > 0) {
        const prevInput = target.previousElementSibling as HTMLInputElement;
        prevInput?.focus();
      }
      event.preventDefault();
    }
  }

  // التعامل مع Paste
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    const digits = text.replace(/\D/g, '').slice(0, this.otpLength()).split('');
    this.otp.set([...digits, ...Array(this.otpLength() - digits.length).fill('')]);
  }

  // Submit form
  onSubmit(event: Event) {
    event.preventDefault();
    const code = this.otpValue();
    if (code.length === this.otpLength()) {
    
    if(!this.state()){

    const email = this.email();
    if(!email) return ;
    this.#authService.confirmEmail(code , email).subscribe();
    return
    }

    this.#uerService.confirmUpdateEmail(code).subscribe() 
    }
  }

  resendConfirmEmailOtp() : void {
  const email = this.email();
  if(!email) return ;
  this.#authService.resendConfirmEmailOtp(email).subscribe();
  }

}

