# Tedcrypto twitter bot

Tedcrypto twitter bot is a simple bot that works by listening to
new tweets and to a user mention (currently: @tedcryptoBot)

### Commands

Current commands are as follow:

 - ping: Bot replies with pong
 - APR: Gets the APR for a given chain, e.g.: `@tedcryptoBot APR evmos`
 - price: Get the price from a given token, e.g.: `@tedcryptoBot price osmosis`
 - lotto: Get stats for TedLotto, e.g.: `@tedcryptoBot lotto evmos`

### Development

1. Create twitter bot 
2. Copy `.env.dist` to `.env` and fill your environment variables
3. Install npm vendors `npm install`
4. Install globally ts-node `npm -g install ts-node` (this will allow you to run the script)
5. Run `ts-node src/main.ts`

### Thanks

 - Thanks to Tom (@eco_stake) for the [Cosmos Directory](https://github.com/eco-stake/cosmos-directory)