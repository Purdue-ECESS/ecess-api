import {Awaitable, Client, Intents, Message, PartialMessage} from "discord.js";

export class Bot {

    static default: Bot = new Bot();
    client: Client

    private constructor() {
        this.client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
    }


    static setOnMessageCreate(func: (
        message: Message
    ) => Awaitable<void>) {
        this.default.client.on("messageCreate", func);
    }

    static setOnMessageDelete(func: (
        message: Message | PartialMessage
    ) => Awaitable<void>) {
        this.default.client.on("messageDelete", func);
    }

    static setOnMessageUpdate(func: (
        oldMessage: Message | PartialMessage,
        newMessage: Message | PartialMessage
    ) => Awaitable<void>) {
        this.default.client.on("messageUpdate", func);
    }

    static async login() {
        const token = process.env.DISCORD_TOKEN;
        if (token) {
            await this.default.client.login();
        }
        else {
            console.log("Discord Token Not Found");
        }
    }

}