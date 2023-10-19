import { AbstractControl, FormControl } from "@angular/forms";

let validators = {
    validateUsername: (control: AbstractControl) => {
        if (!control.value) {
            return { error: true, required: true };
        } else if (!/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(control.value)) {
            return { error: true, invalid: true };
        }
        return {};
    },
    validatePassword: (control: AbstractControl) => {
        if (!control.value) {
            return { required: true };
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(control.value)) {
            return { passwordInvalid: true };
        }
        return {};
    },
    validateName: (control: AbstractControl) => {
        if (!control.value || !control.value.trim()) {
            return { error: true, required: true };
        } else if (!/^[a-z ,.'-]+$/i.test(control.value)) {
            return { error: true, invalid: true };
        }
        return {};
    },
    validateEmail: (control: AbstractControl) => {
        if (!control.value) {
            return { error: true, required: true };
        } else if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(control.value)) {
            return { error: true, invalid: true };
        }
        return {};
    },
    validateCurrency: (control: AbstractControl) => {
        if (!control.value) {
            return { error: true, required: true };
        } else if (!/^\$?(([1-9]\d{0,2}(.\d{3})*)|0)?$/.test(control.value)) {
            return { error: true, invalid: true };
        }
        return {};
    },
    validatePhoneNumber: (control: AbstractControl) => {
        if (!control.value) {
            return { error: true, required: true };
        } else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(control.value)) {
            return { error: true, invalid: true };
        }
        return {};
    }
}

export { validators }