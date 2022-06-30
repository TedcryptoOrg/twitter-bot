import {Client, Tweet} from 'twitter.js';
import {Command} from './command';

export class Ping implements Command {
    name: string;
    description: string;
    usage: string;

    constructor() {
        this.name = 'ping';
        this.description = 'Ping!';
        this.usage = 'ping';
    }

    // @ts-ignore
    async run(client: Client, tweet: Tweet, command) {
        await tweet.reply({
            text: "@" + tweet.author?.username + " Pong!",
        });
    }
}

exports.Ping = new Ping();