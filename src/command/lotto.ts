
import {Command} from './command';
import {CommandStructure} from '../types/commandStructure';
import {TedLotto} from "../services/integration/tedlotto/tedlotto";
import numbro from "numbro";
import dayjs from "dayjs";

const tedLotto = new TedLotto();

export class Lotto implements Command {
    public name: string;
    public description: string;
    public usage: string;
    public options?: void|{name: string, description: string, required: boolean}[];

    constructor() {
        this.name = 'LOTTO';
        this.description = 'Grab current stats for a given lotto';
        this.usage = 'LOTTO <chain>';
        this.options = [
            {
                name: 'chain',
                description: 'The chain to grab the stats for',
                required: true
            }
        ]
    }

    async run(command: CommandStructure): Promise<string> {
        const chain = command.arguments.shift();
        if (!chain) {
            return 'Please specify a chain';
        }

        console.debug('Fetching stats for chain:', chain);
        const stats = await tedLotto.fetchStats(chain);
        if (!stats) {
            return 'I couldn\'t find that chain';
        }

        const numberFormatter = {
            mantissa: 2,
            optionalMantissa: true,
            average: true,
            spaceSeparated: false,
        }

        return "This is the stats for this week!" + "\n\n"
                + " Jackpot: " + numbro(stats.jackpot.human_value).format(numberFormatter) + " $" + stats.human_denomination.toUpperCase() + "\n"
                + " Next Draw: " + dayjs(stats.next_draw.date).format('YYYY/MM/DD HH:mm') + "(" + stats.next_draw.timezone + ")"  + "\n"
                + " Total tickets: " + stats.total_tickets + "\n"
                + " Total delegators: " + stats.total_delegators + "\n"
                + " Total staked: " + numbro(stats.total_staked.human_value).format(numberFormatter) + " $" + stats.human_denomination.toUpperCase()
        ;
    }
}
