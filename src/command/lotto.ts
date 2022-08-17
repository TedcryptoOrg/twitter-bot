import {Client, Tweet} from 'twitter.js';
import {Command} from './command';
import {CommandStructure} from "../main";
import {TedLotto} from "../services/integration/tedlotto/tedlotto";
import numbro from "numbro";
import dayjs from "dayjs";

const tedLotto = new TedLotto();

export class Lotto implements Command {
    name: string;
    description: string;
    usage: string;

    constructor() {
        this.name = 'LOTTO';
        this.description = 'Grab current stats for a given lotto';
        this.usage = 'LOTTO <chain>';
    }

    // @ts-ignore
    async run(client: Client, tweet: Tweet, command: CommandStructure) {
        const chain = command.arguments.shift();
        if (!chain) {
            console.debug('No chain provided');

            await tweet.reply({
                text: "@" + tweet.author?.username + " Please specify a chain!",
            });

            return;
        }

        console.debug('Fetching stats for chain:', chain);
        const stats = await tedLotto.fetchStats(chain);
        if (!stats) {
            console.debug('No stats found for chain:', chain);
            await tweet.reply({
                text: "@" + tweet.author?.username + " I couldn't find stats for that chain!",
            });

            return;
        }

        const numberFormatter = {
            mantissa: 2,
            optionalMantissa: true,
            average: true,
            spaceSeparated: false,
        }

        const tweetText = "@" + tweet.author?.username + " this is the stats for this week!" + "\n\n"
                + " Jackpot: " + numbro(stats.jackpot.human_value).format(numberFormatter) + " $" + stats.human_denomination.toUpperCase() + "\n"
                + " Next Draw: " + dayjs(stats.next_draw.date).format('YYYY/MM/DD HH:mm') + "(" + stats.next_draw.timezone + ")"  + "\n"
                + " Total tickets: " + stats.total_tickets + "\n"
                + " Total delegators: " + stats.total_delegators + "\n"
                + " Total staked: " + numbro(stats.total_staked.human_value).format(numberFormatter) + " $" + stats.human_denomination.toUpperCase()
        ;

        console.log('Tweeting...', tweetText);

        await tweet.reply({text: tweetText});
    }
}

exports.Lotto = new Lotto();