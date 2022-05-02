import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidators {
    static passwordContainsNumber(control: AbstractControl): ValidationErrors | null {
        const regex = /\d/;

        if (control.value && regex.test(control.value)) {
            return null;
        }
        return { passwordInvalid: true };
    }

    static passwordsMatch(): ValidatorFn | null {

        return (control: AbstractControl) => {
            const password = control.get('password')?.value;
            const confirmPassword = control.get('confirmPassword')?.value;

            if (password && confirmPassword && password === confirmPassword) {
                return null;
            }

            return { passwordMissMatch: true };
        }
    }

}