import { clientInterface } from "./clientsInterface";
import { CommandStructure } from '../types/commandStructure';
import { Commands } from '../types/commands';
import { Ping } from '../command/ping';
import { APR } from '../command/apr';
import { Price } from '../command/price';
import { Lotto } from '../command/lotto';
import { Connect } from '../command/connect';
import { Telegraf } from 'telegraf';
import { Platforms } from "../enums/platforms";
import { Disconnect } from "../command/disconnect";

export class TelegramClient implements clientInterface {
    private bot: Telegraf;
    private commands: Commands;
    
    constructor(botToken: string) {
        this.bot = new Telegraf(botToken);
        this.commands = {
            'ping': new Ping(),
            'apr': new APR(),
            'price': new Price(),
            'lotto': new Lotto(),
            'connect': new Connect(),
            'disconnect': new Disconnect(),
        }
    }

    async start(): Promise<void> {
        this.bot.start((ctx) => {
            console.log('User '+ctx.from.username+' interacted with bot');
            ctx.reply('You can now use the bot! Send /help to see all available commands!');
            ctx.reply('If you want to connect your telegram account with tedlotto, ' +
                'make sure you have registered your username on your lotto profile and send /connect <cosmos-address>' +
                ' e.g.: /connect cosmos19231ureirh283bf92374213rx');
        });
        Object.keys(this.commands).forEach(commandName => {
            this.bot.command(commandName, async (ctx) => {
                console.log('Running command ' + commandName);
                const command = this.commands[commandName];
                if (!command) {
                    console.log('Command not found!');
                    return;
                }

                const messageArguments = ctx.update.message.text.split(' ');
                // Remove command name
                messageArguments.shift();
                const commandStructure:CommandStructure = {
                    'command': commandName,
                    'arguments': messageArguments,
                    'platform': Platforms.Telegram,
                    'ctx': ctx
                };

                const result = await command.run(commandStructure);
                const messsageId = ctx.update.message.message_id;
                ctx.reply(result, {reply_to_message_id : messsageId});
            })
        });
        this.bot.command('help', (ctx) => {
            ctx.reply(
                'Available commands: \n\n'
                + 'lotto - Grab lotto stats for this week. e.g.: /lotto evmos \n'
                + 'apr - Grabs the APR for any cosmos chain. e.g.: /apr juno \n'
                + 'price - Grabs current token price. e.g.: /price osmosis \n'
                + 'connect - Connect your telegram user with TedLotto\n'
            );
        });

        this.bot.launch();
    }
}
