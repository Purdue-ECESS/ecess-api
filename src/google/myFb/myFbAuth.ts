import {MyFirebase} from "./myFb";
import {getAuth} from 'firebase-admin/auth';
import firebase from "firebase-admin";
import {Auth} from "firebase-admin/lib/auth";

export class MyFbAuth extends MyFirebase {

    static default: MyFbAuth = new MyFbAuth();
    auth: Auth;

    private constructor() {
        super();
        this.auth = firebase.auth();
    }

    public async getUserByToken(token: string) {

    }

    public async createWithEmailAndPwd(email: string, pwd: string) {
        await this.auth.createUser({
            email: email,
            password: pwd
        })
    }

}