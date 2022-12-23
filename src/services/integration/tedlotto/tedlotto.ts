import axios from "axios";

export type LottoData = {
    name: 'string',
    slug: 'string',
    human_denomination: 'string',
    next_draw: {
        date: 'string',
        timezone_type: 'int',
        timezone: 'string'
    },
    jackpot: {
        value: 'int',
        human_value: 'string'
    },
    total_staked: {
        value: 'int',
        human_value: 'string'
    },
    total_delegators: 'int',
    total_tickets: 'int'
}

export class TedLotto {
    private baseUrl: string = 'https://lotto.tedcrypto.io/api';

    /**
     * Fetch stats for a given chain
     */
    async fetchStats(chain: string): Promise<LottoData|null> {
        console.debug('Looking up stats for chain:', chain);
        try {
            const data = (await axios.get(this.baseUrl + '/lotto/' + chain + '/stats'));

            return data.data;
        } catch (err) {
            console.log(err);

            return null;
        }
    }

    /**
     * Connect user to tedlotto
     */
    async connect(walletAddress: string, userId: string, userHandler: string): Promise<string> {
        try {
            const response = await axios.post(
                this.baseUrl + '/alerts/connect',
                {
                    'wallet_address': walletAddress,
                    'telegram_user_id': userId,
                    'telegram_user_handler': userHandler
                });

            return response.data.success
                ? 'Wallet ' + response.data.wallet + ' connected!'
                : 'Error: ' + response.data.error;
        } catch (err) {
            console.log(err);

            return 'Error: ' + err;
        }
    }

    /**
     * Disconnect user with wallet
     */
    async disconnect(walletAddress: string, userId: string, userHandler: string): Promise<string> {
        try {
            const response = await axios.post(
                this.baseUrl + '/alerts/disconnect',
                {
                    'wallet_address': walletAddress,
                    'telegram_user_id': userId,
                    'telegram_user_handler': userHandler
                });

            return response.data.success
                ? 'Wallet ' + response.data.wallet + ' connected!'
                : 'Error: ' + response.data.error;
        } catch (err) {
            console.log(err);

            return 'Error: ' + err;
        }
    }
}
