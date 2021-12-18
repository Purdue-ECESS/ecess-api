import {Calendar} from "../src/utils/calendar";
import {MyFbStorage} from "../src/myFb/myFbStorage";

async function calendarMain() {
    const calendar = await Calendar.getCalendarEvents();
    console.log(calendar);
}

const storage = MyFbStorage.loadStorage();
console.log("Hi there, Matthew Wen, let's goo!!");

// My hack to keep the process alive:
// setInterval(function() {
//     console.log("awake");
// }, 60000);
