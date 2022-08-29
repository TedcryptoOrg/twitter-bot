import { TelegramClient } from './clients/telegramClient';
import { TwitterClient } from './clients/twitterClient';
import { DiscordClient } from './clients/discordClient';

require('dotenv').config()

async function main() {
    console.log('Starting up...');    

    if ("true" === process.env['TWITTER_ENABLED']) {
        console.log('Starting twitter client...');
        const twitterClient = new TwitterClient();
        twitterClient.start();
    }
    
    if ("true" === process.env['TELEGRAM_ENABLED']) {
        console.log('Starting telegram client...');
        const telegramClient = new TelegramClient(process.env['TELEGRAM_BOT_TOKEN'] ?? '');
        telegramClient.start();
    }

    if ("true" === process.env['DISCORD_ENABLED']) {
        console.log('Starting discord client...');
        const discordClient = new DiscordClient(process.env['DISCORD_CLIENT_ID'] ?? '', process.env['DISCORD_BOT_TOKEN'] ?? '');
        discordClient.start();
    }
}

main()