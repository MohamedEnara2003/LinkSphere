import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';




@Component({
selector: 'app-btn-resend-otp',
imports: [RouterModule],
template: `
    <nav class="flex justify-center items-center mt-2" aria-label="Btn-resend-otp'" role="navigation">
    <p class="ngText font-light">Didn't receive code?</p>
    <button (click)="onClickResend.emit()" type="button" aria-label="Reset otp link" role="link"
        class="btn btn-link text-brand-color px-2 link-hover"> 
        Resend OTP
    </button>
    </nav>
`,
})
export class BtnResendOtp {
onClickResend = output<void>();
}
