import {Calendar} from "../src/google/calendar";
import {Drive} from "../src/google/drive";
import {MyFbStorage} from "../src/google/myFb/myFbStorage";
import {Api} from "../src/utils/api";

async function calendarMain() {
    const calendar = await Calendar.getCalendarEvents();
    console.log(calendar);
}

async function storageMain() {
    const storage = MyFbStorage.loadStorage();
    const size = 1080;
    const object = storage.getFile("events/12-11-2021-spark/events/IMG_1042.jpg")
    await storage.resizeImgObjFromFb(object);
    const temp = await storage.listDir(`events/12-11-2021-spark/events/thumb@${size}`);
    console.log(temp);
}

async function storageDrive() {
    const drive = Drive.loadDrive();
    const response = await drive.listFiles();
    console.log(response[0]);
    // await drive.resizeImgObj(response[0]);
}

// My hack to keep the process alive:
Api.listen();
storageDrive().then(() => {
    console.log("Main")
});
