import { TelegramClient } from './clients/telegramClient';
import { TwitterClient } from './clients/twitterClient';

require('dotenv').config()

async function main() {
    console.log('Starting up...');    

    console.log('Starting twitter client...');
    const twitterClient = new TwitterClient();
    twitterClient.start();

    console.log('Starting telegram client...');
    const telegramClient = new TelegramClient(process.env['TELEGRAM_BOT_TOKEN'] ?? '');
    telegramClient.start();
}

main()