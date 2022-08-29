import { clientInterface } from "./clientsInterface";
import { CommandStructure } from '../types/commandStructure';
import { Commands } from '../types/commands';
import { Ping } from '../command/ping';
import { APR } from '../command/apr';
import { Price } from '../command/price';
import { Lotto } from '../command/lotto';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";

export class DiscordClient implements clientInterface {
    private client: Client;
    private clientId: string;
    private botToken: string;
    private commands: Commands;
    
    constructor(clientId: string, botToken: string) {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
            ],
        });
        this.clientId = clientId;
        this.botToken = botToken;
        this.commands = {
            'ping': new Ping(),
            'apr': new APR(),
            'price': new Price(),
            'lotto': new Lotto(),
        }
    }

    async start(): Promise<void> {
        this.setUpCommands();

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user?.tag}!`);
          });
          
          this.client.on('interactionCreate', async interaction => {
            if (!interaction.isChatInputCommand()) return;
            const command = this.commands[interaction.commandName];

            if (!command) {
                console.log('Command not found!');
                return;
            }

            let commandArguments: string[] = [];
            if (command.options) {
                command.options.forEach(commandOption => {
                    const option = interaction.options.get(commandOption.name)?.value;
                    if (option) {
                        commandArguments.push(option.toString());
                    }
                });
            }
            
            await interaction.reply({content: 'Running command... Please wait.'});
            const commandStructure:CommandStructure = {
                command: interaction.commandName, 
                arguments: commandArguments
            };
            try {
                const result = await command.run(commandStructure);
                await interaction.editReply({content: result});
            } catch(error) {
                console.error(error);
                await interaction.editReply({content: 'There was a problem running your command. Please try again later or report the issue!'});
            }
          });
          
          this.client.login(this.botToken);
    }

    async setUpCommands(): Promise<void> {
        console.log('Started refreshing application (/) commands.');

        const rest = new REST({ version: '10' }).setToken(this.botToken);
        let commands:any = [];
        Object.keys(this.commands).forEach(commandName => {
            const command = this.commands[commandName];
            if (!command) {
                return;
            }
            
            const slashCommandBuilder = new SlashCommandBuilder();
            slashCommandBuilder.setName(commandName);
            slashCommandBuilder.setDescription(command.description);
            if (command.options) {
                command.options.forEach(commandOption => {
                    slashCommandBuilder.addStringOption(option => 
                        option
                            .setName(commandOption.name)
                            .setDescription(commandOption.description)
                            .setRequired(commandOption.required)
                    );
                });
            }
            
            commands.push(slashCommandBuilder.toJSON());
        });


        await rest.put(Routes.applicationCommands(this.clientId), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    }
}
