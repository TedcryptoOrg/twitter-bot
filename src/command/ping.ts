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

    async run(): Promise<string> {
        return 'Pong!';
    }
}
