/*
Image Resizer: https://fireship.io/lessons/image-thumbnail-resizer-cloud-function/
 */
import { getStorage, Storage } from "firebase-admin/storage";
import {Bucket, Notification} from '@google-cloud/storage';
import {MyFirebase} from "./myFb";
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import sharp from 'sharp';
import * as fs from 'fs-extra';

export class MyFbStorage extends MyFirebase{

    private readonly storage: Storage;
    private readonly bucket: Bucket;

    private static default: MyFbStorage | undefined;


    private constructor() {
        super();
        this.storage = getStorage(MyFirebase.app);
        this.bucket = this.storage.bucket("gs://purdue-ecess.appspot.com");
    }

    async listDir(prefix: string) {
        let [files] = await this.bucket.getFiles({prefix});
        return files;
    }

    async resizeImgObjFromFb(object: any) {
        const filePath = object.name;
        const fileName = filePath.split('/').pop();
        const bucketDir = dirname(filePath);

        const workingDir = join(tmpdir(), 'thumbs');
        const tmpFilePath = join(workingDir, 'source.png');

        if (fileName.includes('thumb@')) {
            console.log('exiting function');
            return false;
        }

        // 1. Ensure thumbnail dir exists
        await fs.ensureDir(workingDir);

        // 2. Download Source File
        await object.download({
            destination: tmpFilePath
        });

        return await this.resizeAndUpload(fileName, workingDir,
            tmpFilePath, bucketDir);
    }

    async resizeAndUpload(
        fileName: string, workingDir: string, tmpFilePath: string,
        bucketDir: string) {

        // 3. Resize the images and define an array of upload promises
        const sizes = [240, 480, 720, 1080];

        const uploadPromises = sizes.map(async size => {
            const thumbName = `thumb@${size}_${fileName}`;
            const thumbPath = join(workingDir, thumbName);

            // Resize source image
            await sharp(tmpFilePath)
                .resize(size, size)
                .toFile(thumbPath);

            // Upload to GCS
            return this.bucket.upload(thumbPath, {
                destination: join(bucketDir, thumbName)
            });
        });

        // 4. Run the upload operations
        await Promise.all(uploadPromises);

        // 5. Cleanup remove the tmp/thumbs from the filesystem
        return fs.remove(workingDir);
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

    getFile(fileKey: string) {
        return this.bucket.file(fileKey);
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