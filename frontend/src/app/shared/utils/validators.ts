import { FormControl } from "@angular/forms";

let validators = {
    validateUsername: (control: FormControl) => {
        if (!control.value) {
            return { error: true, required: true };
        } else if (!/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(control.value)) {
            return { error: true, invalid: true };
        }
        return {};
    },
    validatePassword: (control: FormControl) => {
        if (!control.value) {
            return { error: true, required: true };
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(control.value)) {
            return { error: true, invalid: true };
        }
        return {};
    },
    validateName: (control: FormControl) => {
        if (!control.value || !control.value.trim()) {
            return { error: true, required: true };
        } else if (!/^[a-z ,.'-]+$/i.test(control.value)) {
            return { error: true, invalid: true };
        }
        return {};
    },
    validateEmail: (control: FormControl) => {
        if (!control.value) {
            return { error: true, required: true };
        } else if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(control.value)) {
            return { error: true, invalid: true };
        }
        return {};
    },
}

export { validators }