import {Command} from './command';
import {CommandStructure} from '../types/commandStructure';

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
