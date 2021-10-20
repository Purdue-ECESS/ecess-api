import {Client, Intents} from "discord.js";

export class Bot {

    static default: Bot;
    client: Client

    constructor() {
        this.client = new Client({intents: [Intents.FLAGS.GUILDS]});
    }

    async login() {
        await this.client.login(process.env.DISCORD_TOKEN);
    }

}
Bot.default = new Bot();