import {Request, Response} from "express";
import {Bot} from "./bot";
import {Message} from "discord.js";
import {Api} from "./api";


Api.setUse(
    (req: any, res: any, next: any) => {
        console.log("middleware");
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

Api.setGetRoute("/google", (req: Request, res: Response) => {
    const date = req.query.date || "undefined";
    res.send({
        get: date
    });
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
    console.log("message", message.content);
});


Api.listen();
Bot.login().then(() => {
    console.log("discord bot is running");
});

