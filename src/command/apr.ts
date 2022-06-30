import {Client, Tweet} from 'twitter.js';
import {Command} from './command';
import {CommandStructure} from "../main";

const chainDirectory = require('../cosmos/chain_directory').ChainDirectory;

export class APR implements Command {
    name: string;
    description: string;
    usage: string;

    constructor() {
        this.name = 'APR';
        this.description = 'Grab the latest APR for a chain';
        this.usage = 'APR <chain>';
    }

    // @ts-ignore
    async run(client: Client, tweet: Tweet, command: CommandStructure) {
        const chain = command.arguments.shift();
        if (!chain) {
            await tweet.reply({
                text: "@" + tweet.author?.username + " Please specify a chain!",
            });

            return;
        }
        const currentAPR = await chainDirectory.getAPR(chain);
        if (!currentAPR) {
            await tweet.reply({
                text: "@" + tweet.author?.username + " I couldn't find that chain APR!",
            });

            return;
        }

        const tweetText = "@" + tweet.author?.username
                + " current APR for " + chain
                + " is " + currentAPR + "%!";

        console.log('Tweeting...', tweetText);

        await tweet.reply({text: tweetText});
    }
}

exports.APR = new APR();