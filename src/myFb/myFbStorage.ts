/*
Image Resizer: https://www.youtube.com/watch?v=OKW8x8-qYs0
 */
import { getStorage, Storage } from "firebase-admin/storage";
import {Bucket, Notification} from '@google-cloud/storage';
import {MyFirebase} from "./myFb";
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs-extra';

export class MyFbStorage extends MyFirebase{

    private readonly storage: Storage;
    private readonly bucket: Bucket;

    private static default: MyFbStorage | undefined;
    // private imgResizeNotify: Notification;


    private constructor() {
        super();
        this.storage = getStorage(MyFirebase.app);
        this.bucket = this.storage.bucket("gs://purdue-ecess.appspot.com");
        // this.imgResizeNotify = this.bucket.notification("img_resizer");
        // this.imgResizeNotify.create('OBJECT_FINALIZE',
        //     (err, notification, response) => {
        //     console.log(notification, response);
        // });
    }

    public static loadStorage() {
        if (MyFbStorage.default === undefined) {
            MyFbStorage.default = new MyFbStorage();
        }
        return MyFbStorage.default;
    }

    async uploadFile(fileKey: string, fileName: string | undefined) {
        await this.bucket.upload(fileKey, {destination: fileName})
    }

    async getFileLink(key: string) {
        return new Promise((resolve, reject) => {
            const file = this.bucket.file(key);
            const expires = new Date((new Date()).getTime() + 10 * 60000);
            return file.getSignedUrl({
                action: 'read',
                expires
            }).then(signedUrls => {
                resolve(signedUrls[0]);
            });
        })
    }

}