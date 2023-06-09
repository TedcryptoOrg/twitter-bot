import { TelegramClient } from './clients/telegramClient';
import { TwitterClient } from './clients/twitterClient';
import { DiscordClient } from './clients/discordClient';

require('dotenv').config()

async function startTwitterClient(): Promise<void> {
    if ("true" === process.env['TWITTER_ENABLED']) {
        console.log('Starting twitter client...');
        const twitterClient = new TwitterClient();
        try {
            await twitterClient.start();
        } catch (error) {
            console.error('Error starting twitter client: ' + error);
            // Retry in 5 minutes
            setTimeout(startTwitterClient, 5 * 60 * 1000);
        }
    }
}

async function startTelegramClient(): Promise<void> {
    if ("true" === process.env['TELEGRAM_ENABLED']) {
        console.log('Starting telegram client...');
        const telegramClient = new TelegramClient(process.env['TELEGRAM_BOT_TOKEN'] ?? '');
        try {
            await telegramClient.start();
        } catch (error) {
            console.error('Error starting telegram client: ' + error);
            // Retry in 1 minutes
            setTimeout(startTelegramClient, 60 * 1000);
        }
    }
}

async function startDiscordClient(): Promise<void> {
    if ("true" === process.env['DISCORD_ENABLED']) {
        console.log('Starting discord client...');
        const discordClient = new DiscordClient(process.env['DISCORD_CLIENT_ID'] ?? '', process.env['DISCORD_BOT_TOKEN'] ?? '');
        try {
            await discordClient.start();
        } catch (error) {
            console.error('Error starting discord client: ' + error);
            // Retry in 1 minutes
            setTimeout(startDiscordClient, 60 * 1000);
        }
    }
}

async function main() {
    console.log('Starting up...');    

    Promise.all([
        startTwitterClient(),
        startTelegramClient(),
        startDiscordClient()
    ])
}

main()