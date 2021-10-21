import {
    Awaitable,
    Channel,
    Client,
    Guild,
    Intents,
    Message,
    NewsChannel,
    PartialMessage,
} from "discord.js";

export class Bot {

    static default: Bot = new Bot();
    client: Client
    private guild: Promise<Guild>;

    private constructor() {
        this.client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]});
        this.guild = this.client.guilds.fetch(process.env.DISCORD_GUILD_ID || "");
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

    static async getAnnouncements() {
        const response = [];
        const channel : Channel | null = await this.default.client.channels.fetch(process.env.DISCORD_ANNOUNCEMENT_CHANNEL || "");
        const guild = await this.default.guild;
        if (channel instanceof NewsChannel) {
            const messages = await channel.messages.fetch({limit: 100});
            for (let k of messages) {
                const m: Message = k[1];
                const name = await guild.members.fetch(m.author.id);
                response.push({
                    author: name.displayName,
                    content: m.content,
                    date: m.editedAt || m.createdAt,
                    isAdvisor: name.displayName in ["Giselle", "Leigh Ann"]
                });
            }
        }
        return response;
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