import {Command} from './command';
import {CommandStructure} from '../types/commandStructure';
import {Platforms} from "../enums/platforms";
import {TedLotto} from "../services/integration/tedlotto/tedlotto";

const tedlotto = new TedLotto();

export class Disconnect implements Command {
    public name: string;
    public description: string;
    public usage: string;
    public options?: void | { name: string; description: string; required: boolean; }[];

    constructor() {
        this.name = 'DISCONNECT';
        this.description = 'Disconnect user with lotto wallet';
        this.usage = 'DISCONNECT <cosmos-wallet-address>';
        this.options = [
            {
                name: 'wallet_address',
                description: 'The user main wallet address (can be evmos addr if user is using metamask)',
                required: true,
            }
        ];
    }

    async run(command: CommandStructure): Promise<string> {
        if (command.platform !== Platforms.Telegram) {
            return 'Only telegram is allowed to run this command!';
        }
        const id = command.ctx?.from?.id;
        const username = command.ctx?.from?.username;
        if (!id || !username) {
            return 'Problem finding your id or username';
        }
        const walletAddress = command.arguments[0];
        if (!walletAddress) {
            return 'Wallet address is required';
        }

        return await tedlotto.disconnect(walletAddress, id.toString(), username)
    }
}
