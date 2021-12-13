import { applicationDefault, initializeApp } from 'firebase-admin/app';
import {credential} from "firebase-admin";
import {App} from "firebase-admin/lib/app/core";

export class MyFirebase {

    static app: App;

    constructor() {
        if (MyFirebase.app === undefined) {
            MyFirebase.app = initializeApp({
                credential: applicationDefault()
            });
        }
    }
}
