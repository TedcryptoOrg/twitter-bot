import {Command} from './command';
import {CommandStructure} from '../types/commandStructure';

const chainDirectory = require('../cosmos/chain_directory').ChainDirectory;

export class APR implements Command {
    public name: string;
    public description: string;
    public usage: string;
    public options: void|{name: string, description: string, required: boolean}[];

    constructor() {
        this.name = 'APR';
        this.description = 'Grab the latest APR for a chain';
        this.usage = 'APR <chain>';
        this.options = [{
            name: 'chain',
            description: 'The chain to grab the APR for',
            required: true,
        }];
    }

    async run(command: CommandStructure): Promise<string> {
        const chain = command.arguments.shift();
        if (!chain) {
            return 'Please specify a chain';
        }
        const currentAPR = await chainDirectory.getAPR(chain);
        if (!currentAPR) {
            return 'I couldn\'t find that chain';
        }

        return 'Current APR for ' + chain + ' is ' + currentAPR + '%';
    }
}
