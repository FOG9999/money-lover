import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { User } from 'app/model/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) {}

    login(username: string, password: string, platform: any) {
        let api_name = "api.v1.systemuser.login";
        return this.http.post<{email: string, rd: string} | User>(environment.SERVER_URL, {username, password, api_name, platform}, {observe: 'body'})
    }

    createUser(data: {
        username: string,
        password: string,
        firstname: string,
        lastname: string,
        email: string,
        level: 'ADMIN' | 'SYSTEM' | 'USER',
        questions: string[],
        answers: string[]
    }){
        const api_name: string = "api.v1.systemuser.signup";
        return this.http.post(environment.SERVER_URL, { api_name, ...data }, { observe: "body" });
    }

    createUserOAuth(data: {
        username: string,
        password: string,
        firstname: string,
        lastname: string,
        email: string,
        level: 'ADMIN' | 'SYSTEM' | 'USER',
        authId: number | string
    }){
        const api_name: string = "api.v1.systemuser.signupwithoauth";
        return this.http.post<User>(environment.SERVER_URL, { api_name, ...data }, { observe: "body" });
    }

    /**
     * get encrypted key from url and session_id to protect sharing or spam reload
     * @param url url to protect
     */
    getKey(url: string){
        const api_name: string = "api.v1.systemuser.getkey";
        return this.http.post<{k: string, endTime: number, url: string}>(environment.SERVER_URL, { api_name, url }, { observe: "body" });
    }

    /**
     * authenitcate the key stored in url (get from getKey)
     */
    authKey(k: string, endTime: number, url: string){
        const api_name: string = "api.v1.systemuser.authkey";
        return this.http.post<{isValid: boolean}>(environment.SERVER_URL, { api_name, k, endTime, url }, { observe: "body" });
    }

    /**
     * generate otp for login
     */
    generateOTP(email: string, rd: string){
        const api_name: string = "api.v1.systemuser.generateotp";
        return this.http.post<{redirect: string}>(environment.SERVER_URL, { api_name, email, rd }, { observe: "body" });
    }

    /**
     * verify OTP
     */
    verifyOTP(hashedSecret: string, otp: string){
        const api_name: string = "api.v1.systemuser.checktfa";
        return this.http.post<User>(environment.SERVER_URL, { api_name, r: hashedSecret, t: otp }, { observe: "body" });
    }

    /**
     * send email to change password
     */
    sendEmailChangePass(email: string){
        const api_name: string = "api.v1.systemuser.sendemailchangepassword";
        return this.http.post<{ok: boolean}>(environment.SERVER_URL, { api_name, email }, { observe: "body" });
    }

    /**
     * send form change password
     */
    changePassword(data: {email: string, t: string, oldPass: string, newPass: string, confirmNewPass: string}){
        const api_name: string = "api.v1.systemuser.changepassword";
        return this.http.post<{ok: boolean}>(environment.SERVER_URL, { api_name, ...data }, { observe: "body" });
    }

    /**
     * check if user enter a random string for email and t (token) on the url to try to open the change-password page
     */
    checkChangepasswordUrl(data: {email: string, t: string}){
        const api_name: string = "api.v1.systemuser.checkchangepasswordurl";
        return this.http.post<{ok: boolean}>(environment.SERVER_URL, { api_name, ...data }, { observe: "body" });
    }

    /**
     * validate forgot password request
     */
    validatePForgotPassRequest(data: {email: string, t: string}){
        const api_name: string = "api.v1.systemuser.handleforgotpasswordrequest";
        return this.http.post<{np: string}>(environment.SERVER_URL, { api_name, ...data }, { observe: "body" });
    }

    /**
     * send request to reset password when forgot
     */
    sendReqResetPassword(data: {email: string}){
        const api_name: string = "api.v1.systemuser.sendforgotpasswordrequest";
        return this.http.post<{email: string, t: string}>(environment.SERVER_URL, { api_name, ...data }, { observe: "body" });
    }
}