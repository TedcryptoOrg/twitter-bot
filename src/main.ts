import { TwitterClient } from './clients/twitterClient';

require('dotenv').config()

async function main() {
    console.log('Starting up...');    

    const twitterClient = new TwitterClient();
    twitterClient.start();
}

main()