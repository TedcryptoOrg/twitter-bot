import {Client, Tweet} from 'twitter.js';
import {clientInterface} from "./clientsInterface";
import {CommandStructure} from '../types/commandStructure';
import {Commands} from '../types/commands';
import {Ping} from '../command/ping';
import {APR} from '../command/apr';
import {Price} from '../command/price';
import {Lotto} from '../command/lotto';
import {Platforms} from "../enums/platforms";

export class TwitterClient implements clientInterface {
    private client: Client;
    private commands: Commands;
    
    constructor() {
        this.client = new Client({ events: ['FILTERED_TWEET_CREATE'] });
        this.commands = {
            'ping': new Ping(),
            'apr': new APR(),
            'price': new Price(),
            'lotto': new Lotto(),
        }
    }

    async start(): Promise<void> {
        await this.client.login({
            consumerKey: process.env['TWITTER_CONSUMER_KEY'] ?? '',
            consumerSecret: process.env['TWITTER_CONSUMER_SECRET'] ?? '',
            accessToken: process.env['TWITTER_TOKEN_IDENTIFIER'] ?? '',
            accessTokenSecret: process.env['TWITTER_TOKEN_SECRET'] ?? '',
            bearerToken: process.env['TWITTER_BEARER_TOKEN'] ?? '',
        });
        
        // Check filter rules and create filter for bot if not found
        let rules:any = [];
        (await this.client.filteredStreamRules.fetch([])).map(rule => {
            rules.push(rule.value);
        });

        if (!rules.includes(process.env['TWITTER_BOT_NAME'])) {
            console.log('Creating rule...');
            await this.client.filteredStreamRules.create({ value: process.env['TWITTER_BOT_NAME'] ?? '' });
            console.log('Rule created!')
        } else {
            console.log('Rules already created!');
        }

        // Start to listen to the rules 
        console.log('Filtering and listening to new tweets with "' + process.env['TWITTER_BOT_NAME'] + '"');
        this.client.on('filteredTweetCreate', this.handleCommands.bind(this));
    }

    async handleCommands(tweet: Tweet) {
        console.log('Handling commands...');
        try {
            if ('@'+tweet.author?.username === process.env['TWITTER_BOT_NAME']) {
                console.log('Tweet from bot, ignoring...');
                return;
            }

            tweet.like();
            const parts = this.handleTweetCommand(tweet.text);
            if (!parts) {
                console.log('No parts found!');
                return;
            }

            console.log('Command: ' + parts.command, 'Arguments: ' + parts.arguments);
            if (!this.commands.hasOwnProperty(parts.command)) {
                console.log('Command not found!', parts.command);
                return;
            }

            const result = await this.commands[parts.command]?.run(parts);
            const text = '@' + tweet.author?.username + ' ' + result;
            await tweet.reply({text: text});
        } catch (error) {
            console.error(error);
        }
    }

    handleTweetCommand(text: string): CommandStructure|null {
        console.log('Fetching command from tweet...');
        let textParts = text.replace(/\s+/g,' ').trim().toLowerCase().split(' ');
        let mentions = 0;
        if (!textParts) {
            return null;
        }
    
        console.log('Tweet parts: ', textParts);
    
        let commandParts = [];
        for (let textPart of textParts) {
            textPart = textPart.trim();
            // Remove all mentions
            if (textPart.startsWith('@')) {
                // mention bot
                if (process.env['TWITTER_BOT_NAME'] === textPart) {
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
    
        return {
            command: command.toLowerCase(),
            arguments: commandParts,
            platform: Platforms.Twitter
        };
    }
}
