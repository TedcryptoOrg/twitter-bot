import {Command} from './command';

export class Ping implements Command {
    public name: string;
    public description: string;
    public usage: string;

    constructor() {
        this.name = 'ping';
        this.description = 'Ping!';
        this.usage = 'ping';
    }

    async run(): Promise<string> {
        return 'Pong!';
    }
}
