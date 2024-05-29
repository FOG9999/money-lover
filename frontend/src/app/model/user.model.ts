import { Base } from "./base.model";

export interface User extends Base {
    username: string,
    avatar: string,
    firstname: string,
    lastname: string,
    address: string,
    email: string,
    mobile: string,
    status: number,
    level: string,
    dateCreated: Date,
    is_delete: boolean,
    dateUpdated: Date,
    token: string,
    /**
     * user with two factor authentication
     */
    tfaMethod: 'email' | 'sms' | 'gg-authen',
    /**
     * id of oauth when login with other system
     */
    authId: string | number;
    role: string;
}

export interface GoogleUser {
    iss: string,
    azp: string,
    aud: string,
    /**
     * user's id
     */
    sub: string,
    email: string,
    email_verified: boolean,
    nbf: number,
    name: string,
    picture: string,
    given_name: string,
    family_name: string,
    locale: string,
    iat: number,
    exp: number,
    jti: string
}