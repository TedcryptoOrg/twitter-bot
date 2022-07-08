import {Client, Tweet} from 'twitter.js';
import {Command} from './command';
import {CommandStructure} from "../main";
import {CoinGecko} from "../services/integration/coingecko/coingecko";

const coinGecko = new CoinGecko();

export class Price implements Command {
    name: string;
    description: string;
    usage: string;

    constructor() {
        this.name = 'PRICE';
        this.description = 'Grab current price for a token';
        this.usage = 'PRICE <chain|token>';
    }

    // @ts-ignore
    async run(client: Client, tweet: Tweet, command: CommandStructure) {
        const coinId = command.arguments.shift();
        if (!coinId) {
            console.debug('No coin id provided');

            await tweet.reply({
                text: "@" + tweet.author?.username + " Please specify a coin id!",
            });

            return;
        }

        console.debug('Fetching price for coin id:', coinId);
        const currentPrice = await coinGecko.getPrice(coinId);
        if (!currentPrice) {
            console.debug('No price found for coin id:', coinId);
            await tweet.reply({
                text: "@" + tweet.author?.username + " I couldn't find that coin price!",
            });

            return;
        }

        const tweetText = "@" + tweet.author?.username
                + " current price for " + coinId
                + " is $" + currentPrice + "!";

        console.log('Tweeting...', tweetText);

        await tweet.reply({text: tweetText});
    }
}

exports.Price = new Price();