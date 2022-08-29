import {Command} from './command';
import {CommandStructure} from '../types/commandStructure';
import {CoinGecko} from "../services/integration/coingecko/coingecko";

const coinGecko = new CoinGecko();

export class Price implements Command {
    public name: string;
    public description: string;
    public usage: string;
    public options?: void | { name: string; description: string; required: boolean; }[];

    constructor() {
        this.name = 'PRICE';
        this.description = 'Grab current price for a token';
        this.usage = 'PRICE <chain|token>';
        this.options = [
            {
                name: 'chain_or_token',
                description: 'The chain or token to grab the price for',
                required: true,
            }
        ];
    }

    async run(command: CommandStructure): Promise<string> {
        const coinId = command.arguments.shift();
        if (!coinId) {
            return 'Please specify a coin';
        }

        console.debug('Fetching price for coin id:', coinId);
        const currentPrice = await coinGecko.getPrice(coinId);
        if (!currentPrice) {
            return 'I couldn\'t find that coin!';
        }

        return 'Current price for ' + coinId + ' is $' + currentPrice + '!';
    }
}
