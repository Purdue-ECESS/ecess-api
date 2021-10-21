import {Request, Response} from "express";
import {Bot} from "./utils/bot";
import {Message} from "discord.js";
import {Api} from "./utils/api";
import {Calendar} from "./utils/calendar";


Api.setUse(
    (req: any, res: any, next: any) => {
        res.header("Access-Control-Allow-Origin", "*");
        return next();
    }
)

Api.setGetRoute("/", (req: any, res: any) => {
    res.send({
        status: 'development',
        purpose: 'ECE Ambassadors',
        owner: 'Purdue ECE'
    });
});

Api.setGetRoute("/calendar/ambassador", async (req: Request, res: Response) => {
    const date = req.query.date || "undefined";
    const data = await Calendar.getCalendarEvents();
    res.send(data);
});

Api.setGetRoute("/bot/announcements", async (req: Request, res: Response) => {
    const response = await Bot.getAnnouncements();
    res.send(response);
});


Api.setWs('/ws', (ws_param: any, req: Request) => {
    ws_param.on("message", (msg: string) => {
        console.log(msg);
    })
});


Api.setWs('/hello/:world', function(ws: any, req: any, next: any) {

    let interval: NodeJS.Timer | undefined = undefined;
    let message = "sending data back";

    ws.on('open', function () {
        console.log('open connection');
    })
    ws.on('message', function(msg: string) {
        console.log(msg);
        if (msg === "stream" && interval === undefined) {
            interval = setInterval(() => {
                ws.send(message);
            }, 1000);
        }
        else if (msg === "end" && interval) {
            clearInterval(interval);
            interval = undefined;
        }
        else {
            message = msg;
        }
    });
    ws.on("close", function() {
        if (interval) {
            console.log("close interval");
            clearInterval(interval);
            interval = undefined;
        }
    });
    next();
});

Bot.setOnMessageCreate(async (message: Message) => {
    if (message.author.bot) {
        return;
    }
    console.log("message", message.content);
    // message.channel.send("testing deployment");
});


Api.listen();
Bot.login().then(async () => {
    console.log("discord bot is running");
});

