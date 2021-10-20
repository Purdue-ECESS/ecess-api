import express, {Request, Response} from "express";
import expressWs from "express-ws";

const wsExpress = expressWs(express());
const app = wsExpress.app;
const port = process.env.PORT || 3000;

app.use((req: any, res: any, next: any) => {
    console.log("middleware");
    return next();
});

app.get("/", (req: any, res: any) => {
    res.send({
        status: 'development',
        purpose: 'ECE Ambassadors',
        owner: 'Purdue ECE'
    });
});

app.get("/google", (req: Request, res: Response) => {
    const date = req.query.date || "undefined";
    res.send({
        get: date
    });
});


app.ws('/ws', (ws_param, req: Request) => {
    ws_param.on("message", (msg: string) => {
        console.log(msg);
    })
});


app.ws('/hello/:world', function(ws, req, next) {

    let interval: NodeJS.Timer | undefined = undefined;
    let message = "sending data back";

    ws.on('open', function () {
        console.log('open connection');
    })
    ws.on('message', function(msg: string, b) {
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

app.listen(port);
