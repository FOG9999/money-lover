import { AbstractControl, FormControl } from "@angular/forms";
import { REGEX, removeAscent } from "app/consts";

let validators = {
    validateUsername: (control: AbstractControl) => {
        if (!control.value) {
            return { error: true, required: true };
        } else if (!new RegExp(REGEX.USERNAME).test(control.value)) {
            return { error: true, invalid: true };
        }
        return {};
    },
    validatePassword: (control: AbstractControl) => {
        if (!control.value) {
            return { required: true };
        } else if (!new RegExp(REGEX.PASSWORD).test(control.value)) {
            return { passwordInvalid: true };
        }
        return {};
    },
    validateName: (control: AbstractControl) => {
        if (!control.value || !control.value.trim()) {
            return { error: true, required: true };
        } else if (!new RegExp(REGEX.NAME, 'g').test(removeAscent(control.value))) {
            return { error: true, invalid: true };
        }
        return {};
    },
    validateEmail: (control: AbstractControl) => {
        if (!control.value) {
            return { error: true, required: true };
        } else if (!new RegExp(REGEX.EMAIL, 'i').test(control.value)) {
            return { error: true, invalid: true };
        }
        return {};
    },
    validateCurrency: (control: AbstractControl) => {
        if (!control.value) {
            return { error: true, required: true };
        } else if (!new RegExp(REGEX.CURRENCY).test(control.value)) {
            return { error: true, invalid: true };
        }
        return {};
    },
    validatePhoneNumber: (control: AbstractControl) => {
        if (!control.value) {
            return { error: true, required: true };
        } else if (!new RegExp(REGEX.PHONE).test(control.value)) {
            return { error: true, invalid: true };
        }
        return {};
    }
}

export { validators }