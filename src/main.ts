import { Client } from 'twitter.js';
import {Command} from "./command/command";

require('dotenv').config()

const client = new Client({ events: ['FILTERED_TWEET_CREATE'] });

type Commands = {
    [key: string]: Command;
}

export type CommandStructure = {
    command: string,
    arguments: string[],
}

const commands: Commands = {
    'ping': require('./command/ping').Ping,
    'apr': require('./command/apr').APR,
}

function getParts(text: string): CommandStructure|null {
    console.log('Fetching command from tweet...');
    let textParts = text.trim().toLowerCase().split(' ');
    let mentions = 0;
    if (!textParts) {
        return null;
    }

    console.log('Tweet parts: ', textParts);

    let commandParts = [];
    for (let textPart of textParts) {
        textPart = textPart.trim();
        if (textPart.startsWith('@')) {
            // mention bot
            if ('@tedcryptobot' === textPart) {
                mentions++;
            }

            console.log('removing mention', textPart);
        } else {
            commandParts.push(textPart);
        }
    }

    if (mentions === 0) {
        console.log('No mentions found!');
    }

    console.log('Command parts:', commandParts);

    let command = commandParts.shift();
    if (!command) {
        console.error('No command found!');
        return null;
    }

    return {'command': command.toLowerCase(), 'arguments': commandParts};
}

async function main() {
    console.log('Starting up...');

    await client.login({
        consumerKey: process.env['TWITTER_CONSUMER_KEY'] ?? '',
        consumerSecret: process.env['TWITTER_CONSUMER_SECRET'] ?? '',
        accessToken: process.env['TWITTER_TOKEN_IDENTIFIER'] ?? '',
        accessTokenSecret: process.env['TWITTER_TOKEN_SECRET'] ?? '',
        bearerToken: process.env['TWITTER_BEARER_TOKEN'] ?? '',
    })

    let rules:any = [];
    (await client.filteredStreamRules.fetch([])).map(rule => {
        rules.push(rule.value);
    });

    if (!rules.includes('@tedcryptoBot')) {
        console.log('Creating rule...');
        await client.filteredStreamRules.create({ value: '@tedcryptoBot' });
    } else {
        console.log('Rules already created!');
    }

    client.on('filteredTweetCreate', async tweet => {
        try {
            const parts = getParts(tweet.text);
            if (!parts) {
                console.log('No parts found!');
                return;
            }

            console.log('Command: ' + parts.command, 'Arguments: ' + parts.arguments);
            if (!commands.hasOwnProperty(parts.command)) {
                console.log('Command not found!', parts.command);
                return;
            }

            await commands[parts.command]?.run(client, tweet, parts);
        } catch (error) {
            console.error(error);
        }
    });
}

main()